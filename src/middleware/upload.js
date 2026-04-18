const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Readable } = require('stream');

// Ensure local uploads directory exists (only for local development)
const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
if (process.env.NODE_ENV !== 'production' && !fs.existsSync(uploadsDir)) {
  try {
    fs.mkdirSync(uploadsDir, { recursive: true });
  } catch (e) {
    console.log('⚠️ Could not create uploads directory locally');
  }
}

// File filter for images
const imageFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;
  const mimeType = file.mimetype.startsWith('image/');
  const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase().replace('.', ''));

  if (mimeType && extName) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp, svg)'), false);
  }
};

// File filter for general files
const fileFilter = (req, file, cb) => {
  const blockedTypes = /exe|bat|cmd|sh|ps1|msi/;
  const ext = path.extname(file.originalname).toLowerCase().replace('.', '');

  if (blockedTypes.test(ext)) {
    cb(new Error('This file type is not allowed'), false);
  } else {
    cb(null, true);
  }
};

// =====================
// STORAGE STRATEGY
// =====================
// On Vercel, we must use memoryStorage because the filesystem is read-only.
const storage = multer.memoryStorage();

// =====================
// CLOUDINARY HELPER
// =====================
const isCloudinaryConfigured = () => {
  return (
    process.env.CLOUDINARY_URL ||
    (process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name' &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_KEY !== 'your_api_key')
  );
};

// Upload to Cloudinary from a buffer
const uploadToCloudinary = (fileBuffer, folder = 'saiashirwad') => {
  const cloudinary = require('../config/cloudinary');
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `saiashirwad/${folder}`,
        quality: 'auto',
        fetch_format: 'auto',
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) return reject(new Error(`Cloudinary upload failed: ${error.message}`));
        resolve(result);
      }
    );

    // Convert buffer to readable stream and pipe to Cloudinary
    const stream = new Readable();
    stream.push(fileBuffer);
    stream.push(null);
    stream.pipe(uploadStream);
  });
};

// Upload middleware for images
const uploadImage = multer({
  storage: storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
});

// Upload middleware for general files
const uploadFile = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB
  },
});

// Upload middleware for avatar
const uploadAvatar = multer({
  storage: storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});

module.exports = {
  uploadImage,
  uploadFile,
  uploadAvatar,
  uploadToCloudinary,
  isCloudinaryConfigured,
};
