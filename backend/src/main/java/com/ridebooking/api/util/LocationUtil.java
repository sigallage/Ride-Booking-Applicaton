package com.ridebooking.api.util;

import java.math.BigDecimal;

/**
 * Utility class for distance and location calculations
 */
public class LocationUtil {
    
    private static final double EARTH_RADIUS_KM = 6371.0;
    private static final double KM_PER_DEGREE = 111.0;
    
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
}
