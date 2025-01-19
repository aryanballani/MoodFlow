import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Banana, Activity, BarChart, User, Menu, X } from 'lucide-react';
import '../styles/sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(window.innerWidth > 768);
  const currentPath = location.pathname.split('/')[1] || 'dashboard';

  const sidebarItems = [
    { id: 'dashboard', icon: BarChart, label: 'Dashboard', path: '/dashboard' },
    { id: 'activities', icon: Activity, label: 'Activities', path: '/activities' },
    { id: 'mood', icon: Banana, label: 'Mood', path: '/mood' },
    { id: 'profile', icon: User, label: 'Profile', path: '/profile' },
  ];

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsOpen(window.innerWidth > 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
    if (window.innerWidth <= 768) {
      setIsOpen(false);
    }
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="sidebar-container">
      {/* Toggle Button */}
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      <div 
        className={`sidebar-overlay ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h1>Moody</h1>
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
    </div>
  );
};

export default Sidebar;