import apiClient from './apiClient';

export type VehicleType = 'MOTORBIKE' | 'SMALL_CAR' | 'LARGE_CAR' | 'TUK';

export interface Driver {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: 'AVAILABLE' | 'BUSY' | 'OFFLINE';
  currentLatitude: number;
  currentLongitude: number;
  rating: number;
  totalTrips?: number;
  vehicleType?: VehicleType;
  distanceKm?: number;
}

export interface DriverCreateRequest {
  name: string;
  email: string;
  phone: string;
  currentLatitude: number;
  currentLongitude: number;
  vehicleType: VehicleType;
}

export const driverService = {
  registerDriver: (data: DriverCreateRequest) =>
    apiClient.post<Driver>('/drivers', data),

  getDriver: (id: number) =>
    apiClient.get<Driver>(`/drivers/${id}`),

  getAllDrivers: () =>
    apiClient.get<Driver[]>('/drivers'),

  updateDriverStatus: (id: number, status: string) =>
    apiClient.patch<Driver>(`/drivers/${id}/status`, null, { params: { status } }),

  updateDriverLocation: (id: number, latitude: number, longitude: number) =>
    apiClient.patch<Driver>(`/drivers/${id}/location`, null, {
      params: { latitude, longitude },
    }),

  findNearbyDrivers: (latitude: number, longitude: number) =>
    apiClient.get<Driver[]>('/drivers/nearby', {
      params: { latitude, longitude },
    }),
};
