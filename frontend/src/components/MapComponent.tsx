import React from 'react';
import { useRideContext } from '../hooks/useRideContext';

const MapComponent: React.FC = () => {
  const { pickupLocation, dropoffLocation } = useRideContext();

  return (
    <div className="map-container">
      <div className="map-placeholder">
        <p>Google Maps Integration</p>
        {pickupLocation && (
          <div className="location-info">
            <p>Pickup: ({pickupLocation.lat.toFixed(4)}, {pickupLocation.lng.toFixed(4)})</p>
          </div>
        )}
        {dropoffLocation && (
          <div className="location-info">
            <p>Dropoff: ({dropoffLocation.lat.toFixed(4)}, {dropoffLocation.lng.toFixed(4)})</p>
          </div>
        )}
        {!pickupLocation && !dropoffLocation && (
          <p className="placeholder-text">Enter pickup and dropoff locations to see the map</p>
        )}
      </div>
    </div>
  );
};

export default MapComponent;
