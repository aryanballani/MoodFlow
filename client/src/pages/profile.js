import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera } from 'lucide-react';
import '../styles/profile.css';
import Sidebar from '../components/sidebar';
import { userService } from '../services/api';
import moment from 'moment';


const Profile = () => {
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({
        fullname: '',
        dateOfBirth: '',
        email: '',
        location: '',
        photo: '',
        latitude: null,
        longitude: null
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [age, setAge] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profileData = await userService.getProfile();
                // console.log(profileData);

                // Calculate age from date of birth
                const birthDate = moment(profileData.dateOfBirth, 'YYYY-MM-DD');
                const calculatedAge = moment().diff(birthDate, 'years');
                localStorage.setItem('age', calculatedAge);
                localStorage.setItem('interests', profileData.interests);
                setAge(calculatedAge);

                // Update profile data
                setProfile({
                    fullname: profileData.fullname,
                    dateOfBirth: profileData.dateOfBirth,
                    email: profileData.email,
                    location: profileData.location || '',
                    photo: profileData.photo || '', // Assuming photo URL is stored in the profile
                    latitude: profileData.latitude,
                    longitude: profileData.longitude
                });

                // Set profile image preview if any
                if (profileData.photo) {
                    setImagePreview(profileData.photo);
                }

                // Get location using latitude and longitude (You can use a geocoding API here)
                if (profileData.location) {
                    const locationData = await getLocationFromCoordinates(profileData.location[0], profileData.location[1]);
                    // console.log('Location:', locationData);
                    setProfile(prev => ({ ...prev, location: locationData }));
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        fetchProfile();
    }, []);

    const getLocationFromCoordinates = async (latitude, longitude) => {
        // Example API to get location from coordinates. You can replace this with your preferred geocoding API.
        try {
            const response = await fetch(`http://localhost:5001/location?latitude=${latitude}&longitude=${longitude}`);
            const data = await response.json();
            return data.location;
        } catch (error) {
            console.error('Error fetching location from coordinates:', error);
            return 'Location not available';
        }
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        console.log(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                profile.photo = reader.result;
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
        try {
            const updatedProfile = userService.updateProfile(profile);
            updatedProfile.then((data) => {
                setProfile(data);
            });
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    const handleLogout = async () => {
        try {
            console.log('Logging out with token', localStorage.getItem('token'));
            // Call logout service
            localStorage.removeItem('session-key');
            localStorage.removeItem('token');
            console.log('Logged out successfully with token', localStorage.getItem('token'));
            
            // Navigate to login page
            navigate('/login');
        } catch (error) {
            console.error('Error during logout:', error);
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
                                name="fullname"
                                value={profile.fullname}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                            />
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={profile.email}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                            />
                        </div>

                        <div className="form-group">
                            <label>Age</label>
                            <input
                                type="text"
                                name="age"
                                value={age || ''}
                                disabled
                            />
                        </div>

                        <div className="form-group">
                            <label>Location</label>
                            <input
                                type="text"
                                name="location"
                                value={profile.location}
                                onChange={handleInputChange}
                                disabled
                            />
                        </div>

                        {isEditing && (
                            <button type="submit" className="save-button">
                                Save Changes
                            </button>
                        )}
                    </form>

                    <button 
                        onClick={handleLogout}
                        className="logout-button"
                    >
                        Logout
                    </button>

                </div>
            </div>
        </div>
    );
};

export default Profile;
