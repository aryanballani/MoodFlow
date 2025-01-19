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
    type: String,
    default: 'https://res.cloudinary.com/dkqohzjdz/image/upload/v1620382889/default-profile-image_q8zj1y.png'
  },
  createdOn: {
    type: Date,
    default: Date.now,
    immutable: true  // Prevents modification after creation
  },
  interests: [String], 
  location: [Number],  // [longitude, latitude]
});

const User = mongoose.model('User', userSchema);

module.exports = { User };