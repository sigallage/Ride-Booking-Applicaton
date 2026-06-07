import React, { createContext, useState, ReactNode } from 'react';
import { User } from '../services/userService';
import { Driver } from '../services/driverService';
import { Ride } from '../services/rideService';

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
  pickupLocation: { lat: number; lng: number } | null;
  setPickupLocation: (location: { lat: number; lng: number } | null) => void;
  dropoffLocation: { lat: number; lng: number } | null;
  setDropoffLocation: (location: { lat: number; lng: number } | null) => void;
}

export const RideContext = createContext<RideContextType | undefined>(undefined);

export const RideProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [availableDrivers, setAvailableDrivers] = useState<Driver[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [activeRide, setActiveRide] = useState<Ride | null>(null);
  const [pickupLocation, setPickupLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [dropoffLocation, setDropoffLocation] = useState<{ lat: number; lng: number } | null>(null);

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
