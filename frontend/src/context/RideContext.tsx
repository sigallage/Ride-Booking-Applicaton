import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../services/userService';
import { Driver } from '../services/driverService';
import { Ride } from '../services/rideService';
import authService from '../services/authService';

interface RideContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (authenticated: boolean) => void;
  availableDrivers: Driver[];
  setAvailableDrivers: (drivers: Driver[]) => void;
  selectedDriver: Driver | null;
  setSelectedDriver: (driver: Driver | null) => void;
  activeRide: Ride | null;
  setActiveRide: (ride: Ride | null) => void;
  pickupLocation: { lat: number; lng: number; address: string } | null;
  setPickupLocation: (location: { lat: number; lng: number; address: string } | null) => void;
  dropoffLocation: { lat: number; lng: number; address: string } | null;
  setDropoffLocation: (location: { lat: number; lng: number; address: string } | null) => void;
}

export const RideContext = createContext<RideContextType | undefined>(undefined);

export const RideProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [availableDrivers, setAvailableDrivers] = useState<Driver[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [activeRide, setActiveRide] = useState<Ride | null>(null);
  const [pickupLocation, setPickupLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [dropoffLocation, setDropoffLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);

  // Initialize user and auth state from localStorage on mount
  useEffect(() => {
    const storedUser = authService.getUser();
    const token = authService.getToken();
    if (storedUser && token) {
      setCurrentUser(storedUser);
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <RideContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isAuthenticated,
        setIsAuthenticated,
        availableDrivers,
        setAvailableDrivers,
        selectedDriver,
        setSelectedDriver,
        activeRide,
        setActiveRide,
        pickupLocation,
        setPickupLocation,
        dropoffLocation,
        setDropoffLocation,
      }}
    >
      {children}
    </RideContext.Provider>
  );
};
