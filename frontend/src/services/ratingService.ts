import apiClient from './apiClient';

export interface RideRating {
  rideId: number;
  rating: number;
  feedback: string;
}

const ratingService = {
  submitRideRating: async (rideId: number, rating: number, feedback: string) => {
    try {
      const response = await apiClient.post(`/rides/${rideId}/rating`, {
        rideId,
        rating,
        feedback,
      });
      console.log('Rating submission successful:', response.data);
      return response;
    } catch (error: any) {
      console.error('Rating submission failed:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      throw error;
    }
  },
};

export default ratingService;
