import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Activity, BarChart, Settings, User } from 'lucide-react';
import '../styles/Dashboard.css';

const Card = ({ children, className = '' }) => (
  <div className={`card ${className}`}>{children}</div>
);

const DashboardLayout = () => {
// CONSTANTS AND STATE
  const username = "Aryan";

  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  const handleNavigation = (id) => {
    setActiveTab(id);
    if (id === 'profile') {
      navigate('/profile');
    }
  };

  const [selectedMood, setSelectedMood] = useState(null);
  const [completedActivities, setCompletedActivities] = useState([]);
  const [streak, setStreak] = useState(0);
  const [moodPercentage, setMoodPercentage] = useState(0);

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

  const activitySuggestions = {
    Happy: ['Morning Yoga', 'Dance Party', 'Read a Book'],
    Calm: ['Meditation', 'Nature Walk', 'Breathing Exercises'],
    Energetic: ['HIIT Workout', 'Cycling', 'Jogging'],
    Tired: ['Power Nap', 'Gentle Yoga', 'Stretching'],
  };


// Handle mood selection
   const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
  };

// Handle activity completion
  const handleActivityComplete = (activity) => {
    const currentDate = new Date(); // Get the current date when activity is completed
    const newActivity = { name: activity, date: currentDate }; // Create activity object with date

    // Update completed activities with the new activity
    setCompletedActivities([...completedActivities, newActivity]);
    updateStreak(currentDate); // Pass the current date to streak function
    updateMoodPercentage(); // Update mood percentage
  };

  // Update the streak (simplified logic, could be extended)
  const updateStreak = (currentDate) => {
    if (completedActivities.length === 0) {
      setStreak(1); // If it's the first activity, set streak to 1
      return;
    }

    const lastCompleted = completedActivities[completedActivities.length - 1];
    const lastCompletionDate = new Date(lastCompleted.date);

    // Check if the activity was completed yesterday
    const diff = Math.floor((currentDate - lastCompletionDate) / (1000 * 60 * 60 * 24)); // days difference
    if (diff === 1) {
      setStreak(streak + 1); // Increase streak if activity was completed yesterday
    } else {
      setStreak(1); // Reset streak if more than 1 day has passed
    }
  };

  // Calculate mood improvement percentage (simplified logic)
  const updateMoodPercentage = () => {
    // Example: Assume that each completed activity improves mood by 10%
    const moodIncrease = completedActivities.length * 10;
    setMoodPercentage(Math.min(moodIncrease, 100)); // Cap at 100%
  };


  // MAIN DISPLAY
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
              onClick={() => handleNavigation(id)}
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
            <h2>Welcome back, {username}!</h2>
            <p>How are you feeling today?</p>
          </div>

          {/* Mood Selection */}
          <div className="mood-grid">
            {moodCards.map(({ emoji, label, className }) => (
              <button
                key={label}
                className={`mood-card ${className}`}
                onClick={() => handleMoodSelect(label)}
              >
                <div className="mood-emoji">{emoji}</div>
                <div className="mood-label">{label}</div>
              </button>
            ))}
          </div>

           {/* Display selected mood */}
           {selectedMood && (
            <div className="selected-mood">
              <h3>Your mood: {selectedMood}</h3>
            </div>
          )}

          {/* Activity Suggestions */}
            {selectedMood && (
            <Card className="activity-suggestions">
              <div className="section-header">
                <h2>Suggested Activities for {selectedMood}</h2>
              </div>
              <div className="activities-grid">
                {activitySuggestions[selectedMood].map((activity) => (
                  <div key={activity} className="activity-card">
                    <h3>{activity}</h3>
                    <button onClick={() => handleActivityComplete(activity)}>
                      Complete
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          )}
      

          {/* Activity Stats */}
          <div className="stats-grid">
            <Card>
              <div className="stat-value">{streak} days</div>
              <div className="stat-label">Current Streak</div>
            </Card>
            <Card>
              <div className="stat-value">{completedActivities.length}</div>
              <div className="stat-label">Activities This Week</div>
            </Card>
            <Card>
              <div className="stat-value">{moodPercentage}%</div>
              <div className="stat-label">Mood Improvement</div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;