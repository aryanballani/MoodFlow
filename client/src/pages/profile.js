import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, ArrowLeft } from 'lucide-react';
import '../styles/profile.css';

const Profile = () => {
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({
        name: 'Sarah Johnson',
        dob: '1990-04-15',
        location: 'San Francisco, CA'
    });
    const [imagePreview, setImagePreview] = useState(null);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({
        ...prev,
        [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsEditing(false);
        // Here you would typically send the data to your backend
        console.log('Profile updated:', profile);
    };

    return (
        <div className="profile-container">
            <button 
                className="back-button" 
                onClick={() => navigate('/dashboard')}
            >
                <ArrowLeft size={20} />
                Back to Dashboard
            </button>

            <div className="profile-header">
                <h1>Profile Settings</h1>
                <button 
                className="edit-button"
                onClick={() => setIsEditing(!isEditing)}
                >
                {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
            </div>

        <form onSubmit={handleSubmit} className="profile-form">
            <div className="image-upload-container">
                <div className="profile-image">
                    {imagePreview ? (
                    <img src={imagePreview} alt="Profile" />
                    ) : (
                    <div className="image-placeholder">
                        <Camera size={40} />
                    </div>
                    )}
                </div>
                {isEditing && (
                    <div className="upload-button-container">
                    <label className="upload-button">
                        Upload Photo
                        <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                        />
                    </label>
                    </div>
                )}
            </div>

            <div className="form-group">
                <label>Full Name</label>
                <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                />
            </div>

            <div className="form-group">
                <label>Date of Birth</label>
                <input
                    type="date"
                    name="dob"
                    value={profile.dob}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                />
            </div>

            <div className="form-group">
                <label>Location</label>
                <input
                    type="text"
                    name="location"
                    value={profile.location}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                />
            </div>

            {isEditing && (
                <button type="submit" className="save-button">
                    Save Changes
                </button>
            )}
        </form>
    </div>
  );
};

export default Profile;