import React, { useState, useRef, useEffect } from 'react';

interface LocationPickerProps {
  label: string;
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
  currentValue?: string;
}

interface PlacePrediction {
  main_text: string;
  secondary_text: string;
  place_id: string;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  label,
  onLocationSelect,
  currentValue = '',
}) => {
  const [searchInput, setSearchInput] = useState(currentValue);
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [showPredictions, setShowPredictions] = useState(false);
  const [loading, setLoading] = useState(false);
  const autoCompleteRef = useRef<google.maps.places.AutocompleteService | null>(null);

  // Initialize services when component mounts
  useEffect(() => {
    const initServices = () => {
      if (typeof google !== 'undefined' && google.maps) {
        try {
          if (google.maps.places) {
            autoCompleteRef.current = new google.maps.places.AutocompleteService();
          }
        } catch (error) {
          console.error('Error initializing Google Maps services:', error);
        }
      }
    };

    const timer = setTimeout(initServices, 500);
    return () => clearTimeout(timer);
  }, []);

  // Handle autocomplete search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);

    if (value.length > 2 && autoCompleteRef.current) {
      setLoading(true);
      try {
        autoCompleteRef.current.getPlacePredictions(
          {
            input: value,
            componentRestrictions: { country: 'lk' },
          },
          (predictions: any, status: string) => {
            setLoading(false);
            if (status === 'OK' && predictions) {
              const mappedPredictions: PlacePrediction[] = predictions.map((pred: any) => ({
                main_text: pred.main_text || pred.description || '',
                secondary_text: pred.secondary_text || '',
                place_id: pred.place_id || '',
              }));
              setPredictions(mappedPredictions);
              setShowPredictions(true);
            } else {
              setPredictions([]);
            }
          }
        );
      } catch (error) {
        console.error('Autocomplete error:', error);
        setLoading(false);
      }
    } else {
      setPredictions([]);
      setShowPredictions(false);
    }
  };

  // Handle prediction selection
  const handlePredictionSelect = (prediction: PlacePrediction) => {
    if (!google?.maps?.places) return;

    try {
      const service = new google.maps.places.PlacesService(
        document.createElement('div')
      );
      service.getDetails(
        { placeId: prediction.place_id, fields: ['geometry', 'formatted_address'] },
        (place: any, status: any) => {
          if (status === 'OK' && place.geometry?.location) {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            setSearchInput(place.formatted_address);
            setPredictions([]);
            setShowPredictions(false);
            onLocationSelect({ lat, lng, address: place.formatted_address });
          }
        }
      );
    } catch (error) {
      console.error('Places service error:', error);
    }
  };

  return (
    <div className="location-picker">
      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#222' }}>
        {label}
      </label>

      {/* Autocomplete Input */}
      <div style={{ position: 'relative', marginBottom: '12px' }}>
        <input
          type="text"
          placeholder="Search for a location..."
          value={searchInput}
          onChange={handleSearchChange}
          onFocus={() => searchInput.length > 2 && setShowPredictions(true)}
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '2px solid #e0e0e0',
            borderRadius: '6px',
            fontSize: '14px',
            transition: 'all 0.3s ease',
          }}
        />

        {/* Predictions Dropdown */}
        {showPredictions && predictions.length > 0 && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: 'white',
              border: '1px solid #ddd',
              borderRadius: '6px',
              maxHeight: '200px',
              overflowY: 'auto',
              zIndex: 1000,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            {predictions.map((pred, index) => (
              <div
                key={index}
                onClick={() => handlePredictionSelect(pred)}
                style={{
                  padding: '10px 12px',
                  borderBottom: '1px solid #f0f0f0',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.backgroundColor = '#f5f5f5';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.backgroundColor = 'white';
                }}
              >
                <p style={{ margin: '0 0 2px 0', fontSize: '13px', fontWeight: '500' }}>
                  {pred.main_text}
                </p>
                <p style={{ margin: '0', fontSize: '12px', color: '#999' }}>
                  {pred.secondary_text}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationPicker;
