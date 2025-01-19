import React, { useState} from 'react';
import Sidebar from '../components/sidebar';
import '../styles/mood.css';

const Mood = () => {
  const [moodCards, setMoodCards] = useState(() => {
    return JSON.parse(localStorage.getItem('moodHistory')) || [];
  });

  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const moodData = {
    'Happy': {
      message: "Wonderful to see you're feeling happy! Let's make the most of this positive energy!",
      activities: [
        { title: "Start a Creative Project", description: "Channel your positive energy into something creative - paint, write, or craft!" },
        { title: "Spread the Joy", description: "Call a friend or family member to share your good mood and catch up" },
        { title: "Outdoor Adventure", description: "Take advantage of your good mood with a nature walk or outdoor activity" }
      ]
    },
    'Calm': {
      message: "A peaceful state of mind is perfect for mindful activities.",
      activities: [
        { title: "Meditation Session", description: "Deepen your calm with a guided meditation or breathing exercise" },
        { title: "Gentle Yoga", description: "Practice some relaxing yoga poses to maintain your tranquility" },
        { title: "Journal Writing", description: "Reflect on your thoughts and feelings through peaceful journaling" }
      ]
    },
    'Energetic': {
      message: "Great to see you're feeling energetic! Let's put that energy to good use!",
      activities: [
        { title: "High-Intensity Workout", description: "Channel your energy into an intense exercise session" },
        { title: "Dance Party", description: "Put on your favorite upbeat music and dance it out" },
        { title: "Productive Task Sprint", description: "Use this energy burst to tackle your to-do list" }
      ]
    },
    'Tired': {
      message: "It's okay to feel tired. Let's focus on gentle, rejuvenating activities.",
      activities: [
        { title: "Power Nap", description: "Take a short 20-minute nap to recharge your energy" },
        { title: "Relaxing Bath", description: "Draw a warm bath with some calming essential oils" },
        { title: "Light Reading", description: "Pick up a book and read in a cozy corner" }
      ]
    }
  };

  const moods = [
    { emoji: '😊', label: 'Happy', className: 'mood-card-happy' },
    { emoji: '😌', label: 'Calm', className: 'mood-card-calm' },
    { emoji: '⚡', label: 'Energetic', className: 'mood-card-energetic' },
    { emoji: '😴', label: 'Tired', className: 'mood-card-tired' }
  ];

  const handleMoodSelect = (mood) => {
    const newMoodEntry = {
      mood: mood.label,
      emoji: mood.emoji,
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString()
    };

    const updatedMoodHistory = [...moodCards, newMoodEntry];
    setMoodCards(updatedMoodHistory);
    setSelectedMood(mood.label);
    localStorage.setItem('moodHistory', JSON.stringify(updatedMoodHistory));
    localStorage.setItem('currentMood', mood.label);
  };

  const handleActivitySelect = (activity) => {
    setSelectedActivity(activity);
  };

  const handleMarkComplete = () => {
    const newMoodEntry = {
      ...moodCards[moodCards.length - 1],
      completedActivity: selectedActivity.title
    };
    
    const updatedMoodHistory = [...moodCards.slice(0, -1), newMoodEntry];
    setMoodCards(updatedMoodHistory);
    localStorage.setItem('moodHistory', JSON.stringify(updatedMoodHistory));
    
    setSelectedActivity(null);
    setSelectedMood(null);
  };

  const handleAbandon = () => {
    setSelectedActivity(null);
    setSelectedMood(null);
  };

  if (selectedMood) {
    return (
      <div className="layout-container">
        <Sidebar />
        <div className="main-content">
          <div className="content-wrapper">
            <button 
              onClick={() => setSelectedMood(null)}
              className="mood-card"
              style={{ maxWidth: '150px', marginBottom: '2rem' }}
            >
              ← Back
            </button>
            
            <div className="mood-header">
              <h2 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                {moods.find(m => m.label === selectedMood)?.emoji}
                {selectedMood}
              </h2>
              <p style={{ textAlign: 'center' }}>{moodData[selectedMood].message}</p>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                <button 
                  className="mood-card"
                  style={{ maxWidth: '200px' }}
                  onClick={() => {/* Regenerate function would go here */}}
                >
                  Regenerate Activities
                </button>
              </div>

              <h3 style={{ color: '#155E95', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', textAlign: 'center' }}>
                Suggested Activities
              </h3>
              <div className="mood-grid">
                {moodData[selectedMood].activities.map((activity, index) => (
                  <div 
                    key={index} 
                    className={`mood-card ${selectedActivity?.title === activity.title ? 'active' : ''}`}
                    onClick={() => handleActivitySelect(activity)}
                    style={{ cursor: 'pointer' }}
                  >
                    <h4 style={{ color: '#155E95', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.75rem', textAlign: 'center' }}>
                      {activity.title}
                    </h4>
                    <p style={{ color: '#6A80B9', textAlign: 'center' }}>{activity.description}</p>
                  </div>
                ))}
              </div>

              {selectedActivity && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
                  <button 
                    className="mood-card"
                    style={{ maxWidth: '150px', backgroundColor: '#155E95', color: 'white' }}
                    onClick={handleMarkComplete}
                  >
                    Mark as Complete
                  </button>
                  <button 
                    className="mood-card"
                    style={{ maxWidth: '150px' }}
                    onClick={handleAbandon}
                  >
                    Abandon
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="layout-container">
      <Sidebar />
      <div className="main-content">
        <div className="content-wrapper">
          <div className="mood-header">
            <h2>How are you feeling today?</h2>
            <p>Select your current mood</p>
          </div>

          <div className="mood-grid">
            {moods.map((mood) => (
              <button
                key={mood.label}
                className={`mood-card ${mood.className} ${selectedMood === mood.label ? 'active' : ''}`}
                onClick={() => handleMoodSelect(mood)}
              >
                <div className="mood-emoji">{mood.emoji}</div>
                <div className="mood-label">{mood.label}</div>
              </button>
            ))}
          </div>

          <div className="mood-history">
            <h3>Recent Mood History</h3>
            <div className="mood-history-list">
              {moodCards.slice(-5).reverse().map((entry, index) => (
                <div key={index} className="mood-history-item">
                  <span className="mood-history-emoji">{entry.emoji}</span>
                  <span className="mood-history-text">
                    {entry.mood}
                    {entry.completedActivity && (
                      <span style={{ color: '#6A80B9', marginLeft: '0.5rem' }}>
                        • Completed: {entry.completedActivity}
                      </span>
                    )}
                  </span>
                  <span className="mood-history-date">{entry.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mood;