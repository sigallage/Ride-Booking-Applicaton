import React, { useEffect, useState } from 'react';
import { useRideContext } from '../hooks/useRideContext';
import { rideService, Ride } from '../services/rideService';

const RideConfirmation: React.FC = () => {
  const { activeRide, setActiveRide } = useRideContext();
  const [rideStatus, setRideStatus] = useState<Ride | null>(activeRide || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleStatusUpdate = async (newStatus: string) => {
    if (!rideStatus) return;

    setLoading(true);
    setError(null);

    try {
      const response = await rideService.updateRideStatus(rideStatus.id, newStatus);
      setRideStatus(response.data);
      if (newStatus === 'COMPLETED') {
        setActiveRide(null);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update ride status');
    } finally {
      setLoading(false);
    }
  };

  if (!rideStatus) {
    return <div>No active ride</div>;
  }

  return (
    <div className="ride-confirmation">
      <h3>Ride Confirmation</h3>
      {error && <div className="error-message">{error}</div>}

      <div className="ride-details">
        <div className="detail-item">
          <label>Ride Status:</label>
          <span className={`status-badge status-${rideStatus.status.toLowerCase()}`}>
            {rideStatus.status}
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
              <span>⭐ {rideStatus.driverRating?.toFixed(1)}</span>
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

export default RideConfirmation;
