// server/controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper: generate unique referral codes
const generateReferralCode = () => {
  return Math.random().toString(36).substr(2, 6).toUpperCase();
};

/**
 * @desc Register new user
 * @route POST /api/auth/register
 */
exports.registerUser = async (req, res) => {
  try {
    const { phone, username, password, referredBy } = req.body;

    // Validate input
    if (!phone || !username || !password) {
      return res.status(400).json({ message: 'All fields (phone, username, password) are required.' });
    }

    // Check duplicates
    const existingUser = await User.findOne({ $or: [{ phone }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Phone or username already exists.' });
    }

    // Create user
    const newUser = new User({
      phone,
      username,
      password, // Will be hashed by pre-save hook in model
      referralCode: generateReferralCode(),
      referredBy: referredBy || null,
    });

    await newUser.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        phone: newUser.phone,
        username: newUser.username,
        referralCode: newUser.referralCode,
      },
    });
  } catch (error) {
    console.error('Register error:', error.message);
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

/**
 * @desc User login
 * @route POST /api/auth/login
 */
exports.loginUser = async (req, res) => {
  try {
    const { usernameOrPhone, password } = req.body;

    if (!usernameOrPhone || !password) {
      return res.status(400).json({ message: 'Please provide username/phone and password.' });
    }

    // Find user by username or phone
    const user = await User.findOne({
      $or: [{ username: usernameOrPhone }, { phone: usernameOrPhone }],
    });

    if (!user) {
      return res.status(400).json({ message: 'User not found with provided credentials.' });
    }

    // Compare password using model method
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password.' });
    }

    // Create JWT
    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        phone: user.phone,
        walletBalance: user.walletBalance,
        commissionEarned: user.commissionEarned,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Server error during login.' });
  }
};

/**
 * @desc Admin login
 * @route POST /api/auth/admin-login
 */
exports.adminLogin = async (req, res) => {
  try {
    const { usernameOrPhone, password } = req.body;

    if (!usernameOrPhone || !password) {
      return res.status(400).json({ message: 'Please provide admin username/phone and password.' });
    }

    const user = await User.findOne({
      $or: [{ username: usernameOrPhone }, { phone: usernameOrPhone }],
    });

    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Admin login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        phone: user.phone,
        referralCode: user.referralCode,
        walletBalance: user.walletBalance,
        commissionEarned: user.commissionEarned,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error('Admin login error:', error.message);
    res.status(500).json({ message: 'Server error during admin login.' });
  }
};
