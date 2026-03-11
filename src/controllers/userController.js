const User = require('../models/User');
const crypto = require('crypto');
const { sendEmail, templates } = require('../utils/emailSender');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password -inviteToken').sort({ createdAt: -1 });
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Invite a new user (admin only)
// @route   POST /api/users/invite
// @access  Private/Admin
const inviteUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Please provide name and email' });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    // Create invite token
    const inviteToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(inviteToken).digest('hex');

    // Create user without password
    user = await User.create({
      name,
      email,
      role: role || 'admin',
      isActive: true,
      inviteToken: hashedToken,
      inviteTokenExpires: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    });

    // Send invite email
    const inviteUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/accept-invite/${inviteToken}`;
    
    await sendEmail({
      to: email,
      subject: 'You have been invited to AnandVerse Dashboard',
      html: templates.getInviteTemplate(inviteUrl),
      type: 'auth'
    });

    res.status(201).json({
      success: true,
      message: 'Invitation sent to user',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    // Prevent an admin from deleting themselves
    if (req.user.id === req.params.id) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own account' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Prevent deleting the superadmin unless it's another superadmin
    if (user.role === 'superadmin' && req.user.role !== 'superadmin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete a superadmin' });
    }

    await user.deleteOne();

    res.json({
      success: true,
      message: 'User deleted successfully' // no data returned
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getUsers,
  inviteUser,
  deleteUser
};
