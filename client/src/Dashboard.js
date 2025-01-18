import React, { useState } from 'react';
import { Calendar, Activity, BarChart, Settings, User } from 'lucide-react';

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
    {children}
  </div>
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
    { emoji: '😊', label: 'Happy', color: 'bg-green-50' },
    { emoji: '😌', label: 'Calm', color: 'bg-blue-50' },
    { emoji: '⚡', label: 'Energetic', color: 'bg-yellow-50' },
    { emoji: '😴', label: 'Tired', color: 'bg-purple-50' }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-4">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-gray-800">MoodTracker</h1>
        </div>
        <nav className="space-y-2">
          {sidebarItems.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === id
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Welcome back, Sarah!</h2>
            <p className="text-gray-600">How are you feeling today?</p>
          </div>

          {/* Mood Selection */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {moodCards.map(({ emoji, label, color }) => (
              <button
                key={label}
                className={`${color} p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow`}
              >
                <div className="text-4xl mb-2">{emoji}</div>
                <div className="text-gray-700 font-medium">{label}</div>
              </button>
            ))}
          </div>

          {/* Activity Suggestions */}
          <Card className="mb-8">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-800">Suggested Activities</h2>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {['Morning Yoga', 'Nature Walk', 'Meditation'].map((activity) => (
                <div
                  key={activity}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 cursor-pointer transition-colors"
                >
                  <h3 className="font-medium text-gray-800">{activity}</h3>
                  <p className="text-sm text-gray-500">20 mins • Outdoor</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Activity Stats */}
          <div className="grid grid-cols-3 gap-6">
            <Card>
              <div className="text-2xl font-bold text-gray-800">7 days</div>
              <div className="text-sm text-gray-500">Current Streak</div>
            </Card>
            <Card>
              <div className="text-2xl font-bold text-gray-800">15</div>
              <div className="text-sm text-gray-500">Activities This Week</div>
            </Card>
            <Card>
              <div className="text-2xl font-bold text-gray-800">85%</div>
              <div className="text-sm text-gray-500">Mood Improvement</div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;