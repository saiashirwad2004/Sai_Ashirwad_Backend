const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { uploadImage: uploadImageMiddleware, uploadFile: uploadFileMiddleware } = require('../middleware/upload');
const {
  uploadImage,
  uploadFile,
  getFiles,
  deleteFile,
} = require('../controllers/uploadController');

// All upload routes are protected
router.post('/image', protect, uploadImageMiddleware.single('image'), uploadImage);
router.post('/file', protect, uploadFileMiddleware.single('file'), uploadFile);
router.get('/files', protect, getFiles);
router.delete('/files/:id', protect, deleteFile);

module.exports = router;
