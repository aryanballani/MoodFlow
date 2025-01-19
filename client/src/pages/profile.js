import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera } from 'lucide-react';
import '../styles/profile.css';
import Sidebar from '../components/sidebar';
import { userService } from '../services/api';

const Profile = () => {
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({
        fullname: '',
        dateOfBirth: '',
        location: ''
    });
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        const fetchProfile = () => {
            try {
                const profileData = userService.getProfile();
                console.log(profileData);
                profileData.then((data) => {
                    console.log(data);
                    setProfile({
                        fullname: data.fullname,
                        dateOfBirth: data.dateOfBirth,
                        location: data.location || '' // Assuming location might be missing
                    });
                });
                
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };
    
        fetchProfile();
    }, []);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsEditing(false);
        // Here you would typically send the data to your backend
        try {
            const updatedProfile = await userService.updateProfile(profile);
            setProfile(updatedProfile);
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    return (
        <div className="layout-container">
            <Sidebar />
            <div className="main-content">
                <div className="profile-container">
                    <button
                        className="back-btn"
                        onClick={() => navigate('/dashboard')}
                    >
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
                                        <Camera size={100} />
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
                                value={profile.fullname}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                            />
                        </div>

                        <div className="form-group">
                            <label>Date of Birth</label>
                            <input
                                type="date"
                                name="dob"
                                value={profile.dateOfBirth}
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
            </div>
        </div>
    );
};

export default Profile;