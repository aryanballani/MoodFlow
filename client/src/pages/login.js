import React, { useState } from 'react';
import { Camera } from 'lucide-react';
import '../styles/login.css';

const AuthPages = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  
  const interests = [
    "Yoga", "Meditation", "Running", "Gym", 
    "Reading", "Cooking", "Gaming", "Travel",
    "Music", "Art", "Sports", "Photography"
  ];

  const [selectedInterests, setSelectedInterests] = useState([]);

  const handleInterestToggle = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">
            {isLogin ? 'Welcome Back!' : 'Create Account'}
          </h1>
          <p className="auth-subtitle">
            {isLogin ? 'Login to continue your journey' : 'Start your wellness journey today'}
          </p>
        </div>

        {isLogin ? (
          // Login Form
          <form className="auth-form">
            <div className="form-group">
              <label className="form-label">
                Email or Username
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter your email or username"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-input"
                placeholder="Enter your password"
              />
            </div>

            <button type="submit" className="submit-button">
              Login
            </button>
          </form>
        ) : (
          // Signup Form
          <form className="auth-form">
            <div className="form-group">
              <label className="form-label">
                Full Name
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-input"
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-input"
                placeholder="Create a password"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Repeat Password
              </label>
              <input
                type="password"
                className="form-input"
                placeholder="Repeat your password"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Date of Birth
              </label>
              <input
                type="date"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Profile Photo
              </label>
              <div className="profile-upload">
                <div className="profile-image-container">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="profile-image" />
                  ) : (
                    <Camera className="upload-icon" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="file-input"
                  />
                </div>
                <p className="upload-text">
                  Click to upload your profile photo
                </p>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Interests
              </label>
              <div className="interests-grid">
                {interests.map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => handleInterestToggle(interest)}
                    className={`interest-tag ${
                      selectedInterests.includes(interest) ? 'selected' : ''
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className="submit-button">
              Create Account
            </button>
          </form>
        )}

        <div className="toggle-auth">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="toggle-auth-button"
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPages;