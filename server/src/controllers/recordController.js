const { Record } = require('../models/Record');
const { User } = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const recordController = {
  // Create new record
  async createRecord(req, res) {
    try {
      const { activitySuggested, moodRecorded, status, weather } = req.body;
      
      const record = await Record.create({
        user: req.user.id,
        activitySuggested,
        moodRecorded,
        status,
        weather,
        date: Date.now()
      });

      res.status(201).json(record);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Get user's records with filters
  async getUserRecords(req, res) {
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
      const { startDate, endDate, status } = req.query;
      const query = { user: decoded.id };
      
      if (startDate || endDate) {
        query.date = {};
        if (startDate) query.date.$gte = new Date(startDate);
        if (endDate) query.date.$lte = new Date(endDate);
      }
      
      if (status) query.status = status;

      const records = await Record.find(query).sort({ date: -1 });
      res.json(records);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },

  // Update record
  async updateRecord(req, res) {
    try {
      const record = await Record.findOneAndUpdate(
        { _id: req.params.id, user: req.user.id },
        req.body,
        { new: true }
      );
      
      if (!record) {
        return res.status(404).json({ message: 'Record not found' });
      }
      
      res.json(record);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Get mood analytics
  async getMoodAnalytics(req, res) {
    try {
      const analytics = await Record.aggregate([
        { $match: { user: req.user.id } },
        { $group: {
          _id: null,
          averageMoodScore: { $avg: '$moodScore' },
          totalActivities: { $sum: 1 },
          completedActivities: {
            $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] }
          },
          moodImprovedCount: {
            $sum: { $cond: ['$moodImproved', 1, 0] }
          }
        }}
      ]);
      
      res.json(analytics[0] || {});
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};


module.exports = recordController;