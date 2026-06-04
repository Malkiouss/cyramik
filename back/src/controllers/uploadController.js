const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No image uploaded' });

    if (process.env.CLOUDINARY_CLOUD_NAME) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'cyramik',
      });
      return res.status(201).json({ imageUrl: result.secure_url });
    }

    res.status(201).json({ imageUrl: `/uploads/${req.file.filename}` });
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadImage };
