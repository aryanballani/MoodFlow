import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/dashboard';
import Profile from './pages/profile';
import Mood from './pages/mood';
import AuthPages from './pages/login';
import Activities from './pages/activities';

const App = () => {
  const token = localStorage.getItem('token');
  return (
    <Router>
      <Routes>
      <Route
          path="/"
          element={token ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />}
        />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/mood" element={<Mood />} />
        <Route path="/login" element={<AuthPages />} />
        <Route path="/activities" element={<Activities />} />
      </Routes>
    </Router>
  );
};

export default App;