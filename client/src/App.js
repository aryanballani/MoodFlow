import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/dashboard';
import Profile from './pages/profile';
import Mood from './pages/mood';
import AuthPages from './pages/login';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/mood" element={<Mood />} />
        <Route path="/login" element={<AuthPages />} />
        {/* <Route path="/activities" element={<Activities />} /> */}
      </Routes>
    </Router>
  );
};

export default App;