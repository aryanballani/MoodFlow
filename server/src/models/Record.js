const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true  // Add index for faster queries
    },
    date: {
      type: Date,
      required: true,
      default: Date.now
    },
    activitySuggested: {
      type: String,
      required: true
    },
    moodRecorded: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['InProgress', 'Completed', 'DidNotComplete'],
      required: true,
      default: 'InProgress'
    },
    moodImproved: {
      type: Boolean,  // Using Boolean instead of String for Yes/No
      required: false
    },
    weather: {
      type: String,
      required: true
    },
  });
  
  // Compound index for efficient querying of user records by date
  recordSchema.index({ user: 1, date: -1 });
  
  // Virtual for getting week's records
  recordSchema.virtual('weekRecords', {
    ref: 'Record',
    localField: 'user',
    foreignField: 'user',
    match: {
      date: {
        $gte: new Date(new Date() - 7 * 24 * 60 * 60 * 1000)
      }
    }
  });
  
  const Record = mongoose.model('Record', recordSchema);
  
  module.exports = { Record };