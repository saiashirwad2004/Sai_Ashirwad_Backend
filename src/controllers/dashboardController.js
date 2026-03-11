const User = require('../models/User');
const Project = require('../models/Project');
const BlogPost = require('../models/BlogPost');
const Skill = require('../models/Skill');
const Service = require('../models/Service');
const Experience = require('../models/Experience');
const Testimonial = require('../models/Testimonial');
const ContactMessage = require('../models/ContactMessage');
const File = require('../models/File');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private
const getDashboard = async (req, res) => {
  try {
    const [
      projectCount,
      publishedProjects,
      blogCount,
      publishedPosts,
      skillCount,
      serviceCount,
      experienceCount,
      testimonialCount,
      pendingTestimonials,
      messageCount,
      unreadMessages,
      starredMessages,
      fileCount,
      recentMessages,
      recentPosts,
    ] = await Promise.all([
      Project.countDocuments(),
      Project.countDocuments({ published: true }),
      BlogPost.countDocuments(),
      BlogPost.countDocuments({ published: true }),
      Skill.countDocuments(),
      Service.countDocuments({ isActive: true }),
      Experience.countDocuments(),
      Testimonial.countDocuments({ approved: true }),
      Testimonial.countDocuments({ approved: false }),
      ContactMessage.countDocuments(),
      ContactMessage.countDocuments({ read: false }),
      ContactMessage.countDocuments({ starred: true }),
      File.countDocuments(),
      ContactMessage.find().sort('-createdAt').limit(5).select('name email subject read createdAt'),
      BlogPost.find().sort('-createdAt').limit(5).select('title published views date'),
    ]);

    // Total views across all posts
    const viewsAgg = await BlogPost.aggregate([
      { $group: { _id: null, totalViews: { $sum: '$views' } } },
    ]);
    const totalViews = viewsAgg[0]?.totalViews || 0;

    res.json({
      success: true,
      data: {
        stats: {
          projects: { total: projectCount, published: publishedProjects },
          blog: { total: blogCount, published: publishedPosts, totalViews },
          skills: skillCount,
          services: serviceCount,
          experience: experienceCount,
          testimonials: { approved: testimonialCount, pending: pendingTestimonials },
          messages: { total: messageCount, unread: unreadMessages, starred: starredMessages },
          files: fileCount,
        },
        recentMessages,
        recentPosts,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDashboard };
