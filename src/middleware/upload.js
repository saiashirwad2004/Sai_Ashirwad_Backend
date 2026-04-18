const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure local uploads directory exists
const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
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
// LOCAL STORAGE
// =====================
const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = req.body.folder || 'general';
    const folderPath = path.join(uploadsDir, folder);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

// =====================
// CLOUDINARY HELPER
// =====================
const isCloudinaryConfigured = () => {
  return (
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name' &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_KEY !== 'your_api_key'
  );
};

// Upload to Cloudinary from a local file path
const uploadToCloudinary = async (filePath, folder = 'saiashirwad') => {
  const cloudinary = require('../config/cloudinary');
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: `saiashirwad/${folder}`,
      quality: 'auto',
      fetch_format: 'auto',
      resource_type: 'auto',
    });
    // Delete the local temp file after cloudinary upload
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    return result;
  } catch (error) {
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};

// Upload middleware for images (always local first, then optionally Cloudinary in controller)
const uploadImage = multer({
  storage: localStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
});

// Upload middleware for general files (always local)
const uploadFile = multer({
  storage: localStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB
  },
});

// Upload middleware for avatar
const uploadAvatar = multer({
  storage: localStorage,
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
