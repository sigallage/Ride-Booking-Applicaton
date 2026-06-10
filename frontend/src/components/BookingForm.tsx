import React, { useState, useRef, useEffect } from 'react';
import { LoadScript, GoogleMap, Marker, InfoWindow, Polyline } from '@react-google-maps/api';
import { useRideContext } from '../hooks/useRideContext';
import LocationPicker from './LocationPicker';

interface BookingFormProps {
  onNext: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ onNext }) => {
  const { currentUser, setPickupLocation, setDropoffLocation } = useRideContext();
  const [pickupLocation, setPickupLocationState] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);
  const [dropoffLocation, setDropoffLocationState] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 6.9271, lng: 80.7789 });
  const [openInfoWindow, setOpenInfoWindow] = useState<'pickup' | 'dropoff' | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  // Update map center and zoom when locations change
  useEffect(() => {
    if (!mapRef.current) return;

    if (pickupLocation && dropoffLocation) {
      const bounds = new google.maps.LatLngBounds();
      bounds.extend({ lat: pickupLocation.lat, lng: pickupLocation.lng });
      bounds.extend({ lat: dropoffLocation.lat, lng: dropoffLocation.lng });
      mapRef.current.fitBounds(bounds);
    } else if (pickupLocation) {
      setMapCenter({ lat: pickupLocation.lat, lng: pickupLocation.lng });
      mapRef.current.setCenter({ lat: pickupLocation.lat, lng: pickupLocation.lng });
      mapRef.current.setZoom(15);
    } else if (dropoffLocation) {
      setMapCenter({ lat: dropoffLocation.lat, lng: dropoffLocation.lng });
      mapRef.current.setCenter({ lat: dropoffLocation.lat, lng: dropoffLocation.lng });
      mapRef.current.setZoom(15);
    }
  }, [pickupLocation, dropoffLocation]);

  const handlePickupSelect = (location: { lat: number; lng: number; address: string }) => {
    setPickupLocationState(location);
    setError(null);
  };

  const handleDropoffSelect = (location: { lat: number; lng: number; address: string }) => {
    setDropoffLocationState(location);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!currentUser) {
      setError('Please login first');
      return;
    }

    if (!pickupLocation || !dropoffLocation) {
      setError('Please select both pickup and dropoff locations');
      return;
    }

    try {
      setLoading(true);

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

  const mapContainerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '8px',
    marginTop: '20px',
  };

  const routePath = pickupLocation && dropoffLocation ? [
    { lat: pickupLocation.lat, lng: pickupLocation.lng },
    { lat: dropoffLocation.lat, lng: dropoffLocation.lng },
  ] : [];

  return (
    <LoadScript 
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}
      libraries={['places']}
    >
      <div className="booking-form">
        <h3>Step 1: Select Your Pickup & Dropoff Locations</h3>
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <LocationPicker
            label="Pickup Location"
            onLocationSelect={handlePickupSelect}
            currentValue={pickupLocation?.address}
          />

          <div style={{ marginTop: '20px' }}>
            <LocationPicker
              label="Dropoff Location"
              onLocationSelect={handleDropoffSelect}
              currentValue={dropoffLocation?.address}
            />
          </div>

          {/* Unified Map showing both locations */}
          {(pickupLocation || dropoffLocation) && (
            <div style={{ marginTop: '20px' }}>
              <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px', fontWeight: '600' }}>
                📍 Map Preview
              </p>
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={mapCenter}
                zoom={14}
                onLoad={(map) => {
                  mapRef.current = map;
                  // Ensure Sri Lanka is visible
                  if (!pickupLocation && !dropoffLocation) {
                    map.setCenter({ lat: 6.9271, lng: 80.7789 });
                    map.setZoom(8);
                  }
                }}
                options={{
                  mapTypeControl: true,
                  fullscreenControl: false,
                  streetViewControl: false,
                }}
              >
                {/* Route Polyline */}
                {routePath.length === 2 && (
                  <Polyline
                    path={routePath}
                    options={{
                      strokeColor: '#1b5e20',
                      strokeOpacity: 0.8,
                      strokeWeight: 3,
                    }}
                  />
                )}

                {/* Pickup Location Marker */}
                {pickupLocation && (
                  <Marker
                    position={{ lat: pickupLocation.lat, lng: pickupLocation.lng }}
                    title="Pickup Location"
                    label={{
                      text: 'P',
                      color: '#ffffff',
                      fontSize: '14px',
                      fontWeight: 'bold',
                    }}
                    onClick={() => setOpenInfoWindow('pickup')}
                    icon={{
                      path: google.maps.SymbolPath.CIRCLE,
                      scale: 12,
                      fillColor: '#1b5e20',
                      fillOpacity: 1,
                      strokeColor: '#ffffff',
                      strokeWeight: 3,
                    }}
                    zIndex={100}
                  />
                )}

                {/* Dropoff Location Marker */}
                {dropoffLocation && (
                  <Marker
                    position={{ lat: dropoffLocation.lat, lng: dropoffLocation.lng }}
                    title="Dropoff Location"
                    label={{
                      text: 'D',
                      color: '#ffffff',
                      fontSize: '14px',
                      fontWeight: 'bold',
                    }}
                    onClick={() => setOpenInfoWindow('dropoff')}
                    icon={{
                      path: google.maps.SymbolPath.CIRCLE,
                      scale: 12,
                      fillColor: '#d32f2f',
                      fillOpacity: 1,
                      strokeColor: '#ffffff',
                      strokeWeight: 3,
                    }}
                    zIndex={100}
                  />
                )}

                {/* Pickup Info Window */}
                {openInfoWindow === 'pickup' && pickupLocation && (
                  <InfoWindow 
                    position={{ lat: pickupLocation.lat, lng: pickupLocation.lng }}
                    onCloseClick={() => setOpenInfoWindow(null)}
                    options={{ disableAutoPan: false }}
                  >
                    <div style={{ color: '#000', fontSize: '12px', padding: '8px' }}>
                      <p style={{ margin: '0 0 4px 0', fontWeight: 'bold', color: '#1b5e20' }}>📍 Pickup</p>
                      <p style={{ margin: '0 0 4px 0', fontSize: '11px', maxWidth: '200px' }}>{pickupLocation.address}</p>
                      <p style={{ margin: '0', fontSize: '9px', color: '#999' }}>
                        {pickupLocation.lat.toFixed(6)}, {pickupLocation.lng.toFixed(6)}
                      </p>
                    </div>
                  </InfoWindow>
                )}

                {/* Dropoff Info Window */}
                {openInfoWindow === 'dropoff' && dropoffLocation && (
                  <InfoWindow 
                    position={{ lat: dropoffLocation.lat, lng: dropoffLocation.lng }}
                    onCloseClick={() => setOpenInfoWindow(null)}
                    options={{ disableAutoPan: false }}
                  >
                    <div style={{ color: '#000', fontSize: '12px', padding: '8px' }}>
                      <p style={{ margin: '0 0 4px 0', fontWeight: 'bold', color: '#d32f2f' }}>📍 Dropoff</p>
                      <p style={{ margin: '0 0 4px 0', fontSize: '11px', maxWidth: '200px' }}>{dropoffLocation.address}</p>
                      <p style={{ margin: '0', fontSize: '9px', color: '#999' }}>
                        {dropoffLocation.lat.toFixed(6)}, {dropoffLocation.lng.toFixed(6)}
                      </p>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            </div>
          )}

          <button type="submit" disabled={loading || !pickupLocation || !dropoffLocation} className="btn-primary" style={{ marginTop: '24px', width: '100%', padding: '0.75rem' }}>
            {loading ? 'Processing...' : 'Find Available Drivers'}
          </button>
        </form>
      </div>
    </LoadScript>
  );
};

export default BookingForm;
