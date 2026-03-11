const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      default: '', // Cloudinary public ID (empty if local)
    },
    storage: {
      type: String,
      enum: ['local', 'cloudinary'],
      default: 'local',
    },
    folder: {
      type: String,
      default: 'general',
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for human-readable file size
fileSchema.virtual('readableSize').get(function () {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (this.size === 0) return '0 Bytes';
  const i = parseInt(Math.floor(Math.log(this.size) / Math.log(1024)));
  return Math.round(this.size / Math.pow(1024, i), 2) + ' ' + sizes[i];
});

fileSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('File', fileSchema);
