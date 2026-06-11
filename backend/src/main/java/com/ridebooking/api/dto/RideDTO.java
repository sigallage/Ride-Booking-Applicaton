package com.ridebooking.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.ridebooking.api.entity.Ride;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RideDTO {
    private Long id;
    private Long userId;
    private Long driverId;
    private String driverName;
    private String driverPhone;
    private Double driverRating;
    private BigDecimal pickupLatitude;
    private BigDecimal pickupLongitude;
    private BigDecimal dropoffLatitude;
    private BigDecimal dropoffLongitude;
    private Ride.RideStatus status;
    private Double estimatedDistanceKm;
    private BigDecimal estimatedFare;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;
    private Integer rating;
    private String feedback;
}
