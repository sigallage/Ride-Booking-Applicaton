package com.ridebooking.api.util;

import java.math.BigDecimal;
import com.ridebooking.api.entity.Driver;

/**
 * Utility class for distance and location calculations
 */
public class LocationUtil {
    
    private static final double EARTH_RADIUS_KM = 6371.0;
    private static final double KM_PER_DEGREE = 111.0;
    
    // Pricing per km in LKR
    private static final double MOTORBIKE_RATE = 30.0;
    private static final double TUK_RATE = 40.0;
    private static final double SMALL_CAR_RATE = 50.0;
    private static final double LARGE_CAR_RATE = 50.0;
    
    /**
     * Calculate distance between two coordinates using Haversine formula
     * @param lat1 First latitude
     * @param lon1 First longitude
     * @param lat2 Second latitude
     * @param lon2 Second longitude
     * @return Distance in kilometers
     */
    public static double calculateDistanceKm(BigDecimal lat1, BigDecimal lon1, 
                                             BigDecimal lat2, BigDecimal lon2) {
        double latRad1 = Math.toRadians(lat1.doubleValue());
        double latRad2 = Math.toRadians(lat2.doubleValue());
        double deltaLat = Math.toRadians(lat2.doubleValue() - lat1.doubleValue());
        double deltaLon = Math.toRadians(lon2.doubleValue() - lon1.doubleValue());
        
        double a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
                   Math.cos(latRad1) * Math.cos(latRad2) *
                   Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
        
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return EARTH_RADIUS_KM * c;
    }
    
    /**
     * Calculate estimated fare based on distance
     * Base fare: $2.50, Per km: $1.50
     * @param distanceKm Distance in kilometers
     * @return Estimated fare
     */
    public static BigDecimal calculateEstimatedFare(Double distanceKm) {
        if (distanceKm == null) {
            return BigDecimal.valueOf(2.50);
        }
        double fare = 2.50 + (distanceKm * 1.50);
        return BigDecimal.valueOf(fare).setScale(2, BigDecimal.ROUND_HALF_UP);
    }
    
    /**
     * Calculate estimated fare based on distance and vehicle type
     * Vehicle rates in LKR per km:
     * - Motorbike: 30 LKR/km
     * - Tuk: 40 LKR/km
     * - Small Car: 50 LKR/km
     * - Large Car: 50 LKR/km
     * @param distanceKm Distance in kilometers
     * @param vehicleType Type of vehicle
     * @return Estimated fare in LKR
     */
    public static BigDecimal calculateEstimatedFareByVehicle(Double distanceKm, Driver.VehicleType vehicleType) {
        if (distanceKm == null || vehicleType == null) {
            return BigDecimal.valueOf(0);
        }
        
        double ratePerKm;
        switch (vehicleType) {
            case MOTORBIKE:
                ratePerKm = MOTORBIKE_RATE;
                break;
            case TUK:
                ratePerKm = TUK_RATE;
                break;
            case SMALL_CAR:
                ratePerKm = SMALL_CAR_RATE;
                break;
            case LARGE_CAR:
                ratePerKm = LARGE_CAR_RATE;
                break;
            default:
                ratePerKm = SMALL_CAR_RATE;
        }
        
        double fare = distanceKm * ratePerKm;
        return BigDecimal.valueOf(fare).setScale(2, BigDecimal.ROUND_HALF_UP);
    }
}
