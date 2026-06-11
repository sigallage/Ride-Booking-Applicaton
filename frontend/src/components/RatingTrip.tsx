import React, { useState } from 'react';
import './RatingTrip.css';

interface RatingTripProps {
  rideId: number;
  driverName: string;
  distance: number;
  fare: number;
  onSubmit: (rating: number, feedback: string) => Promise<void>;
  onSkip: () => void;
}

const RatingTrip: React.FC<RatingTripProps> = ({ rideId, driverName, distance, fare, onSubmit, onSkip }) => {
  const [rating, setRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onSubmit(rating, feedback);
      setSubmitted(true);
    } catch (err: any) {
      console.error('Rating submission error:', err);
      console.error('Error details:', err.response?.data || err.message);
      setError(err.response?.data?.message || err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="rating-trip">
        <div className="rating-success">
          <div className="success-icon">✓</div>
          <h3>Thank you for your feedback!</h3>
          <p>Your rating has been submitted successfully.</p>
          <button onClick={onSkip} className="btn-primary">
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rating-trip">
      <div className="rating-card">
        <h3>How was your trip?</h3>
        <p className="trip-info">with {driverName}</p>

        {error && <div className="error-message">{error}</div>}

        <div className="trip-summary">
          <div className="summary-item">
            <span>Distance:</span>
            <strong>{distance.toFixed(1)} km</strong>
          </div>
          <div className="summary-item">
            <span>Total Fare:</span>
            <strong>${fare.toFixed(2)}</strong>
          </div>
        </div>

        <div className="rating-stars">
          <label>Rate your experience:</label>
          <div className="stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className={`star ${rating >= star ? 'active' : ''}`}
                onClick={() => setRating(star)}
                disabled={loading}
              >
                ★
              </button>
            ))}
          </div>
          {rating > 0 && <p className="rating-text">{rating} out of 5 stars</p>}
        </div>

        <div className="feedback-section">
          <label htmlFor="feedback">Additional feedback (optional):</label>
          <textarea
            id="feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Tell us more about your experience..."
            disabled={loading}
            rows={3}
          />
        </div>

        <div className="rating-actions">
          <button
            onClick={onSkip}
            className="btn-secondary"
            disabled={loading}
          >
            Skip
          </button>
          <button
            onClick={handleSubmit}
            className="btn-primary"
            disabled={loading || rating === 0}
          >
            {loading ? 'Submitting...' : 'Submit Rating'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingTrip;
