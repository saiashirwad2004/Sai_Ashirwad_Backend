const Project = require('../models/Project');
const BlogPost = require('../models/BlogPost');
const Skill = require('../models/Skill');
const Service = require('../models/Service');
const Experience = require('../models/Experience');
const Testimonial = require('../models/Testimonial');
const User = require('../models/User');
const Newsletter = require('../models/Newsletter');
const { sendEmail, templates } = require('../utils/emailSender');
const SiteConfig = require('../models/SiteConfig');
const ContactMessage = require('../models/ContactMessage');
const { validateTurnstile } = require('../utils/turnstile');

// @desc    Get site config (public fields only)
// @route   GET /api/public/site
// @access  Public
const getSiteConfig = async (req, res) => {
  try {
    const config = await SiteConfig.getConfig();
    // Check maintenance mode
    if (config.maintenanceMode) {
      return res.json({
        success: true,
        data: {
          maintenanceMode: true,
          siteName: config.siteName,
          ownerName: config.ownerName,
        },
      });
    }
    res.json({ success: true, data: config });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get published projects
// @route   GET /api/public/projects
// @access  Public
const getProjects = async (req, res) => {
  try {
    const { featured, category, tag, limit = 50 } = req.query;
    const filter = { published: true };
    if (featured === 'true') filter.featured = true;
    if (category) filter.category = category;
    if (tag) filter.tags = tag;

    const projects = await Project.find(filter)
      .sort({ order: 1, date: -1 })
      .limit(parseInt(limit));

    res.json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single project by slug
// @route   GET /api/public/projects/:slug
// @access  Public
const getProjectBySlug = async (req, res) => {
  try {
    const project = await Project.findOne({
      slug: req.params.slug,
      published: true,
    });
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get published blog posts
// @route   GET /api/public/blog
// @access  Public
const getBlogPosts = async (req, res) => {
  try {
    const { tag, category, search, limit = 50, page = 1 } = req.query;
    const filter = { published: true };
    if (tag) filter.tags = tag;
    if (category) filter.category = category;

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await BlogPost.countDocuments(filter);
    const posts = await BlogPost.find(filter)
      .sort({ date: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .select('-content'); // Don't send full content in listing

    res.json({
      success: true,
      data: posts,
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

// @desc    Get single blog post by slug + increment views
// @route   GET /api/public/blog/:slug
// @access  Public
const getBlogPostBySlug = async (req, res) => {
  try {
    const post = await BlogPost.findOneAndUpdate(
      { slug: req.params.slug, published: true },
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    res.json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all skills (grouped by category)
// @route   GET /api/public/skills
// @access  Public
const getSkills = async (req, res) => {
  try {
    const skills = await Skill.find().sort({ category: 1, order: 1 });

    // Group by category
    const grouped = skills.reduce((acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill);
      return acc;
    }, {});

    res.json({ success: true, data: skills, grouped });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get active services
// @route   GET /api/public/services
// @access  Public
const getServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ order: 1 });
    res.json({ success: true, data: services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get experience entries
// @route   GET /api/public/experience
// @access  Public
const getExperience = async (req, res) => {
  try {
    const { type } = req.query;
    const filter = {};
    if (type) filter.type = type;

    const experience = await Experience.find(filter).sort({ order: 1 });

    // Group by type
    const grouped = experience.reduce((acc, exp) => {
      if (!acc[exp.type]) acc[exp.type] = [];
      acc[exp.type].push(exp);
      return acc;
    }, {});

    res.json({ success: true, data: experience, grouped });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get approved testimonials
// @route   GET /api/public/testimonials
// @access  Public
const getTestimonials = async (req, res) => {
  try {
    const { featured } = req.query;
    const filter = { approved: true };
    if (featured === 'true') filter.featured = true;

    const testimonials = await Testimonial.find(filter).sort({ featured: -1, createdAt: -1 });
    res.json({ success: true, data: testimonials });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit contact message
// @route   POST /api/public/contact
// @access  Public
const submitContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message, turnstileToken } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required',
      });
    }

    // Validate Turnstile
    const isValid = await validateTurnstile(turnstileToken, req.ip);
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Bot detection failed. Please try again.',
      });
    }

    const contactMessage = await ContactMessage.create({
      name,
      email,
      subject: subject || 'No Subject',
      message,
      ip: req.ip,
    });

    // Notify admins
    try {
      const admins = await User.find({ role: { $in: ['admin', 'superadmin'] } });
      const adminEmails = admins.map(a => a.email);
      
      if (adminEmails.length > 0) {
        await sendEmail({
          to: adminEmails.join(','),
          subject: `New Contact Message: ${subject || 'No Subject'}`,
          html: templates.getContactTemplate(name, email, message),
          type: 'info' // Sent from info@saiashirwad.online
        });
      }

      await sendEmail({
        to: email,
        subject: `Thank you for contacting Sai Ashirwad`,
        html: templates.getAutoReplyTemplate(name),
        type: 'info' // Sent from info@saiashirwad.online
      });
    } catch (e) {
      console.log('Could not send notification email:', e.message);
    }

    res.status(201).json({
      success: true,
      message: 'Message sent successfully! I will get back to you soon.',
      data: { id: contactMessage._id },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit a testimonial (public, needs approval)
// @route   POST /api/public/testimonials
// @access  Public
const submitTestimonial = async (req, res) => {
  try {
    const { name, role, company, content, rating, turnstileToken } = req.body;
    if (!name || !content) {
      return res.status(400).json({
        success: false,
        message: 'Name and testimonial content are required',
      });
    }
    // Validate Turnstile
    const isValid = await validateTurnstile(turnstileToken, req.ip);
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Bot detection failed. Please try again.',
      });
    }

    await Testimonial.create({
      name,
      role,
      company,
      content,
      rating: rating || 5,
      approved: false, // Require admin approval
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your testimonial has been submitted for review.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Subscribe to newsletter
// @route   POST /api/public/newsletter
// @access  Public
const subscribeNewsletter = async (req, res) => {
  try {
    const { email, turnstileToken } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }
    // Validate Turnstile
    const isValid = await validateTurnstile(turnstileToken, req.ip);
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Bot detection failed. Please try again.',
      });
    }

    let sub = await Newsletter.findOne({ email });
    if (sub) {
      return res.status(400).json({ success: false, message: 'You are already subscribed!' });
    }

    await Newsletter.create({ email });

    try {
      // Send welcome newsletter message
      await sendEmail({
        to: email,
        subject: 'Welcome to Sai Ashirwad Newsletter',
        html: templates.getNewsletterConfirmationTemplate(),
        type: 'newsletter' // Sent from newsletter@saiashirwad.online
      });
    } catch (e) {
      console.log('Newsletter confirmation email failed:', e.message);
    }

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to the newsletter!'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getSiteConfig,
  getProjects,
  getProjectBySlug,
  getBlogPosts,
  getBlogPostBySlug,
  getSkills,
  getServices,
  getExperience,
  getTestimonials,
  submitContactMessage,
  submitTestimonial,
  subscribeNewsletter,
};
