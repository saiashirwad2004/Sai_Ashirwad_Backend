const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      trim: true,
    },
    level: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 50,
    },
    category: {
      type: String,
      enum: ['frontend', 'backend', 'database', 'tools', 'other'],
      required: true,
    },
    icon: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

skillSchema.index({ category: 1, order: 1 });

module.exports = mongoose.model('Skill', skillSchema);
