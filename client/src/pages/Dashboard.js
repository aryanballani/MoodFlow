import React, { useState } from 'react';
import { Calendar, Activity, BarChart, Settings, User } from 'lucide-react';
import '../styles/Dashboard.css';

const Card = ({ children, className = '' }) => (
  <div className={`card ${className}`}>{children}</div>
);

const DashboardLayout = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const sidebarItems = [
    { id: 'dashboard', icon: BarChart, label: 'Dashboard' },
    { id: 'activities', icon: Activity, label: 'Activities' },
    { id: 'calendar', icon: Calendar, label: 'Calendar' },
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ];

  const moodCards = [
    { emoji: '😊', label: 'Happy', className: 'mood-card-happy' },
    { emoji: '😌', label: 'Calm', className: 'mood-card-calm' },
    { emoji: '⚡', label: 'Energetic', className: 'mood-card-energetic' },
    { emoji: '😴', label: 'Tired', className: 'mood-card-tired' }
  ];

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h1>MoodTracker</h1>
        </div>
        <nav className="sidebar-nav">
          {sidebarItems.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`nav-item ${activeTab === id ? 'active' : ''}`}
            >
              <Icon className="nav-icon" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="content-wrapper">
          {/* Header */}
          <div className="welcome-header">
            <h2>Welcome back, Sarah!</h2>
            <p>How are you feeling today?</p>
          </div>

          {/* Mood Selection */}
          <div className="mood-grid">
            {moodCards.map(({ emoji, label, className }) => (
              <button key={label} className={`mood-card ${className}`}>
                <div className="mood-emoji">{emoji}</div>
                <div className="mood-label">{label}</div>
              </button>
            ))}
          </div>

          {/* Activity Suggestions */}
          <Card className="activity-suggestions">
            <div className="section-header">
              <h2>Suggested Activities</h2>
            </div>
            <div className="activities-grid">
              {['Morning Yoga', 'Nature Walk', 'Meditation'].map((activity) => (
                <div key={activity} className="activity-card">
                  <h3>{activity}</h3>
                  <p>20 mins • Outdoor</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Activity Stats */}
          <div className="stats-grid">
            <Card>
              <div className="stat-value">7 days</div>
              <div className="stat-label">Current Streak</div>
            </Card>
            <Card>
              <div className="stat-value">15</div>
              <div className="stat-label">Activities This Week</div>
            </Card>
            <Card>
              <div className="stat-value">85%</div>
              <div className="stat-label">Mood Improvement</div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;