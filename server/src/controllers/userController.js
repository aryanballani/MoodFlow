// server/src/controllers/userController.js
const { User } = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userController = {
  // Register new user
  async register(req, res) {
    try {
      const { username, email, password, dateOfBirth } = req.body;
      console.log(process.env.JWT_SECRET)
      // Check if user exists
      const userExists = await User.findOne({ $or: [{ email }, { username }] });
      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create user
      const user = await User.create({
        username,
        email,
        password: hashedPassword,
        dateOfBirth
      });

      // Generate token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
      });

      res.status(201).json({
        id: user._id,
        username: user.username,
        email: user.email,
        token
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Login user
  async login(req, res) {
    try {
      const { usernameOrEmail, password } = req.body;
      console.log(usernameOrEmail);
      // Find user
      const user = await User.findOne({ email: usernameOrEmail }).select('+password');
      console.log(user);
      if (!user) {
        console.log('User not found')
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log('Password incorrect')
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
      });

      res.json({
        id: user._id,
        username: user.username,
        email: user.email,
        token
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },

  // Update user profile
//   async updateProfile(req, res) {
//     try {
//       console.log(req.user);
//       const { username, email, dateOfBirth } = req.body;
//       const user = await User.findByIdAndUpdate(
//         req.user.id,
//         { username, email, dateOfBirth },
//         { new: true }
//       ).select('-password');
      
//       res.json(user);
//     } catch (error) {
//       console.log(error);
//       res.status(400).json({ message: error.message });
//     }
//   }
// };

async updateProfile(req, res) {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded.id);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { username, email, dateOfBirth } = req.body;
    user.username = username || user.username;
    user.email = email || user.email;
    user.dateOfBirth = dateOfBirth || user.dateOfBirth;

    await user.save();
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
}
};

module.exports = userController;

