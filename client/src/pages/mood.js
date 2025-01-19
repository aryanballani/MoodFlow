import React, { useState, useEffect } from 'react';
import Sidebar from '../components/sidebar';
import '../styles/mood.css';

const Mood = () => {
  const [moodCards, setMoodCards] = useState(() => {
    return JSON.parse(localStorage.getItem('moodHistory')) || [];
  });

  const [selectedMood, setSelectedMood] = useState(null);

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
                  <span className="mood-history-text">{entry.mood}</span>
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