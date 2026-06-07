import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { RideProvider } from './context/RideContext';
import Login from './components/Login';
import Register from './components/Register';
import UserRegistration from './components/UserRegistration';
import DriverList from './components/DriverList';
import BookingForm from './components/BookingForm';
import RideConfirmation from './components/RideConfirmation';
import MapComponent from './components/MapComponent';
import ProtectedRoute from './components/ProtectedRoute';
import authService from './services/authService';
import './App.css';

const Dashboard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'booking' | 'drivers' | 'confirmation'>('booking');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const user = authService.getUser();
    if (user) {
      setUserName(user.name);
    }
  }, []);

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/login';
  };

  return (
    <div className="dashboard">
      <div className="container">
        <header className="header">
          <div className="header-content">
            <div>
              <h1>🚖 Ride Booking Application</h1>
              <p>Book your ride in minutes</p>
            </div>
            <div className="header-user">
              <span className="user-greeting">Welcome, {userName}!</span>
              <button onClick={handleLogout} className="btn-logout">Logout</button>
            </div>
          </div>
        </header>

        <div className="layout">
          <div className="sidebar">
            <nav className="steps">
              <button
                className={`step ${currentStep === 'booking' ? 'active' : ''}`}
                onClick={() => setCurrentStep('booking')}
              >
                1. Book Ride
              </button>
              <button
                className={`step ${currentStep === 'drivers' ? 'active' : ''}`}
                onClick={() => setCurrentStep('drivers')}
              >
                2. Select Driver
              </button>
              <button
                className={`step ${currentStep === 'confirmation' ? 'active' : ''}`}
                onClick={() => setCurrentStep('confirmation')}
              >
                3. Confirmation
              </button>
            </nav>
          </div>

          <div className="main-content">
            {currentStep === 'booking' && <BookingForm onNext={() => setCurrentStep('drivers')} />}
            {currentStep === 'drivers' && <DriverList onNext={() => setCurrentStep('confirmation')} />}
            {currentStep === 'confirmation' && <RideConfirmation />}
          </div>

          <div className="map-section">
            <MapComponent />
          </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <RideProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </RideProvider>
  );
};

export default App;
