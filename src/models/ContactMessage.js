const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    subject: {
      type: String,
      default: 'No Subject',
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
    },
    read: { type: Boolean, default: false },
    starred: { type: Boolean, default: false },
    replied: { type: Boolean, default: false },
    repliedAt: { type: Date },
    ip: { type: String, default: '' },
  },
  { timestamps: true }
);

contactMessageSchema.index({ read: 1, createdAt: -1 });
contactMessageSchema.index({ starred: 1 });

module.exports = mongoose.model('ContactMessage', contactMessageSchema);
