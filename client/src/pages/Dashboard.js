import React, { useState, useEffect } from 'react';
import { BarChart, LineChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import Sidebar from '../components/sidebar';
import '../styles/dashboard.css';
import Card from '../components/card';
import { recordService, userService } from '../services/api';

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
  const [recordDatam, setRecordData] = useState({});



  useEffect(() => {
    // Load data from localStorage
    const savedMoodHistory = JSON.parse(localStorage.getItem('moodHistory')) || [];
    const savedActivities = JSON.parse(localStorage.getItem('activities')) || [];
    const savedStats = JSON.parse(localStorage.getItem('stats')) || [];

    const handleRecordData = async () => {
      const data = await recordService.getUserRecords()
      // Update mood history
      console.log('Record data:', data);
      setRecordData(data);
    }

    handleRecordData();
    

    setMoodHistory(savedMoodHistory);
    setActivities(savedActivities);
    setStats(savedStats);


    // Request location if not already granted
    console.log('Requesting location...');
    setLocationPermission(true);  // Permission granted
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Successfully retrieved location
        const { latitude, longitude } = position.coords;
        console.log('Location:', latitude, longitude);
        setLocation({ latitude, longitude });
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
        console.log('Error getting location', error);
        console.error('Error getting location', error);
        setLocationPermission(false);  // Permission denied
      },
    );
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

          {/* Please add more logs card */}
          {recordDatam.length === 0 && (
            <Card className="no-records">
              <h3>No records found</h3>
              <p>Start logging your mood and activities to see your wellness statistics and trends.</p>
              </Card>
              )}

          {/* Stats Cards */}
          {recordDatam.length !== 0 && (
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
          )}

          {/* Charts */}
          {recordDatam.length !== 0 && (
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
          )}

          {/* Recent Activities */}
          {recordDatam.length !== 0 && (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
