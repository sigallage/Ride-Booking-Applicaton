import React, { useState, useEffect } from 'react';
import { useRideContext } from '../hooks/useRideContext';
import { driverService } from '../services/driverService';
import { Driver } from '../services/driverService';

interface DriverListProps {
  onNext: () => void;
}

const DriverList: React.FC<DriverListProps> = ({ onNext }) => {
  const { pickupLocation, availableDrivers, setAvailableDrivers, selectedDriver, setSelectedDriver } = useRideContext();
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

  const handleProceed = () => {
    if (selectedDriver) {
      onNext();
    }
  };

  if (!pickupLocation) {
    return (
      <div className="driver-list">
        <div className="error-message">Please set a pickup location first</div>
      </div>
    );
  }

  return (
    <div className="driver-list">
      <h3>Step 2: Select a Driver ({availableDrivers.length})</h3>
      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading">Loading drivers...</div>}
      
      <div className="drivers-grid">
        {availableDrivers.map((driver) => (
          <div 
            key={driver.id} 
            className={`driver-card ${selectedDriver?.id === driver.id ? 'selected' : ''}`}
            onClick={() => handleSelectDriver(driver)}
          >
            <div className="driver-info">
              <h4>{driver.name}</h4>
              <div className="driver-vehicle">
                {driver.vehicleType && (
                  <p>{formatVehicleType(driver.vehicleType)}</p>
                )}
              </div>
              <p>Rating: {driver.rating.toFixed(1)} ⭐</p>
              {driver.totalTrips !== undefined && (
                <p>Trips: {driver.totalTrips}</p>
              )}
              <p>Distance: {(driver.distanceKm || 0).toFixed(1)} km</p>
              <p>Status: {driver.status}</p>
              <p>Phone: {driver.phone}</p>
            </div>
            <button 
              type="button"
              className={selectedDriver?.id === driver.id ? 'btn-success' : ''}
            >
              {selectedDriver?.id === driver.id ? '✓ Selected' : 'Select'}
            </button>
          </div>
        ))}
      </div>
      {availableDrivers.length === 0 && !loading && (
        <div className="no-drivers">No drivers available at the moment</div>
      )}

      {selectedDriver && (
        <div className="driver-selected-footer">
          <p><strong>Selected Driver:</strong> {selectedDriver.name}</p>
          <button onClick={handleProceed} className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            Proceed to Confirmation
          </button>
        </div>
      )}
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

export default DriverList;
