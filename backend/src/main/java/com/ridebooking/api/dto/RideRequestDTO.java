package com.ridebooking.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RideRequestDTO {
    @NotNull(message = "User ID cannot be null")
    private Long userId;

    @NotNull(message = "Pickup latitude cannot be null")
    private BigDecimal pickupLatitude;

    @NotNull(message = "Pickup longitude cannot be null")
    private BigDecimal pickupLongitude;

    @NotNull(message = "Dropoff latitude cannot be null")
    private BigDecimal dropoffLatitude;

    @NotNull(message = "Dropoff longitude cannot be null")
    private BigDecimal dropoffLongitude;

    // Optional: If a specific driver is selected, use their vehicle type for fare calculation
    private Long driverId;
}
