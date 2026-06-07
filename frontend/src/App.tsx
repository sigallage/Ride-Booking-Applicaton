import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RideProvider } from './context/RideContext';
import UserRegistration from './components/UserRegistration';
import DriverList from './components/DriverList';
import BookingForm from './components/BookingForm';
import RideConfirmation from './components/RideConfirmation';
import MapComponent from './components/MapComponent';
import './App.css';

const Dashboard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'register' | 'drivers' | 'booking' | 'confirmation'>('register');

  return (
    <div className="dashboard">
      <div className="container">
        <header className="header">
          <h1>🚖 Ride Booking Application</h1>
          <p>Book your ride in minutes</p>
        </header>

        <div className="layout">
          <div className="sidebar">
            <nav className="steps">
              <button
                className={`step ${currentStep === 'register' ? 'active' : ''}`}
                onClick={() => setCurrentStep('register')}
              >
                1. Register
              </button>
              <button
                className={`step ${currentStep === 'drivers' ? 'active' : ''}`}
                onClick={() => setCurrentStep('drivers')}
              >
                2. Select Driver
              </button>
              <button
                className={`step ${currentStep === 'booking' ? 'active' : ''}`}
                onClick={() => setCurrentStep('booking')}
              >
                3. Book Ride
              </button>
              <button
                className={`step ${currentStep === 'confirmation' ? 'active' : ''}`}
                onClick={() => setCurrentStep('confirmation')}
              >
                4. Confirmation
              </button>
            </nav>
          </div>

          <div className="main-content">
            {currentStep === 'register' && <UserRegistration />}
            {currentStep === 'drivers' && <DriverList />}
            {currentStep === 'booking' && <BookingForm />}
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
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </Router>
    </RideProvider>
  );
};

export default App;
