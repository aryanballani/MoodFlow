import React from 'react';
import { Calendar, Cloud, Sun, CloudRain, Wind, Award } from 'lucide-react';
import '../styles/activities.css';
import Sidebar from '../components/sidebar';

const ActivityPage = () => {
  const activities = [
    {
      id: 1,
      date: '2024-01-18T10:30:00',
      mood: '😊',
      weather: 'sunny',
      activity: 'Morning walk',
      description: 'Started the day with a refreshing 30min walk'
    },
    {
      id: 2,
      date: '2024-01-18T14:15:00',
      mood: '💪',
      weather: 'cloudy',
      activity: 'Gym session',
      description: 'Hit the gym for strength training'
    },
    {
      id: 3,
      date: '2024-01-18T20:00:00',
      mood: '😌',
      weather: 'rainy',
      activity: 'Evening meditation',
      description: 'Peaceful meditation session before bed'
    }
  ];

  const streak = 7;

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

  return (
    <div className="activity-page">
      <Sidebar />
      <div className="main-content">
        <div className="header">
          <h1>Activity Log</h1>
          <p>Track your daily activities and moods</p>
        </div>
        
        <div className="activity-timeline">
          {activities.map((activity) => (
            <div key={activity.id} className="activity-card">
              <div className="card-header">
                <div className="time">
                  <Calendar className="calendar-icon" />
                  <span>{formatTime(activity.date)}</span>
                </div>
                <div className="mood-weather">
                  <span>{activity.mood}</span>
                  {getWeatherIcon(activity.weather)}
                </div>
              </div>
              
              <div className="activity-details">
                <h3>{activity.activity}</h3>
                <p>{activity.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityPage;