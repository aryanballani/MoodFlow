import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Banana, Activity, BarChart, User } from 'lucide-react';
import '../styles/sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname.split('/')[1] || 'dashboard';

  const sidebarItems = [
    { id: 'dashboard', icon: BarChart, label: 'Dashboard', path: '/dashboard' },
    { id: 'activities', icon: Activity, label: 'Activities', path: '/activities' },
    { id: 'mood', icon: Banana, label: 'Mood', path: '/mood' },
    { id: 'profile', icon: User, label: 'Profile', path: '/profile' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1>MoodTracker</h1>
      </div>
      <nav className="sidebar-nav">
        {sidebarItems.map(({ id, icon: Icon, label, path }) => (
          <button
            key={id}
            onClick={() => handleNavigation(path)}
            className={`nav-item ${currentPath === id ? 'active' : ''}`}
          >
            <Icon className="nav-icon" />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;