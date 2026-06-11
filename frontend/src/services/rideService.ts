import apiClient from './apiClient';

export interface Ride {
  id: number;
  userId: number;
  driverId?: number;
  driverName?: string;
  driverPhone?: string;
  driverRating?: number;
  pickupLatitude: number;
  pickupLongitude: number;
  dropoffLatitude: number;
  dropoffLongitude: number;
  status: 'REQUESTED' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  estimatedDistanceKm?: number;
  estimatedFare?: number;
  createdAt?: string;
  completedAt?: string;
  rating?: number;
  feedback?: string;
}

export interface RideRequestDTO {
  userId: number;
  pickupLatitude: number;
  pickupLongitude: number;
  dropoffLatitude: number;
  dropoffLongitude: number;
  driverId?: number;
}

export const rideService = {
  createRide: (data: RideRequestDTO) =>
    apiClient.post<Ride>('/rides', data),

  getRide: (id: number) =>
    apiClient.get<Ride>(`/rides/${id}`),

  updateRideStatus: (id: number, status: string) =>
    apiClient.patch<Ride>(`/rides/${id}/status`, null, { params: { status } }),

  getRidesByUser: (userId: number) =>
    apiClient.get<Ride[]>(`/rides/user/${userId}`),

  getRidesByDriver: (driverId: number) =>
    apiClient.get<Ride[]>(`/rides/driver/${driverId}`),
};
