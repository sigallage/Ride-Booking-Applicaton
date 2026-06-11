import { VehicleType } from '../services/driverService';

export const vehiclePricingRates: Record<VehicleType, number> = {
  MOTORBIKE: 30,  // LKR per km
  TUK: 40,        // LKR per km
  SMALL_CAR: 50,  // LKR per km
  LARGE_CAR: 50,  // LKR per km
};

export const vehicleCapacity: Record<VehicleType, number> = {
  MOTORBIKE: 1,   // capacity - update if needed
  TUK: 3,
  SMALL_CAR: 3,
  LARGE_CAR: 4,
};

export const calculateFareByVehicle = (
  distanceKm: number,
  vehicleType?: VehicleType
): number => {
  if (!vehicleType) {
    return 0;
  }
  const ratePerKm = vehiclePricingRates[vehicleType];
  return Math.round(distanceKm * ratePerKm);
};

export const getVehicleCapacity = (vehicleType?: VehicleType): number => {
  if (!vehicleType) {
    return 0;
  }
  return vehicleCapacity[vehicleType];
};
