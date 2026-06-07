import React, { useState, useEffect } from 'react';
import { useRideContext } from '../hooks/useRideContext';
import { driverService } from '../services/driverService';
import { Driver } from '../services/driverService';

const DriverList: React.FC = () => {
  const { pickupLocation, availableDrivers, setAvailableDrivers, setSelectedDriver } = useRideContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (pickupLocation) {
      fetchNearbyDrivers();
      const interval = setInterval(fetchNearbyDrivers, 5000); // Refresh every 5 seconds
      return () => clearInterval(interval);
    }
  }, [pickupLocation]);

  const fetchNearbyDrivers = async () => {
    if (!pickupLocation) return;

    setLoading(true);
    setError(null);

    try {
      const response = await driverService.findNearbyDrivers(
        pickupLocation.lat,
        pickupLocation.lng
      );
      setAvailableDrivers(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch drivers');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDriver = (driver: Driver) => {
    setSelectedDriver(driver);
  };

  if (!pickupLocation) {
    return <div>Please set a pickup location first</div>;
  }

  return (
    <div className="driver-list">
      <h3>Available Drivers ({availableDrivers.length})</h3>
      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading">Loading drivers...</div>}
      
      <div className="drivers-grid">
        {availableDrivers.map((driver) => (
          <div key={driver.id} className="driver-card" onClick={() => handleSelectDriver(driver)}>
            <div className="driver-info">
              <h4>{driver.name}</h4>
              <p>Rating: ⭐ {driver.rating.toFixed(1)}</p>
              <p>Distance: {(driver.distanceKm || 0).toFixed(1)} km</p>
              <p>Status: {driver.status}</p>
              <p>Phone: {driver.phone}</p>
            </div>
            <button>Select Driver</button>
          </div>
        ))}
      </div>
      {availableDrivers.length === 0 && !loading && (
        <div className="no-drivers">No drivers available at the moment</div>
      )}
    </div>
  );
};

export default DriverList;
