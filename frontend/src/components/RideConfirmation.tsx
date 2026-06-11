import React, { useEffect, useState } from 'react';
import { useRideContext } from '../hooks/useRideContext';
import { rideService, Ride } from '../services/rideService';
import ratingService from '../services/ratingService';
import RatingTrip from './RatingTrip';
import { calculateFareByVehicle } from '../utils/fareCalculator';

const RideConfirmation: React.FC = () => {
  const { 
    currentUser,
    activeRide, 
    setActiveRide,
    selectedDriver,
    pickupLocation,
    dropoffLocation
  } = useRideContext();
  
  const [rideStatus, setRideStatus] = useState<Ride | null>(activeRide || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rideConfirmed, setRideConfirmed] = useState(!!activeRide);
  const [showRating, setShowRating] = useState(false);

  useEffect(() => {
    if (activeRide) {
      const interval = setInterval(() => {
        fetchRideStatus();
      }, 3000); // Poll every 3 seconds
      return () => clearInterval(interval);
    }
  }, [activeRide]);

  const fetchRideStatus = async () => {
    if (!activeRide) return;

    try {
      const response = await rideService.getRide(activeRide.id);
      setRideStatus(response.data);
    } catch (err: any) {
      setError('Failed to fetch ride status');
    }
  };

  const handleConfirmBooking = async () => {
    if (!currentUser || !selectedDriver || !pickupLocation || !dropoffLocation) {
      setError('Please complete all steps first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const rideRequest = {
        userId: currentUser.id,
        pickupLatitude: pickupLocation.lat,
        pickupLongitude: pickupLocation.lng,
        dropoffLatitude: dropoffLocation.lat,
        dropoffLongitude: dropoffLocation.lng,
        driverId: selectedDriver.id,
      };

      const response = await rideService.createRide(rideRequest);
      setRideStatus(response.data);
      setActiveRide(response.data);
      setRideConfirmed(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create ride');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!rideStatus) return;

    setLoading(true);
    setError(null);

    try {
      const response = await rideService.updateRideStatus(rideStatus.id, newStatus);
      setRideStatus(response.data);
      if (newStatus === 'COMPLETED') {
        setShowRating(true);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update ride status');
    } finally {
      setLoading(false);
    }
  };

  const handleRatingSubmit = async (rating: number, feedback: string) => {
    if (!rideStatus) return;

    try {
      const response = await ratingService.submitRideRating(rideStatus.id, rating, feedback);
      setRideStatus(response.data);
      setActiveRide(null);
      // Stay in the ride confirmation with the success message
    } catch (err: any) {
      console.error('Rating submission error:', err);
      console.error('Error details:', err.response?.data || err.message);
      throw new Error(err.response?.data?.message || err.message || 'Failed to submit rating');
    }
  };

  const handleRatingSkip = () => {
    setShowRating(false);
    setActiveRide(null);
  };

  // Show booking preview if not confirmed yet
  if (!rideConfirmed || !rideStatus) {
    return (
      <div className="ride-confirmation">
        <h3>Step 3: Confirm Your Booking</h3>
        {error && <div className="error-message">{error}</div>}

        {selectedDriver && pickupLocation && dropoffLocation && (
          <div className="ride-details">
            <div className="detail-item">
              <label>Driver:</label>
              <span><strong>{selectedDriver.name}</strong></span>
            </div>

            <div className="detail-item">
              <label>Driver Phone:</label>
              <span>{selectedDriver.phone}</span>
            </div>

            <div className="detail-item">
              <label>Driver Rating:</label>
              <span>{selectedDriver.rating?.toFixed(1)} ⭐</span>
            </div>

            {selectedDriver.vehicleType && (
              <div className="detail-item">
                <label>Vehicle Type:</label>
                <span>{formatVehicleType(selectedDriver.vehicleType)}</span>
              </div>
            )}

            {selectedDriver.totalTrips !== undefined && (
              <div className="detail-item">
                <label>Driver Trips Completed:</label>
                <span>{selectedDriver.totalTrips}</span>
              </div>
            )}

            <div className="detail-item">
              <label>Pickup Location:</label>
              <span>{pickupLocation.address}</span>
            </div>

            <div className="detail-item">
              <label>Dropoff Location:</label>
              <span>{dropoffLocation.address}</span>
            </div>

            {rideStatus?.estimatedDistanceKm && selectedDriver.vehicleType && (
              <div className="detail-item">
                <label>Estimated Fare:</label>
                <span className="fare-amount">
                  LKR {calculateFareByVehicle(rideStatus.estimatedDistanceKm, selectedDriver.vehicleType)}
                </span>
              </div>
            )}

            <button 
              onClick={handleConfirmBooking} 
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', marginTop: '1.5rem', padding: '0.75rem' }}
            >
              {loading ? 'Creating Ride...' : 'Confirm & Book Ride'}
            </button>
          </div>
        )}

        {!selectedDriver && (
          <div className="error-message">Please select a driver first</div>
        )}
      </div>
    );
  }

  // Show ride status if confirmed
  if (showRating && rideStatus && rideStatus.status === 'COMPLETED') {
    return (
      <RatingTrip
        rideId={rideStatus.id}
        driverName={rideStatus.driverName || 'Driver'}
        distance={rideStatus.estimatedDistanceKm || 0}
        fare={Number(rideStatus.estimatedFare) || 0}
        onSubmit={handleRatingSubmit}
        onSkip={handleRatingSkip}
      />
    );
  }

  // Show ride status if confirmed
  return (
    <div className="ride-confirmation">
      <h3>Your Ride Details</h3>
      {error && <div className="error-message">{error}</div>}

      <div className="ride-details">
        <div className="detail-item">
          <label>Ride Status:</label>
          <span className={`status-badge status-${rideStatus.status.toLowerCase()}`}>
            {formatStatus(rideStatus.status)}
          </span>
        </div>

        {rideStatus.driverName && (
          <>
            <div className="detail-item">
              <label>Driver:</label>
              <span>{rideStatus.driverName}</span>
            </div>
            <div className="detail-item">
              <label>Driver Phone:</label>
              <span>{rideStatus.driverPhone}</span>
            </div>
            <div className="detail-item">
              <label>Driver Rating:</label>
              <span>{rideStatus.driverRating?.toFixed(1)} ⭐</span>
            </div>
          </>
        )}

        <div className="detail-item">
          <label>Distance:</label>
          <span>{(rideStatus.estimatedDistanceKm || 0).toFixed(1)} km</span>
        </div>

        <div className="detail-item">
          <label>Estimated Fare:</label>
          <span className="fare">${rideStatus.estimatedFare?.toFixed(2)}</span>
        </div>

        <div className="detail-item">
          <label>Booking Time:</label>
          <span>{new Date(rideStatus.createdAt || '').toLocaleString()}</span>
        </div>
      </div>

      <div className="ride-actions">
        {rideStatus.status === 'ASSIGNED' && (
          <button 
            onClick={() => handleStatusUpdate('IN_PROGRESS')} 
            disabled={loading}
            className="btn-primary"
          >
            Start Ride
          </button>
        )}
        {rideStatus.status === 'IN_PROGRESS' && (
          <button 
            onClick={() => handleStatusUpdate('COMPLETED')} 
            disabled={loading}
            className="btn-success"
          >
            Complete Ride
          </button>
        )}
        {rideStatus.status === 'REQUESTED' && (
          <button 
            onClick={() => handleStatusUpdate('CANCELLED')} 
            disabled={loading}
            className="btn-danger"
          >
            Cancel Ride
          </button>
        )}
      </div>
    </div>
  );
};

const formatVehicleType = (vehicleType: string): string => {
  switch (vehicleType) {
    case 'MOTORBIKE':
      return 'Motorbike';
    case 'SMALL_CAR':
      return 'Small Car';
    case 'LARGE_CAR':
      return 'Large Car';
    case 'TUK':
      return 'Tuk Tuk';
    default:
      return vehicleType;
  }
};

const formatStatus = (status: string): string => {
  switch (status) {
    case 'REQUESTED':
      return 'Requested';
    case 'ASSIGNED':
      return 'Assigned';
    case 'IN_PROGRESS':
      return 'In Progress';
    case 'COMPLETED':
      return 'Completed';
    case 'CANCELLED':
      return 'Cancelled';
    default:
      return status;
  }
};

export default RideConfirmation;
