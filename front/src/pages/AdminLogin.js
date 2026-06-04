import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FiArrowLeft, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import './AdminLogin.css';

const getApiUrl = () => {
  const url = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace(/\/+$/, '');
  return url.endsWith('/api') ? url : `${url}/api`;
};

const googleErrors = {
  google_state: 'Session Google expiree. Reessayez.',
  google_token: 'Google n a pas pu confirmer la connexion.',
  google_profile: 'Profil Google indisponible.',
  google_denied: 'Ce compte Google n est pas autorise.',
};

const AdminLogin = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({
    name: 'Admin Coffee Arts Paris',
    email: 'admin@coffeeartsparis.com',
    password: 'Admin1234!',
  });
  const [error, setError] = useState(googleErrors[searchParams.get('error')] || '');
  const [showPassword, setShowPassword] = useState(false);
  const isSignup = mode === 'signup';

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      if (isSignup) {
        await register.mutateAsync(form);
      } else {
        await login.mutateAsync({ email: form.email, password: form.password });
      }
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Connexion impossible');
    }
  };

  const changeMode = (nextMode) => {
    setMode(nextMode);
    setError('');
  };

  const continueWithGoogle = () => {
    setError('');
    window.location.href = `${getApiUrl()}/auth/google`;
  };

  return (
    <main className="admin-login-page">
      <form className="admin-login-card" onSubmit={submit}>
        <h1>Coffee Arts Paris</h1>

        <div className="login-tabs" aria-label="Authentification">
          <button
            className={`login-tab ${!isSignup ? 'login-tab--active' : ''}`}
            type="button"
            onClick={() => changeMode('login')}
          >
            Connexion
          </button>
          <button
            className={`login-tab ${isSignup ? 'login-tab--active' : ''}`}
            type="button"
            onClick={() => changeMode('signup')}
          >
            Inscription
          </button>
        </div>

        {isSignup && (
          <label className="login-field">
            <span>Nom</span>
            <input
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              placeholder="Nom"
              type="text"
              required
            />
          </label>
        )}

        <label className="login-field">
          <span>Email</span>
          <input
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            placeholder="Email"
            type="email"
            required
          />
        </label>

        <label className="login-field login-password-field">
          <span>Mot de passe</span>
          <input
            type={showPassword ? 'text' : 'password'}
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            placeholder="Mot de passe"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </label>

        {error && <span className="admin-error">{error}</span>}
        <button className="login-submit" type="submit" disabled={login.isPending || register.isPending}>
          {isSignup ? 'Creer le compte' : 'Se connecter'}
        </button>

        <div className="login-separator"><span>OU</span></div>

        <button className="google-login-button" type="button" onClick={continueWithGoogle}>
          <span aria-hidden="true">G</span>
          Continuer avec Google
        </button>

        <p className="login-signup">
          {isSignup ? 'Deja un compte ? ' : 'Pas encore de compte ? '}
          <button type="button" onClick={() => changeMode(isSignup ? 'login' : 'signup')}>
            {isSignup ? 'Se connecter' : "S'inscrire"}
          </button>
        </p>
      </form>
      <Link className="login-back-link" to="/">
        <FiArrowLeft />
        Retour à l'accueil
      </Link>
    </main>
  );
};

export default AdminLogin;
