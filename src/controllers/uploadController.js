const File = require('../models/File');
const cloudinary = require('../config/cloudinary');
const { isCloudinaryConfigured, uploadToCloudinary } = require('../middleware/upload');
const fs = require('fs');
const path = require('path');

// @desc    Upload image (Cloudinary if configured, else local)
// @route   POST /api/upload/image
// @access  Private
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image file',
      });
    }

    const folder = req.body.folder || 'general';
    let fileData;

    // Try Cloudinary first, fall back to local
    if (isCloudinaryConfigured()) {
      try {
        const result = await uploadToCloudinary(req.file.path, folder);
        fileData = {
          filename: result.public_id.split('/').pop(),
          originalName: req.file.originalname,
          mimeType: req.file.mimetype,
          size: req.file.size,
          url: result.secure_url,
          publicId: result.public_id,
          storage: 'cloudinary',
          folder,
          uploadedBy: req.user._id,
        };
      } catch (cloudErr) {
        console.log('⚠️  Cloudinary upload failed, using local storage:', cloudErr.message);
        // Fall through to local storage below
      }
    }

    // Local storage fallback
    if (!fileData) {
      fileData = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        url: `${req.protocol}://${req.get('host')}/uploads/${folder}/${req.file.filename}`,
        publicId: '',
        storage: 'local',
        folder,
        uploadedBy: req.user._id,
      };
    }

    const file = await File.create(fileData);

    res.status(201).json({
      success: true,
      file,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Upload general file (always local)
// @route   POST /api/upload/file
// @access  Private
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file',
      });
    }

    const folder = req.body.folder || 'general';
    let fileData;

    if (isCloudinaryConfigured()) {
      try {
        const result = await uploadToCloudinary(req.file.path, folder);
        fileData = {
          filename: result.public_id.split('/').pop(),
          originalName: req.file.originalname,
          mimeType: req.file.mimetype,
          size: req.file.size,
          url: result.secure_url,
          publicId: result.public_id,
          storage: 'cloudinary',
          folder,
          uploadedBy: req.user._id,
        };
      } catch (cloudErr) {
        console.log('⚠️  Cloudinary file upload failed, using local storage:', cloudErr.message);
      }
    }

    if (!fileData) {
      fileData = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        url: `${req.protocol}://${req.get('host')}/uploads/${folder}/${req.file.filename}`,
        publicId: '',
        storage: 'local',
        folder,
        uploadedBy: req.user._id,
      };
    }

    const file = await File.create(fileData);

    res.status(201).json({
      success: true,
      file,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all files
// @route   GET /api/upload/files
// @access  Private
const getFiles = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      folder,
      storage,
      sort = '-createdAt',
    } = req.query;

    const filter = {};
    if (folder) filter.folder = folder;
    if (storage) filter.storage = storage;

    const files = await File.find(filter)
      .sort(sort)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .populate('uploadedBy', 'name email');

    const total = await File.countDocuments(filter);

    res.json({
      success: true,
      files,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a file
// @route   DELETE /api/upload/files/:id
// @access  Private
const deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found',
      });
    }

    // Delete from storage
    if (file.storage === 'cloudinary' && file.publicId) {
      try {
        await cloudinary.uploader.destroy(file.publicId);
      } catch (e) {
        console.log('⚠️  Cloudinary delete failed:', e.message);
      }
    } else if (file.storage === 'local') {
      const filePath = path.join(
        __dirname,
        '..',
        '..',
        'uploads',
        file.folder,
        file.filename
      );
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await File.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'File deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  uploadImage,
  uploadFile,
  getFiles,
  deleteFile,
};
