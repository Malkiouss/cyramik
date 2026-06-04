const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { body } = require('express-validator');
const User = require('../models/User.model');
const generateToken = require('../utils/generateToken');
const { asyncHandler } = require('../middleware/errorHandler');
const { sendSuccess, toClient } = require('./response');

const cookieOptions = {
  httpOnly: true,
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const stateCookieOptions = {
  ...cookieOptions,
  maxAge: 10 * 60 * 1000,
};

const loginRules = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

const getClientUrl = () => (process.env.CLIENT_URL || 'http://localhost:3000').split(',')[0].trim().replace(/\/+$/, '');

const requireGoogleConfig = () => {
  const required = ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GOOGLE_REDIRECT_URI'];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length) {
    const error = new Error(`Missing Google OAuth config: ${missing.join(', ')}`);
    error.statusCode = 500;
    throw error;
  }
};

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: String(email).toLowerCase() }).select('+password');

  if (!user || !user.isActive || !user.password || !(await bcrypt.compare(password, user.password))) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken(user);
  res.cookie('accessToken', token, cookieOptions);
  const userObject = user.toObject();
  delete userObject.password;
  sendSuccess(res, { user: toClient(userObject) });
});

const googleStart = asyncHandler(async (req, res) => {
  requireGoogleConfig();

  const state = crypto.randomBytes(24).toString('hex');
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    response_type: 'code',
    scope: 'openid email profile',
    state,
    access_type: 'offline',
    prompt: 'select_account',
  });

  res.cookie('googleOAuthState', state, stateCookieOptions);
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
});

const googleCallback = asyncHandler(async (req, res) => {
  requireGoogleConfig();

  const clientUrl = getClientUrl();
  const { code, state } = req.query;

  if (!code || !state || state !== req.cookies?.googleOAuthState) {
    return res.redirect(`${clientUrl}/login?error=google_state`);
  }

  res.clearCookie('googleOAuthState', stateCookieOptions);

  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      grant_type: 'authorization_code',
    }),
  });

  if (!tokenResponse.ok) {
    return res.redirect(`${clientUrl}/login?error=google_token`);
  }

  const tokens = await tokenResponse.json();
  const profileResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });

  if (!profileResponse.ok) {
    return res.redirect(`${clientUrl}/login?error=google_profile`);
  }

  const profile = await profileResponse.json();
  const email = String(profile.email || '').toLowerCase();
  const adminEmail = String(process.env.ADMIN_EMAIL || '').toLowerCase();

  if (!profile.email_verified || !email || email !== adminEmail) {
    return res.redirect(`${clientUrl}/login?error=google_denied`);
  }

  const user = await User.findOneAndUpdate(
    { email },
    {
      $set: {
        name: profile.name || email.split('@')[0],
        googleId: profile.sub,
        role: 'admin',
        isActive: true,
        avatar: profile.picture,
      },
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  const token = generateToken(user);
  res.cookie('accessToken', token, cookieOptions);
  return res.redirect(`${clientUrl}/admin`);
});

const logout = asyncHandler(async (req, res) => {
  res.clearCookie('accessToken', cookieOptions);
  sendSuccess(res, { message: 'Logged out' });
});

const me = asyncHandler(async (req, res) => {
  sendSuccess(res, { user: toClient(req.user) });
});

module.exports = { loginRules, login, googleStart, googleCallback, logout, me };
