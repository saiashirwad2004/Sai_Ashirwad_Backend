const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const {
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
} = require('../controllers/publicController');

// Rate limiter for form submissions
const submitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: { success: false, message: 'Too many submissions, please try again later' },
});

// Site config
router.get('/site', getSiteConfig);

// Projects
router.get('/projects', getProjects);
router.get('/projects/:slug', getProjectBySlug);

// Blog
router.get('/blog', getBlogPosts);
router.get('/blog/:slug', getBlogPostBySlug);

// Skills
router.get('/skills', getSkills);

// Services
router.get('/services', getServices);

// Experience
router.get('/experience', getExperience);

// Testimonials
router.get('/testimonials', getTestimonials);
router.post('/testimonials', submitLimiter, submitTestimonial);

// Contact
router.post('/contact', submitLimiter, submitContactMessage);

// Newsletter
router.post('/newsletter', submitLimiter, subscribeNewsletter);

module.exports = router;
