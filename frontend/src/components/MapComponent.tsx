import React, { useState } from 'react';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import { useRideContext } from '../hooks/useRideContext';
import { Driver } from '../services/driverService';

const MapComponent: React.FC = () => {
  const { pickupLocation, dropoffLocation, availableDrivers, selectedDriver } = useRideContext();
  const [selectedMarker, setSelectedMarker] = useState<Driver | null>(null);

  const mapContainerStyle = {
    width: '100%',
    height: '100%',
  };

  // Calculate center of map
  const getMapCenter = () => {
    if (pickupLocation) {
      return { lat: pickupLocation.lat, lng: pickupLocation.lng };
    }
    if (availableDrivers.length > 0) {
      const avgLat =
        availableDrivers.reduce((sum, d) => sum + d.currentLatitude, 0) / availableDrivers.length;
      const avgLng =
        availableDrivers.reduce((sum, d) => sum + d.currentLongitude, 0) / availableDrivers.length;
      return { lat: avgLat, lng: avgLng };
    }
    return { lat: 6.9271, lng: 80.7789 }; // Default to Colombo, Sri Lanka
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return '#1b5e20'; // Dark green for available
      case 'BUSY':
        return '#ff6f00'; // Orange for busy
      case 'OFFLINE':
        return '#666'; // Gray for offline
      default:
        return '#1b5e20';
    }
  };

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={getMapCenter()}
      zoom={availableDrivers.length > 0 ? 12 : 9}
      options={{
        mapTypeControl: true,
        fullscreenControl: true,
        streetViewControl: false,
      }}
    >
        {/* Pickup Location Marker */}
        {pickupLocation && (
          <Marker
            position={{ lat: pickupLocation.lat, lng: pickupLocation.lng }}
            title="Pickup Location"
            icon={{
              path: 'M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0zm0 20c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z',
              fillColor: '#1b5e20',
              fillOpacity: 1,
              strokeColor: '#fff',
              strokeWeight: 2,
              scale: 1.5,
            }}
          />
        )}

        {/* Dropoff Location Marker */}
        {dropoffLocation && (
          <Marker
            position={{ lat: dropoffLocation.lat, lng: dropoffLocation.lng }}
            title="Dropoff Location"
            icon={{
              path: 'M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0zm0 20c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z',
              fillColor: '#d32f2f',
              fillOpacity: 1,
              strokeColor: '#fff',
              strokeWeight: 2,
              scale: 1.5,
            }}
          />
        )}

        {/* Driver Markers */}
        {availableDrivers.map((driver) => (
          <Marker
            key={driver.id}
            position={{ lat: driver.currentLatitude, lng: driver.currentLongitude }}
            title={driver.name}
            onClick={() => setSelectedMarker(driver)}
            icon={{
              path: 'M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0zm0 20c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z',
              fillColor: getStatusColor(driver.status),
              fillOpacity: 0.9,
              strokeColor: selectedDriver?.id === driver.id ? '#ffd700' : '#fff',
              strokeWeight: selectedDriver?.id === driver.id ? 3 : 2,
              scale: selectedDriver?.id === driver.id ? 1.8 : 1.3,
            }}
          />
        ))}

        {/* Info Window for selected driver */}
        {selectedMarker && (
          <InfoWindow
            position={{ lat: selectedMarker.currentLatitude, lng: selectedMarker.currentLongitude }}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div style={{ color: '#000', fontSize: '13px', maxWidth: '250px', padding: '5px' }}>
              <p style={{ margin: '0 0 6px 0', fontWeight: 'bold', fontSize: '14px' }}>
                {selectedMarker.name}
              </p>
              <p style={{ margin: '0 0 4px 0', color: '#1b5e20', fontWeight: '600' }}>
                ☎️ {selectedMarker.phone}
              </p>
              <hr style={{ margin: '6px 0', border: 'none', borderTop: '1px solid #ddd' }} />
              <p style={{ margin: '0 0 3px 0', fontSize: '12px' }}>
                <strong>Status:</strong> {selectedMarker.status}
              </p>
              <p style={{ margin: '0 0 3px 0', fontSize: '12px' }}>
                <strong>Rating:</strong> {selectedMarker.rating.toFixed(1)} ⭐
              </p>
              <p style={{ margin: '0 0 3px 0', fontSize: '11px' }}>
                <strong>Lat:</strong> {selectedMarker.currentLatitude.toString()}
              </p>
              <p style={{ margin: '0 0 3px 0', fontSize: '11px' }}>
                <strong>Lng:</strong> {selectedMarker.currentLongitude.toString()}
              </p>
              {selectedMarker.distanceKm && (
                <p style={{ margin: '3px 0 0 0', color: '#1b5e20', fontWeight: 'bold', fontSize: '12px' }}>
                  📍 Distance: {selectedMarker.distanceKm.toFixed(2)} km
                </p>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
  );
};

export default MapComponent;
