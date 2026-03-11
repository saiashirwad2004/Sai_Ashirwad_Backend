const crypto = require('crypto');
const User = require('../models/User');
const Token = require('../models/Token');
const { sendTokenResponse } = require('../utils/generateToken');
const { sendPasswordResetEmail, sendWelcomeEmail } = require('../utils/sendEmail');

// @desc    Check if admin has been set up
// @route   GET /api/auth/check-setup
// @access  Public
const checkSetup = async (req, res) => {
  try {
    const adminCount = await User.countDocuments();
    res.json({
      success: true,
      isSetupComplete: adminCount > 0,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Initial admin setup (only works when no admin exists)
// @route   POST /api/auth/setup
// @access  Public
const setup = async (req, res) => {
  try {
    // Check if any admin already exists
    const existingAdmin = await User.countDocuments();
    if (existingAdmin > 0) {
      return res.status(400).json({
        success: false,
        message: 'Admin account already exists. Setup can only be run once.',
      });
    }

    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
    }

    // Create admin user
    const user = await User.create({
      name,
      email,
      password,
      role: 'superadmin',
    });

    // Send welcome email (non-blocking)
    sendWelcomeEmail(email, name).catch((err) => {
      console.log('⚠️  Welcome email failed:', err.message);
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login admin
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Find user and include password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account has been deactivated',
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update profile (name, email, avatar)
// @route   PUT /api/auth/update-profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const updates = {};
    const { name, email } = req.body;

    if (name) updates.name = name;
    if (email) updates.email = email;

    // Handle avatar upload
    if (req.file) {
      const cloudinary = require('../config/cloudinary');
      // If user has old avatar on cloudinary, delete it
      const currentUser = await User.findById(req.user.id);
      if (currentUser.avatar && currentUser.avatar.publicId) {
        try {
          await cloudinary.uploader.destroy(currentUser.avatar.publicId);
        } catch (e) {
          // Ignore cloudinary delete errors
        }
      }

      updates.avatar = {
        url: req.file.path || req.file.location || `/uploads/${req.file.filename}`,
        publicId: req.file.filename || '',
      };
    }

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current password and new password',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters',
      });
    }

    // Get user with password
    const user = await User.findById(req.user.id).select('+password');

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Forgot password — send reset email
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your email address',
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal that user doesn't exist (security best practice)
      return res.json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent',
      });
    }

    // Delete any existing tokens for this user
    await Token.deleteMany({ userId: user._id, type: 'password_reset' });

    // Generate reset token
    const { rawToken, hashedToken } = Token.generateToken();

    // Save hashed token to database
    await Token.create({
      userId: user._id,
      token: hashedToken,
      type: 'password_reset',
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    });

    // Send email with raw token
    await sendPasswordResetEmail(user.email, rawToken, user.name);

    res.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reset password with token
// @route   POST /api/auth/reset-password/:token
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const { token: rawToken } = req.params;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a new password',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
    }

    // Hash the received token and find it in database
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    const tokenDoc = await Token.findOne({
      token: hashedToken,
      type: 'password_reset',
      expiresAt: { $gt: Date.now() },
    });

    if (!tokenDoc) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token',
      });
    }

    // Find user and update password
    const user = await User.findById(tokenDoc.userId);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found',
      });
    }

    user.password = password;
    await user.save();

    // Delete the used token
    await Token.deleteMany({ userId: user._id, type: 'password_reset' });

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Accept invite and set password
// @route   POST /api/auth/accept-invite/:token
// @access  Public
const acceptInvite = async (req, res) => {
  try {
    const { password } = req.body;
    const { token: rawToken } = req.params;

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a password of at least 6 characters',
      });
    }

    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    const user = await User.findOne({
      inviteToken: hashedToken,
      inviteTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired invitation token',
      });
    }

    // Set new password and activate
    user.password = password;
    user.inviteToken = undefined;
    user.inviteTokenExpires = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  checkSetup,
  setup,
  login,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  acceptInvite,
};
