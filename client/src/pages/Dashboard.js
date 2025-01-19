import React, { useState, useEffect } from 'react';
import { BarChart, LineChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import Sidebar from '../components/sidebar';
import '../styles/dashboard.css';
import Card from '../components/card';
import { userService } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    streak: 0,
    weeklyActivities: 0,
    moodImprovement: 0
  });

  const [moodHistory, setMoodHistory] = useState([]);
  const [activities, setActivities] = useState([]);
  const [location, setLocation] = useState(null);  // Store the location data
  const [locationPermission, setLocationPermission] = useState(null); // Store location permission status

  useEffect(() => {
    // Load data from localStorage
    const savedMoodHistory = JSON.parse(localStorage.getItem('moodHistory')) || [];
    const savedActivities = JSON.parse(localStorage.getItem('activities')) || [];
    const savedStats = JSON.parse(localStorage.getItem('stats')) || {
      streak: 7,
      weeklyActivities: 15,
      moodImprovement: 85
    };

    setMoodHistory(savedMoodHistory);
    setActivities(savedActivities);
    setStats(savedStats);

    // Request location if not already granted
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Successfully retrieved location
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          setLocationPermission(true);  // Permission granted
          // Send location data to the backend
          userService.updateLocation({ latitude, longitude })
            .then(response => {
              console.log('Location updated:', response);
            })
            .catch(error => {
              console.error('Error updating location:', error);
            });
        },
        (error) => {
          // Handle errors, e.g., user denied permission
          console.error('Error getting location', error);
          setLocationPermission(false);  // Permission denied
        }
      );
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  }, []);

  // Prepare data for mood distribution chart
  const moodDistribution = moodHistory.reduce((acc, entry) => {
    acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    return acc;
  }, {});

  const moodChartData = Object.entries(moodDistribution).map(([mood, count]) => ({
    mood,
    count
  }));

  // Prepare data for weekly activity trend
  const activityTrend = [
    { day: 'Mon', activities: 4 },
    { day: 'Tue', activities: 6 },
    { day: 'Wed', activities: 3 },
    { day: 'Thu', activities: 5 },
    { day: 'Fri', activities: 7 },
    { day: 'Sat', activities: 4 },
    { day: 'Sun', activities: 6 }
  ];

  return (
    <div className="dashboard-container">
      <Sidebar />
      
      <div className="main-content">
        <div className="content-wrapper">
          {/* Header */}
          <div className="welcome-header">
            <h2>Dashboard Overview</h2>
            <p>Your wellness statistics and trends</p>
          </div>

          {/* Stats Cards */}
          <div className="stats-grid">
            <Card>
              <div className="stat-value">{stats.streak} days</div>
              <div className="stat-label">Current Streak</div>
            </Card>
            <Card>
              <div className="stat-value">{stats.weeklyActivities}</div>
              <div className="stat-label">Activities This Week</div>
            </Card>
            <Card>
              <div className="stat-value">{stats.moodImprovement}%</div>
              <div className="stat-label">Mood Improvement</div>
            </Card>
          </div>

          {/* Location Popup */}
          {locationPermission === null ? (
            <div className="location-popup">
              <h3>Location Permission Request</h3>
              <p>We need your location to provide better services based on your area. Do you want to allow location access?</p>
              <button onClick={() => window.location.reload()}>Allow Location</button>
              <button onClick={() => setLocationPermission(false)}>Deny</button>
            </div>
          ) : locationPermission === false ? (
            <div className="location-error">
              <p>Location permission denied. Some features may not work properly.</p>
            </div>
          ) : location && (
            <div className="location-info">
              <p>Location: {`Latitude: ${location.latitude}, Longitude: ${location.longitude}`}</p>
            </div>
          )}

          {/* Charts */}
          <div className="charts-grid">
            <Card className="chart-card">
              <h3>Mood Distribution</h3>
              <BarChart width={500} height={300} data={moodChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mood" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#155E95" />
              </BarChart>
            </Card>

            <Card className="chart-card">
              <h3>Weekly Activity Trend</h3>
              <LineChart width={500} height={300} data={activityTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="activities" stroke="#F6C794" strokeWidth={2} />
              </LineChart>
            </Card>
          </div>

          {/* Recent Activities */}
          <Card className="recent-activities">
            <h3>Recent Activities</h3>
            <div className="activities-list">
              {activities.slice(-5).map((activity, index) => (
                <div key={index} className="activity-item">
                  <span className="activity-name">{activity.name}</span>
                  <span className="activity-date">{new Date(activity.timestamp).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
