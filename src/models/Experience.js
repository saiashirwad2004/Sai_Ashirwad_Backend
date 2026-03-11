const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    organization: {
      type: String,
      required: [true, 'Organization is required'],
      trim: true,
    },
    period: {
      type: String,
      required: [true, 'Period is required'],
    },
    description: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      enum: ['work', 'education', 'certification', 'volunteer', 'mentorship'],
      required: true,
    },
    location: { type: String, default: '' },
    current: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

experienceSchema.index({ type: 1, order: 1 });

module.exports = mongoose.model('Experience', experienceSchema);
