import React, { useState, useEffect} from 'react';
import Sidebar from '../components/sidebar';
import '../styles/mood.css';
import { recordService } from '../services/api';


const Mood = () => {
  const [moodCards, setMoodCards] = useState(() => {
    return JSON.parse(localStorage.getItem('moodHistory')) || [];
  });

  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isActivityLocked, setIsActivityLocked] = useState(() => {
    return JSON.parse(localStorage.getItem('lockedActivity')) || false;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    // Check for locked activity on component mount
    const lockedActivity = localStorage.getItem('lockedActivity');
    const lockedMood = localStorage.getItem('currentMood');
    if (lockedActivity) {
      setSelectedActivity(JSON.parse(lockedActivity));
      setSelectedMood(lockedMood);
      setIsActivityLocked(true);
    }
  }, []);

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
    },
    'Anxious': {
      message: "Feeling anxious? Let's focus on grounding and soothing activities.",
      activities: [
        { title: "Breathing Exercises", description: "Try deep breathing to calm your nervous system" },
        { title: "Grounding Walk", description: "Take a walk and focus on the sights and sounds around you" },
        { title: "Soothing Music", description: "Listen to relaxing or instrumental music to ease your mind" }
      ]
    },
    'Sad': {
      message: "It's okay to feel sad. Let's focus on activities that bring comfort and healing.",
      activities: [
        { title: "Watch a Comforting Movie", description: "Choose a feel-good movie or show to lift your spirits" },
        { title: "Reach Out to a Friend", description: "Talk to someone you trust about how you're feeling" },
        { title: "Art Therapy", description: "Express your emotions through drawing, painting, or writing" }
      ]
    },
    'Focused': {
      message: "You're in the zone! Let's make the most of this focused energy.",
      activities: [
        { title: "Deep Work Session", description: "Tackle a challenging task with your full concentration" },
        { title: "Organize Your Space", description: "Declutter your workspace for maximum productivity" },
        { title: "Plan Your Week", description: "Outline your tasks and goals for the upcoming week" }
      ]
    },
    'Overwhelmed': {
      message: "Feeling overwhelmed? Let's break things into manageable steps.",
      activities: [
        { title: "Make a Priority List", description: "Write down tasks in order of importance" },
        { title: "Take a Break", description: "Step away for a few minutes to recharge" },
        { title: "Ask for Help", description: "Reach out to a friend or colleague for support" }
      ]
    },
    'Excited': {
      message: "You're feeling excited! Let's channel that enthusiasm.",
      activities: [
        { title: "Plan a Celebration", description: "Organize a small event to celebrate what's exciting you" },
        { title: "Share Your Excitement", description: "Tell someone about what's making you so happy" },
        { title: "Document the Moment", description: "Write about your excitement in a journal or take pictures" }
      ]
    },
    'Frustrated': {
      message: "Frustration happens. Let's find ways to release that tension.",
      activities: [
        { title: "Physical Activity", description: "Go for a run or do a workout to release pent-up energy" },
        { title: "Write it Out", description: "Journal about what's bothering you to clear your mind" },
        { title: "Take a Step Back", description: "Pause and return to the task later with a fresh perspective" }
      ]
    },
    'Hopeful': {
      message: "Feeling hopeful? Let's nurture that positive outlook.",
      activities: [
        { title: "Set a Goal", description: "Write down a goal and steps to achieve it" },
        { title: "Vision Board", description: "Create a vision board to visualize your dreams" },
        { title: "Volunteer", description: "Channel your hope into helping others in need" }
      ]
    },
    'Reflective': {
      message: "You're in a reflective mood. Let's make time for introspection.",
      activities: [
        { title: "Gratitude List", description: "Write down things you're grateful for today" },
        { title: "Reconnect with Nature", description: "Spend some time outdoors, appreciating the world around you" },
        { title: "Read a Thoughtful Book", description: "Choose a book that encourages introspection" }
      ]
    }
  };

  const moods = [
    { emoji: '😊', label: 'Happy', className: 'mood-card-happy' },
    { emoji: '😌', label: 'Calm', className: 'mood-card-calm' },
    { emoji: '⚡', label: 'Energetic', className: 'mood-card-energetic' },
    { emoji: '😴', label: 'Tired', className: 'mood-card-tired' },
    { emoji: '😟', label: 'Anxious', className: 'mood-card-anxious' },
    { emoji: '😢', label: 'Sad', className: 'mood-card-sad' },
    { emoji: '🎯', label: 'Focused', className: 'mood-card-focused' },
    { emoji: '😵', label: 'Overwhelmed', className: 'mood-card-overwhelmed' },
    { emoji: '🎉', label: 'Excited', className: 'mood-card-excited' },
    { emoji: '😠', label: 'Frustrated', className: 'mood-card-frustrated' },
    { emoji: '🌟', label: 'Hopeful', className: 'mood-card-hopeful' },
    { emoji: '🤔', label: 'Reflective', className: 'mood-card-reflective' }
  ];
  

  const fetchActivities = async (mood) => {
    setIsLoading(true);
    try {
      // Get user data from localStorage
      const age = localStorage.getItem('age') || '';
      const interests = localStorage.getItem('interests') || '';
      const latitude = localStorage.getItem('latitude') || '52.52'; 
      const longitude = localStorage.getItem('longitude') || '13.41';
      const response = recordService.getActivitySuggestions(latitude, longitude, age, interests);
      const data = await response;
      if (data.suggestions) {
        // Transform the suggestions into the format your app expects
        const formattedActivities = data.suggestions.map(suggestion => ({
          title: suggestion.title || suggestion,
          description: suggestion.description || suggestion,
        }));
        setActivities(formattedActivities);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
      // Fallback to default activities if request fails
      setActivities(moodData[mood].activities);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMoodSelect = async (mood) => {
    setSelectedMood(mood.label);
    await fetchActivities(mood.label);
  };

  // Loading screen component
  const LoadingScreen = () => (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="loading-spinner"></div>
        <p>Waiting for LLM response...</p>
      </div>
    </div>
  );

  const handleActivitySelect = (activity) => {
    setSelectedActivity(activity);
  };

  const handleLockActivity = () => {
    const latitude = localStorage.getItem('latitude') || '52.52'; 
    const longitude = localStorage.getItem('longitude') || '13.41';

    localStorage.setItem('lockedActivity', JSON.stringify(selectedActivity));
    console.log(selectedActivity);
    console.log(latitude, longitude);
    const response = recordService.getNearbyPlaces(latitude, longitude, "Park");
    response.then(data => {
      console.log(data);
    });
    setIsActivityLocked(true);
  };

  const handleMarkComplete = () => {
    const newMoodEntry = {
      mood: selectedMood,
      emoji: moods.find(m => m.label === selectedMood)?.emoji,
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit'
      }),
      completedActivity: selectedActivity.title,
      status: 'completed'
    };
    
    const updatedMoodHistory = [...moodCards, newMoodEntry];
    setMoodCards(updatedMoodHistory);
    localStorage.setItem('moodHistory', JSON.stringify(updatedMoodHistory));
    
    localStorage.removeItem('lockedActivity');
    setIsActivityLocked(false);
    setSelectedActivity(null);
    setSelectedMood(null);
  };

  const handleAbandon = () => {
    const newMoodEntry = {
      mood: selectedMood,
      emoji: moods.find(m => m.label === selectedMood)?.emoji,
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit'
      }),
      completedActivity: selectedActivity.title,
      status: 'abandoned'
    };
    
    const updatedMoodHistory = [...moodCards, newMoodEntry];
    setMoodCards(updatedMoodHistory);
    localStorage.setItem('moodHistory', JSON.stringify(updatedMoodHistory));
    
    localStorage.removeItem('lockedActivity');
    setIsActivityLocked(false);
    setSelectedActivity(null);
    setSelectedMood(null);
  };

  const sortedMoodHistory = () => {
    return [...moodCards].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  const renderMoodHistory = () => (
    <div className="mood-history">
      <h3>Mood History</h3>
      <div className="mood-history-list">
        {sortedMoodHistory().map((entry, index) => (
          <div key={index} className="mood-history-item">
            <div className="mood-history-emoji">{entry.emoji}</div>
            <div className="mood-history-text">
              <div className="mood-label">{entry.mood}</div>
              <div className="mood-activity" style={{ color: '#6A80B9' }}>
                {entry.status === 'abandoned' ? 'Abandoned: ' : 'Completed: '}
                {entry.completedActivity}
              </div>
            </div>
            <div className="mood-history-datetime">
              <div className="mood-history-date">{entry.date}</div>
              <div className="mood-history-time">{entry.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (isActivityLocked && selectedActivity) {
    return (
      <div className="layout-container">
        <Sidebar />
        <div className="main-content">
          <div className="content-wrapper">
            <div className="mood-header">
              <h2 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                {moods.find(m => m.label === selectedMood)?.emoji}
                {selectedMood}
              </h2>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <div className="mood-card active" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h4 style={{ color: '#155E95', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.75rem', textAlign: 'center' }}>
                  Activity in Progress: {selectedActivity.title}
                </h4>
                <p style={{ color: '#6A80B9', textAlign: 'center', marginBottom: '1.5rem' }}>{selectedActivity.description}</p>
                
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedMood) {
    return (
      <div className="layout-container">
        <Sidebar />
        <div className="main-content">
          <div className="content-wrapper selected-mood-view">
            <button 
              onClick={() => setSelectedMood(null)}
              className="mood-card back-button"
            >
              ← Back
            </button>
            
            <div className="mood-header">
              <h2 className="current-mood">
                <span>{moods.find(m => m.label === selectedMood)?.emoji}</span>
                <span>{selectedMood}</span>
              </h2>
              <p className="mood-message">{moodData[selectedMood].message}</p>
            </div>
    
            {isLoading ? (
              <LoadingScreen />
            ) : (
              <div className="activities-section">
                <div className="activities-header">
                  <h3 className="activities-title">
                    Suggested Activities
                  </h3>
                  {!selectedActivity && (
                    <button 
                      className="mood-card regenerate-button"
                      onClick={() => fetchActivities(selectedMood)}
                    >
                      Regenerate Activities
                    </button>
                  )}
                </div>
                
                <div className="activities-container">
                  <div className="mood-grid">
                    {activities.map((activity, index) => (
                      <div 
                        key={index} 
                        className={`mood-card activity-card ${selectedActivity?.title === activity.title ? 'active' : ''}`}
                        onClick={() => handleActivitySelect(activity)}
                      >
                        <h4 className="activity-title">
                          {activity.title}
                        </h4>
                        <p className="activity-description">{activity.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
    
                {selectedActivity && (
                  <div className="lock-button-container">
                    <button 
                      className="mood-card lock-button"
                      onClick={handleLockActivity}
                    >
                      Lock Activity
                    </button>
                  </div>
                )}
              </div>
            )}
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

          {renderMoodHistory()}
        </div>
      </div>
    </div>
  );
};

export default Mood;