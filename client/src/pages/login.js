import React, { useState } from 'react';
import { Camera } from 'lucide-react';
import { userService } from '../services/api'; // Import userService
import '../styles/login.css';

const AuthPages = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    repeatPassword: '',
    dateOfBirth: '',
  });

  const [loginData, setLoginData] = useState({
    usernameOrEmail: '',
    password: '',
  });

  const [errorMessage, setErrorMessage] = useState('');

  const interests = [
    "Yoga", "Meditation", "Running", "Reading", 
    "Gaming", "Music", "Art", "Photography",
    "Hiking", "Writing", "Gardening", "Drawing", 
    "Coding", "Astronomy", "DIY Projects", 
    "Film Making", "Swimming", "Martial Arts", "Baking",
    "Calligraphy", "Fashion", "Robotics", "Chess", 
    "Esports", "LLM"
  ];
  
  

  const handleInputChange = (e, isLoginForm = false) => {
    const { name, value } = e.target;
    if (isLoginForm) {
      setLoginData({ ...loginData, [name]: value });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

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

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await userService.login({
        usernameOrEmail: loginData.usernameOrEmail,
        password: loginData.password,
      });
      // Redirect to the home/dashboard page after successful login
      window.location.href = '/dashboard';
    } catch (error) {
      console.error(error);
      setErrorMessage('Login failed. Please check your credentials.');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.repeatPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    try {
      await userService.register({
        fullName: formData.fullName,
        username: formData.username, // Include the username field
        email: formData.email,
        password: formData.password,
        dateOfBirth: formData.dateOfBirth,
        interests: selectedInterests,
        profileImage: profileImage, // Sending the base64 string
      });
      // Redirect to the login page after successful signup
      setIsLogin(true);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Signup failed. Please try again.');
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

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        {isLogin ? (
          // Login Form
          <form className="auth-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Email or Username</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter your email or username"
                name="usernameOrEmail"
                value={loginData.usernameOrEmail}
                onChange={(e) => handleInputChange(e, true)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Enter your password"
                name="password"
                value={loginData.password}
                onChange={(e) => handleInputChange(e, true)}
              />
            </div>

            <button type="submit" className="submit-button">
              Login
            </button>
          </form>
        ) : (
          // Signup Form
          <form className="auth-form" onSubmit={handleSignup}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter your full name"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                type="text"
                className="form-input"
                placeholder="Create a username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                placeholder="Enter your email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Create a password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Repeat Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Repeat your password"
                name="repeatPassword"
                value={formData.repeatPassword}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Date of Birth</label>
              <input
                type="date"
                className="form-input"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Profile Photo</label>
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
                <p className="upload-text">Click to upload your profile photo</p>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Interests</label>
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
