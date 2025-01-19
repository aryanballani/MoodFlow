const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  fullname: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  photo: {
    data: Buffer,  // For storing the image data
    contentType: String,  // For storing the MIME type
    url: String    // Optional: for storing cloud storage URLs
  },
  createdOn: {
    type: Date,
    default: Date.now,
    immutable: true  // Prevents modification after creation
  },
  interests: [String], 
});

const User = mongoose.model('User', userSchema);

module.exports = { User };