const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const createCrudController = require('../controllers/crudFactory');
const { getDashboard } = require('../controllers/dashboardController');
const {
  getSettings,
  updateSettings,
  getMessage,
  toggleMessageRead,
  toggleMessageStar,
  replyToMessage,
  markAllRead,
} = require('../controllers/adminController');

// Models
const Project = require('../models/Project');
const BlogPost = require('../models/BlogPost');
const Skill = require('../models/Skill');
const Service = require('../models/Service');
const Experience = require('../models/Experience');
const Testimonial = require('../models/Testimonial');
const ContactMessage = require('../models/ContactMessage');

// All admin routes are protected
router.use(protect);

// ═══════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════
router.get('/dashboard', getDashboard);

// ═══════════════════════════════════════
// SITE SETTINGS
// ═══════════════════════════════════════
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

// ═══════════════════════════════════════
// PROJECTS
// ═══════════════════════════════════════
const projectCtrl = createCrudController(Project, {
  defaultSort: 'order -date',
  searchFields: ['title', 'description', 'tags'],
  imageFields: ['image'],
});

router.get('/projects', projectCtrl.getAll);
router.get('/projects/:id', projectCtrl.getById);
router.post('/projects', projectCtrl.create);
router.put('/projects/:id', projectCtrl.update);
router.delete('/projects/:id', projectCtrl.delete);
router.put('/projects/:id/toggle-published', projectCtrl.toggleField('published'));
router.put('/projects/:id/toggle-featured', projectCtrl.toggleField('featured'));
router.put('/projects/bulk/reorder', projectCtrl.reorder);
router.post('/projects/bulk/delete', projectCtrl.bulkDelete);

// ═══════════════════════════════════════
// BLOG POSTS
// ═══════════════════════════════════════
const blogCtrl = createCrudController(BlogPost, {
  defaultSort: '-date',
  searchFields: ['title', 'excerpt', 'content', 'tags'],
  imageFields: ['image'],
});

router.get('/blog', blogCtrl.getAll);
router.get('/blog/:id', blogCtrl.getById);
router.post('/blog', blogCtrl.create);
router.put('/blog/:id', blogCtrl.update);
router.delete('/blog/:id', blogCtrl.delete);
router.put('/blog/:id/toggle-published', blogCtrl.toggleField('published'));
router.put('/blog/:id/toggle-featured', blogCtrl.toggleField('featured'));
router.post('/blog/bulk/delete', blogCtrl.bulkDelete);

// ═══════════════════════════════════════
// SKILLS
// ═══════════════════════════════════════
const skillCtrl = createCrudController(Skill, {
  defaultSort: 'category order',
  searchFields: ['name'],
});

router.get('/skills', skillCtrl.getAll);
router.get('/skills/:id', skillCtrl.getById);
router.post('/skills', skillCtrl.create);
router.put('/skills/:id', skillCtrl.update);
router.delete('/skills/:id', skillCtrl.delete);
router.put('/skills/bulk/reorder', skillCtrl.reorder);
router.post('/skills/bulk/delete', skillCtrl.bulkDelete);

// ═══════════════════════════════════════
// SERVICES
// ═══════════════════════════════════════
const serviceCtrl = createCrudController(Service, {
  defaultSort: 'order',
  searchFields: ['title', 'description'],
});

router.get('/services', serviceCtrl.getAll);
router.get('/services/:id', serviceCtrl.getById);
router.post('/services', serviceCtrl.create);
router.put('/services/:id', serviceCtrl.update);
router.delete('/services/:id', serviceCtrl.delete);
router.put('/services/:id/toggle-active', serviceCtrl.toggleField('isActive'));
router.put('/services/bulk/reorder', serviceCtrl.reorder);
router.post('/services/bulk/delete', serviceCtrl.bulkDelete);

// ═══════════════════════════════════════
// EXPERIENCE
// ═══════════════════════════════════════
const experienceCtrl = createCrudController(Experience, {
  defaultSort: 'type order',
  searchFields: ['title', 'organization', 'description'],
});

router.get('/experience', experienceCtrl.getAll);
router.get('/experience/:id', experienceCtrl.getById);
router.post('/experience', experienceCtrl.create);
router.put('/experience/:id', experienceCtrl.update);
router.delete('/experience/:id', experienceCtrl.delete);
router.put('/experience/bulk/reorder', experienceCtrl.reorder);
router.post('/experience/bulk/delete', experienceCtrl.bulkDelete);

// ═══════════════════════════════════════
// TESTIMONIALS
// ═══════════════════════════════════════
const testimonialCtrl = createCrudController(Testimonial, {
  defaultSort: '-createdAt',
  searchFields: ['name', 'content', 'company'],
  imageFields: ['avatar'],
});

router.get('/testimonials', testimonialCtrl.getAll);
router.get('/testimonials/:id', testimonialCtrl.getById);
router.post('/testimonials', testimonialCtrl.create);
router.put('/testimonials/:id', testimonialCtrl.update);
router.delete('/testimonials/:id', testimonialCtrl.delete);
router.put('/testimonials/:id/toggle-approved', testimonialCtrl.toggleField('approved'));
router.put('/testimonials/:id/toggle-featured', testimonialCtrl.toggleField('featured'));
router.post('/testimonials/bulk/delete', testimonialCtrl.bulkDelete);

// ═══════════════════════════════════════
// CONTACT MESSAGES
// ═══════════════════════════════════════
const messageCtrl = createCrudController(ContactMessage, {
  defaultSort: '-createdAt',
  searchFields: ['name', 'email', 'subject', 'message'],
});

router.get('/messages', messageCtrl.getAll);
router.get('/messages/:id', getMessage); // Custom — auto-marks as read
router.delete('/messages/:id', messageCtrl.delete);
router.put('/messages/:id/read', toggleMessageRead);
router.put('/messages/:id/star', toggleMessageStar);
router.post('/messages/:id/reply', replyToMessage);
router.put('/messages/bulk/read-all', markAllRead);
router.post('/messages/bulk/delete', messageCtrl.bulkDelete);

module.exports = router;
