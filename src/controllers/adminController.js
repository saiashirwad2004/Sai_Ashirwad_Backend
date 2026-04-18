const SiteConfig = require('../models/SiteConfig');
const ContactMessage = require('../models/ContactMessage');
const { sendEmail } = require('../utils/sendEmail');

// @desc    Get site settings
// @route   GET /api/admin/settings
// @access  Private
const getSettings = async (req, res) => {
  try {
    const config = await SiteConfig.getConfig();
    res.json({ success: true, data: config });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update site settings
// @route   PUT /api/admin/settings
// @access  Private
const updateSettings = async (req, res) => {
  try {
    let config = await SiteConfig.getConfig();
    Object.assign(config, req.body);
    await config.save();
    res.json({ success: true, data: config });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get a single message
// @route   GET /api/admin/messages/:id
// @access  Private
const getMessage = async (req, res) => {
  try {
    const message = await ContactMessage.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    // Auto-mark as read when viewed
    if (!message.read) {
      message.read = true;
      await message.save();
    }
    res.json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle message read status
// @route   PUT /api/admin/messages/:id/read
// @access  Private
const toggleMessageRead = async (req, res) => {
  try {
    const message = await ContactMessage.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    message.read = !message.read;
    await message.save();
    res.json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle message starred status
// @route   PUT /api/admin/messages/:id/star
// @access  Private
const toggleMessageStar = async (req, res) => {
  try {
    const message = await ContactMessage.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    message.starred = !message.starred;
    await message.save();
    res.json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reply to a message via email
// @route   POST /api/admin/messages/:id/reply
// @access  Private
const replyToMessage = async (req, res) => {
  try {
    const { subject, body } = req.body;
    const message = await ContactMessage.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    if (!body) {
      return res.status(400).json({ success: false, message: 'Reply body is required' });
    }

    // Send reply email
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #111827; border-radius: 12px; padding: 32px; border: 1px solid #1e293b;">
          <div style="font-size: 24px; font-weight: 700; color: #60a5fa; margin-bottom: 16px;">Sai Ashirwad</div>
          <p style="color: #f8fafc; font-size: 16px;">Hi ${message.name},</p>
          <div style="color: #94a3b8; font-size: 16px; line-height: 1.6; white-space: pre-line;">${body}</div>
          <hr style="border: none; border-top: 1px solid #1e293b; margin: 24px 0;" />
          <p style="color: #475569; font-size: 14px;">This is a reply to your message: "${message.subject}"</p>
        </div>
      </div>
    `;

    await sendEmail({
      to: message.email,
      subject: subject || `Re: ${message.subject}`,
      html,
    });

    message.replied = true;
    message.repliedAt = Date.now();
    await message.save();

    res.json({ success: true, message: 'Reply sent successfully', data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark all messages as read
// @route   PUT /api/admin/messages/read-all
// @access  Private
const markAllRead = async (req, res) => {
  try {
    await ContactMessage.updateMany({ read: false }, { read: true });
    res.json({ success: true, message: 'All messages marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getSettings,
  updateSettings,
  getMessage,
  toggleMessageRead,
  toggleMessageStar,
  replyToMessage,
  markAllRead,
};
