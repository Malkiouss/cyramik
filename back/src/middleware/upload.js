const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) return cb(new Error('Only image uploads are allowed'));
    return cb(null, true);
  },
});

const uploadToCloudinary = (file, folder = 'coffee-arts-paris') => new Promise((resolve, reject) => {
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    return reject(new Error('Cloudinary environment variables are not configured'));
  }

  const stream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
    if (error) return reject(error);
    return resolve(result.secure_url);
  });
  stream.end(file.buffer);
});

module.exports = { upload, uploadToCloudinary };
