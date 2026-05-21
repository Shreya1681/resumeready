const crypto = require('crypto');
const User = require('../models/User');

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

/**
 * Controller handling user registration
 */
async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields (name, email, password) are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: 'A user with this email already exists.' });
    }

    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password: hashPassword(password)
    });

    await newUser.save();

    return res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: error.message || 'Server error during registration.' });
  }
}

/**
 * Controller handling user sign-in credential matching
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const hashedInput = hashPassword(password);
    if (hashedInput !== user.password) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    return res.json({
      message: 'Authenticated successfully!',
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: error.message || 'Server error during login.' });
  }
}

/**
 * Controller handling Google OAuth success and user creation/lookup
 */
async function googleLogin(req, res) {
  try {
    const { email, name } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }

    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Since it's OAuth, we don't need a real password. Generate a secure random string.
      const randomPassword = crypto.randomBytes(16).toString('hex');
      user = new User({
        name: name || 'Google User',
        email: email.toLowerCase(),
        password: hashPassword(randomPassword)
      });
      await user.save();
      console.log(`Created new Google OAuth user in MongoDB: ${email}`);
    } else {
      console.log(`Google OAuth user authenticated: ${email}`);
    }

    return res.json({
      message: 'Authenticated successfully with Google!',
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Google login error:', error);
    return res.status(500).json({ error: error.message || 'Server error during Google login.' });
  }
}

module.exports = {
  hashPassword,
  register,
  login,
  googleLogin
};
