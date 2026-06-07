import React, { useState } from 'react';
import { useRideContext } from '../hooks/useRideContext';

interface LocationInput {
  address: string;
  lat: number;
  lng: number;
}

interface BookingFormProps {
  onNext: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ onNext }) => {
  const { currentUser, setPickupLocation, setDropoffLocation } = useRideContext();
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropoffAddress, setDropoffAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock geocoding - in production, use Google Maps Geocoding API
  const mockGeocode = (address: string): LocationInput => {
    const locations: { [key: string]: LocationInput } = {
      'times square': { address: 'Times Square, NYC', lat: 40.758896, lng: -73.985130 },
      'central park': { address: 'Central Park, NYC', lat: 40.785091, lng: -73.968285 },
      'brooklyn bridge': { address: 'Brooklyn Bridge, NYC', lat: 40.706086, lng: -73.996979 },
      'empire state': { address: 'Empire State Building, NYC', lat: 40.748817, lng: -73.985428 },
    };
    
    const key = address.toLowerCase();
    return locations[key] || { address, lat: 40.7128, lng: -74.0060 };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!currentUser) {
      setError('Please login first');
      return;
    }

    if (!pickupAddress || !dropoffAddress) {
      setError('Please enter both pickup and dropoff addresses');
      return;
    }

    try {
      setLoading(true);

      const pickupLocation = mockGeocode(pickupAddress);
      const dropoffLocation = mockGeocode(dropoffAddress);

      setPickupLocation({ lat: pickupLocation.lat, lng: pickupLocation.lng });
      setDropoffLocation({ lat: dropoffLocation.lat, lng: dropoffLocation.lng });

      // Move to next step (driver selection)
      setTimeout(() => {
        onNext();
      }, 500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to process booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-form">
      <h3>Step 1: Enter Your Pickup & Dropoff</h3>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Pickup Location</label>
          <input
            type="text"
            placeholder="e.g., Times Square, Central Park"
            value={pickupAddress}
            onChange={(e) => setPickupAddress(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Dropoff Location</label>
          <input
            type="text"
            placeholder="e.g., Empire State, Brooklyn Bridge"
            value={dropoffAddress}
            onChange={(e) => setDropoffAddress(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Processing...' : 'Find Available Drivers'}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
