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
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [suggestedActivities, setSuggestedActivities] = useState([]);
  
  const handleActivitySelect = (activity) => {
    setSelectedActivity(activity); // This will select the clicked activity
  };

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
        { title: "Start a Creative Project", description: "Channel your positive energy into something creative - paint, write, or craft!", venue_type: "amusement_park" },
        { title: "Spread the Joy", description: "Call a friend or family member to share your good mood and catch up", venue_type: "cafe" },
        { title: "Outdoor Adventure", description: "Take advantage of your good mood with a nature walk or outdoor activity", venue_type: "park" }
      ]
    },
    'Calm': {
      message: "A peaceful state of mind is perfect for mindful activities.",
      activities: [
        { title: "Meditation Session", description: "Deepen your calm with a guided meditation or breathing exercise", venue_type: "spa" },
        { title: "Gentle Yoga", description: "Practice some relaxing yoga poses to maintain your tranquility", venue_type: "park" },
        { title: "Journal Writing", description: "Reflect on your thoughts and feelings through peaceful journaling", venue_type: "library" }
      ]
    },
    'Energetic': {
      message: "Great to see you're feeling energetic! Let's put that energy to good use!",
      activities: [
        { title: "High-Intensity Workout", description: "Channel your energy into an intense exercise session", venue_type: "gym" },
        { title: "Dance Party", description: "Put on your favorite upbeat music and dance it out", venue_type: "stadium" },
        { title: "Productive Task Sprint", description: "Use this energy burst to tackle your to-do list", venue_type: "dance_studio" }
      ]
    },
    'Tired': {
      message: "It's okay to feel tired. Let's focus on gentle, rejuvenating activities.",
      activities: [
        { title: "Power Nap", description: "Take a short 20-minute nap to recharge your energy", venue_type: "home" },
        { title: "Relaxing Bath", description: "Draw a warm bath with some calming essential oils", venue_type: "spa" },
        { title: "Light Reading", description: "Pick up a book and read in a cozy corner", venue_type: "book_store" }
      ]
    },
    'Anxious': {
      message: "Feeling anxious? Let's focus on grounding and soothing activities.",
      activities: [
        { title: "Breathing Exercises", description: "Try deep breathing to calm your nervous system", venue_type: "park" },
        { title: "Grounding Walk", description: "Take a walk and focus on the sights and sounds around you", venue_type: "beach" },
        { title: "Soothing Music", description: "Listen to relaxing or instrumental music to ease your mind", venue_type: "church" }
      ]
    },
    'Sad': {
      message: "It's okay to feel sad. Let's focus on activities that bring comfort and healing.",
      activities: [
        { title: "Watch a Comforting Movie", description: "Choose a feel-good movie or show to lift your spirits", venue_type: "movie_theater" },
        { title: "Reach Out to a Friend", description: "Talk to someone you trust about how you're feeling", venue_type: "cafe" },
        { title: "Art Therapy", description: "Express your emotions through drawing, painting, or writing", venue_type: "museum" }
      ]
    },
    'Focused': {
      message: "You're in the zone! Let's make the most of this focused energy.",
      activities: [
        { title: "Deep Work Session", description: "Tackle a challenging task with your full concentration", venue_type: "library" },
        { title: "Organize Your Space", description: "Declutter your workspace for maximum productivity", venue_type: "office" },
        { title: "Plan Your Week", description: "Outline your tasks and goals for the upcoming week", venue_type: "university" }
      ]
    },
    'Overwhelmed': {
      message: "Feeling overwhelmed? Let's break things into manageable steps.",
      activities: [
        { title: "Make a Priority List", description: "Write down tasks in order of importance", venue_type: "park" },
        { title: "Take a Break", description: "Step away for a few minutes to recharge", venue_type: "spa" },
        { title: "Ask for Help", description: "Reach out to a friend or colleague for support", venue_type: "home" }
      ]
    },
    'Excited': {
      message: "You're feeling excited! Let's channel that enthusiasm.",
      activities: [
        { title: "Plan a Celebration", description: "Organize a small event to celebrate what's exciting you", venue_type: "stadium" },
        { title: "Share Your Excitement", description: "Tell someone about what's making you so happy", venue_type: "amusement_park" },
        { title: "Document the Moment", description: "Write about your excitement in a journal or take pictures", venue_type: "restaurant" }
      ]
    },
    'Frustrated': {
      message: "Frustration happens. Let's find ways to release that tension.",
      activities: [
        { title: "Physical Activity", description: "Go for a run or do a workout to release pent-up energy", venue_type: "gym" },
        { title: "Write it Out", description: "Journal about what's bothering you to clear your mind", venue_type: "park" },
        { title: "Take a Step Back", description: "Pause and return to the task later with a fresh perspective", venue_type: "yoga_studio" }
      ]
    },
    'Hopeful': {
      message: "Feeling hopeful? Let's nurture that positive outlook.",
      activities: [
        { title: "Set a Goal", description: "Write down a goal and steps to achieve it", venue_type: "church" },
        { title: "Vision Board", description: "Create a vision board to visualize your dreams", venue_type: "park" },
        { title: "Volunteer", description: "Channel your hope into helping others in need", venue_type: "community_center" }    
      ]
    },
    'Reflective': {
      message: "You're in a reflective mood. Let's make time for introspection.",
      activities: [
        { title: "Gratitude List", description: "Write down things you're grateful for today", venue_type: "park" },
        { title: "Reconnect with Nature", description: "Spend some time outdoors, appreciating the world around you", venue_type: "library" },
        { title: "Read a Thoughtful Book", description: "Choose a book that encourages introspection", venue_type: "museum" }
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
      // setWeather("Sunny");
      // throw new Error('Not implemented');
      const age = localStorage.getItem('age') || '';
      const interests = localStorage.getItem('interests') || '';
      const latitude = localStorage.getItem('latitude') || '49.2827'; 
      const longitude = localStorage.getItem('longitude') || '-123.1207';
      const response = recordService.getActivitySuggestions(latitude, longitude, age, interests, mood);
      const data = await response;
      localStorage.setItem("weather", data.weather);

      if (data.suggestions) {
        // Transform the suggestions into the format your app expects
        const suggestedActivities = data.suggestions.map(suggestion => ({
          title: suggestion.title || suggestion,
          description: suggestion.description || suggestion,
          venue_type: suggestion.Generalized_venue || 'Location'
        }));
        setSuggestedActivities(suggestedActivities);
        const formattedActivities = data.suggestions.map(suggestion => ({
          title: suggestion.title || suggestion,
          description: suggestion.description || suggestion,
        }));
        // console.log(data.places);
        setActivities(formattedActivities);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
      // Fallback to default activities if request fails
      console.log(moodData[mood].activities);
      const suggestedActivities = moodData[mood].activities.map(activity => ({
        title: activity.title,
        description: activity.description,
        venue_type: activity.venue_type
      }));
      setSuggestedActivities(suggestedActivities);
      const formattedActivities = moodData[mood].activities.map(activity => ({
        title: activity.title || activity,
        description: activity.description || activity,
      }));
      // console.log(data.places);
      setActivities(formattedActivities);
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

  const handleLockActivity = async () => {
    const latitude = localStorage.getItem('latitude'); 
    const longitude = localStorage.getItem('longitude');
    localStorage.setItem('currentMood', selectedMood);

    localStorage.setItem('lockedActivity', JSON.stringify(selectedActivity));
    console.log('Locked activity:', selectedActivity.title);
    try {
      console.log(suggestedActivities);
      const generalized_venue_activity = suggestedActivities.find(activity => activity.title === selectedActivity.title).venue_type;
      generalized_venue_activity.toLowerCase();
      console.log('Generalized venue activity:', generalized_venue_activity);
      const response = await recordService.getNearbyPlaces(latitude, longitude, generalized_venue_activity);
      setNearbyPlaces(response.places);
    } catch (error) {
      console.error('Error fetching places:', error);
    }
    
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
    

    try {
      const recordData = {
        mood: localStorage.getItem('currentMood'),
        weather: localStorage.getItem('weather'),
        activity: selectedActivity.title,
        status: "Completed"
      }
      recordService.createRecord(recordData);
    } catch(error) {
      console.error('Error creating record:', error);
    }
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
    

    try {
      const recordData = {
        mood: localStorage.getItem('currentMood'),
        weather: localStorage.getItem('weather'),
        activity: selectedActivity.title,
        status: "Completed"
      }
      recordService.createRecord(recordData);
    } catch(error) {
      console.error("Error creating record:", error);
    }
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
              <h2 className="mood-title-wrapper">
                {moods.find(m => m.label === selectedMood)?.emoji}
                {selectedMood}
              </h2>
            </div>
  
            <div className="activity-progress-wrapper">
              <div className="mood-card active activity-progress-card">
                <h4 className="activity-progress-title">
                  Activity in Progress: {selectedActivity.title}
                </h4>
                <p className="activity-progress-description">{selectedActivity.description}</p>
                
                <div className="activity-button-container">
                  <button 
                    className="mood-card activity-button activity-button-complete"
                    onClick={handleMarkComplete}
                  >
                    Mark as Complete
                  </button>
                  <button 
                    className="mood-card activity-button activity-button-abandon"
                    onClick={handleAbandon}
                  >
                    Abandon
                  </button>
                </div>
              </div>
            </div>

            {nearbyPlaces.length > 0 && (
              <div className="nearby-places-section">
                <h3 className="nearby-places-title">Recommended Places to Visit</h3>
                <div className="nearby-places-grid">
                  {nearbyPlaces.map((place, index) => (
                    <div key={index} className="place-card mood-card">
                      <h4 className="place-name">{place.name}</h4>
                      <p className="place-address">{place.address}</p>
                      <a 
                        href={place.googleMapsLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="place-link"
                      >
                        View on Google Maps
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
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