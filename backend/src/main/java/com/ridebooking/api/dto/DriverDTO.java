package com.ridebooking.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.ridebooking.api.entity.Driver;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DriverDTO {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private Driver.DriverStatus status;
    private BigDecimal currentLatitude;
    private BigDecimal currentLongitude;
    private Double rating;
    private Double distanceKm;
    private Integer totalTrips;
    private Driver.VehicleType vehicleType;
}
