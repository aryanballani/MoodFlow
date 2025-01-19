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
    moodImprovement: 0,
  });
  const [moodHistory, setMoodHistory] = useState([]);
  const [activities, setActivities] = useState([]);
  const [location, setLocation] = useState(null); // Store the location data
  const [locationPermission, setLocationPermission] = useState(null); // Store location permission status
  const [recordDatam, setRecordData] = useState([]);

  useEffect(() => {
    const fetchRecordData = async () => {
      try {
        const data = await recordService.getUserRecords();
        console.log('Record data:', data);
        setRecordData(data);
        processStats(data);
      } catch (error) {
        console.error('Error fetching record data:', error);
      }
    };

    fetchRecordData();

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        userService
          .updateLocation({ latitude, longitude })
          .then((response) => {
            console.log('Location updated:', response);
            setLocation({ latitude, longitude });
          })
          .catch((error) => console.error('Error updating location:', error));
      },
      (error) => {
        console.error('Error getting location:', error);
        setLocationPermission(false);
      }
    );
  }, []);

  const processStats = (data) => {
    const moods = {};
    let weeklyActivities = 0;
    let streak = 0;
    let todayStreak = true;

    data.forEach((record) => {
      // Count mood occurrences
      moods[record.moodRecorded] = (moods[record.moodRecorded] || 0) + 1;

      // Count weekly activities
      const recordDate = new Date(record.date);
      const weekAgo = new Date(new Date() - 7 * 24 * 60 * 60 * 1000);
      if (recordDate >= weekAgo) {
        weeklyActivities++;
      }

      // Calculate streak
      const daysSince = Math.floor((new Date() - recordDate) / (24 * 60 * 60 * 1000));
      if (daysSince === streak) {
        streak++;
      } else {
        todayStreak = false;
      }
    });

    setStats({
      streak: todayStreak ? streak : streak - 1,
      weeklyActivities,
      moodImprovement: calculateMoodImprovement(moods),
    });

    setMoodHistory(
      Object.entries(moods).map(([mood, count]) => ({
        mood,
        count,
      }))
    );
  };

  const calculateMoodImprovement = (moods) => {
    const positiveMoods = moods['Happy'] || 0;
    const totalMoods = Object.values(moods).reduce((acc, count) => acc + count, 0);
    return totalMoods > 0 ? Math.round((positiveMoods / totalMoods) * 100) : 0;
  };

  // Prepare data for weekly activity trend
  const activityTrend = recordDatam.reduce((acc, record) => {
    const day = new Date(record.date).toLocaleString('en-US', { weekday: 'short' });
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {});

  const activityTrendData = Object.entries(activityTrend).map(([day, count]) => ({
    day,
    activities: count,
  }));

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="main-content">
        <div className="content-wrapper">
          <div className="welcome-header">
            <h2>Dashboard Overview</h2>
            <p>Your wellness statistics and trends</p>
          </div>

          {recordDatam.length === 0 ? (
            <Card className="no-records">
              <h3>No records found</h3>
              <p>Start logging your mood and activities to see your wellness statistics and trends.</p>
            </Card>
          ) : (
            <>
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

              <div className="charts-grid">
                <Card className="chart-card">
                  <h3>Mood Distribution</h3>
                  <BarChart width={500} height={300} data={moodHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mood" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#155E95" />
                  </BarChart>
                </Card>

                <Card className="chart-card">
                  <h3>Weekly Activity Trend</h3>
                  <LineChart width={500} height={300} data={activityTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="activities" stroke="#F6C794" strokeWidth={2} />
                  </LineChart>
                </Card>
              </div>

              <Card className="recent-activities">
                <h3>Recent Activities</h3>
                <div className="activities-list">
                  {recordDatam.slice(-5).map((record, index) => (
                    <div key={index} className="activity-item">
                      <span className="activity-name">{record.activitySuggested}</span>
                      <span className="activity-date">{new Date(record.date).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
