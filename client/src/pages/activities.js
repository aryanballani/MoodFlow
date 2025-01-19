import React, { useState, useEffect } from 'react';
import { Calendar, Cloud, Sun, CloudRain, Wind } from 'lucide-react';
import '../styles/activities.css';
import Sidebar from '../components/sidebar';

const ActivityPage = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    // Get activities from localStorage
    const moodHistory = JSON.parse(localStorage.getItem('moodHistory')) || [];
    
    // Transform mood history into activity format
    const formattedActivities = moodHistory.map((entry, index) => ({
      id: index + 1,
      date: entry.timestamp,
      mood: entry.emoji,
      weather: entry.weather || 'sunny', // Add weather if you have it in mood history
      activity: entry.completedActivity,
      description: entry.description || `${entry.status === 'completed' ? 'Completed' : 'Abandoned'} activity when feeling ${entry.mood}`,
      status: entry.status
    }));

    // Sort activities by date (most recent first)
    const sortedActivities = formattedActivities.sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    );

    setActivities(sortedActivities);
  }, []);

  const getWeatherIcon = (weather) => {
    switch (weather) {
      case 'sunny': return <Sun className="weather-icon sunny" />;
      case 'cloudy': return <Cloud className="weather-icon cloudy" />;
      case 'rainy': return <CloudRain className="weather-icon rainy" />;
      default: return <Wind className="weather-icon" />;
    }
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="activity-page">
      <Sidebar />
      <div className="main-content">
        <div className="header">
          <h1>Activity Log</h1>
          <p>Track your daily activities and moods</p>
        </div>
        
        {activities.length === 0 ? (
          <div className="no-activities">
            <p>No activities recorded yet. Start by logging your mood and completing activities!</p>
          </div>
        ) : (
          <div className="activity-timeline">
            {activities.map((activity) => (
              <div 
                key={activity.id} 
                className={`activity-card ${activity.status === 'abandoned' ? 'abandoned' : ''}`}
              >
                <div className="card-header">
                  <div className="time">
                    <Calendar className="calendar-icon" />
                    <span>{formatDate(activity.date)} at {formatTime(activity.date)}</span>
                  </div>
                  <div className="mood-weather">
                    <span>{activity.mood}</span>
                    {getWeatherIcon(activity.weather)}
                  </div>
                </div>
                
                <div className="activity-details">
                  <h3>{activity.activity}</h3>
                  <p>{activity.description}</p>
                  <span className="activity-status">
                    Status: {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityPage;