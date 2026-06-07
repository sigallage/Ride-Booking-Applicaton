import { useContext } from 'react';
import { RideContext } from '../context/RideContext';

export const useRideContext = () => {
  const context = useContext(RideContext);
  if (!context) {
    throw new Error('useRideContext must be used within RideProvider');
  }
  return context;
};
