const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Blog title is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    excerpt: {
      type: String,
      required: [true, 'Excerpt is required'],
      maxlength: 500,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    image: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    tags: [{ type: String, trim: true }],
    category: {
      type: String,
      default: 'general',
      trim: true,
    },
    author: {
      type: String,
      default: 'Sai Ashirwad',
    },
    readTime: {
      type: String,
      default: '',
    },
    published: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Auto-generate slug + readTime
blogPostSchema.pre('save', function (next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  // Estimate read time from content word count
  if (this.isModified('content') && this.content) {
    const words = this.content.split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    this.readTime = `${minutes} min read`;
  }
  next();
});

blogPostSchema.index({ published: 1, date: -1 });
blogPostSchema.index({ tags: 1 });

module.exports = mongoose.model('BlogPost', blogPostSchema);
