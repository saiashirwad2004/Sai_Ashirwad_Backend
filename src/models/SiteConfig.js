const mongoose = require('mongoose');

const siteConfigSchema = new mongoose.Schema(
  {
    // Branding
    siteName: { type: String, default: 'Sai Ashirwad' },
    siteTagline: { type: String, default: 'Full Stack Developer' },
    logo: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },

    // Owner info
    ownerName: { type: String, default: 'Sai Ashirwad' },
    ownerTitle: { type: String, default: 'Full Stack Developer' },
    ownerBio: {
      type: String,
      default: 'Passionate about creating innovative solutions with modern technologies.',
    },
    ownerImage: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },

    // Contact info
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },

    // Social links
    socialLinks: {
      github: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      twitter: { type: String, default: '' },
      instagram: { type: String, default: '' },
      youtube: { type: String, default: '' },
      website: { type: String, default: '' },
      dribbble: { type: String, default: '' },
    },

    // Hero section
    heroHeading: { type: String, default: "Hi, I'm Sai Ashirwad" },
    heroSubtitle: {
      type: String,
      default: 'I build beautiful, fast, and user-friendly web experiences',
    },
    heroDescription: {
      type: String,
      default: 'Passionate about creating innovative solutions with modern technologies.',
    },
    heroCTA: {
      primary: { text: { type: String, default: 'View My Work' }, link: { type: String, default: '/projects' } },
      secondary: { text: { type: String, default: 'Get In Touch' }, link: { type: String, default: '/contact' } },
    },

    // About section
    aboutDescription: { type: String, default: '' },
    aboutImage: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    resumeUrl: { type: String, default: '' },

    // Stats
    stats: [
      {
        number: { type: String },
        label: { type: String },
      },
    ],

    // SEO
    seoTitle: { type: String, default: '' },
    seoDescription: { type: String, default: '' },
    seoKeywords: [{ type: String }],
    ogImage: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },

    // Footer
    footerText: { type: String, default: '' },
    copyrightName: { type: String, default: 'Sai Ashirwad' },

    // Features
    maintenanceMode: { type: Boolean, default: false },
    analyticsId: { type: String, default: '' },

    // Custom
    customCSS: { type: String, default: '' },
    customHead: { type: String, default: '' },
  },
  { timestamps: true }
);

// Ensure only one config document exists
siteConfigSchema.statics.getConfig = async function () {
  let config = await this.findOne();
  if (!config) {
    config = await this.create({});
  }
  return config;
};

module.exports = mongoose.model('SiteConfig', siteConfigSchema);
