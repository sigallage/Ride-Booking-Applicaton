package com.ridebooking.api.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "drivers")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Driver {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DriverStatus status;

    @Column(name = "current_latitude", nullable = false, precision = 10, scale = 8)
    private BigDecimal currentLatitude;

    @Column(name = "current_longitude", nullable = false, precision = 11, scale = 8)
    private BigDecimal currentLongitude;

    @Column(nullable = false)
    @Builder.Default
    private Double rating = 5.0;

    @Column(name = "total_trips")
    @Builder.Default
    private Integer totalTrips = 0;

    @Column(name = "total_ratings")
    @Builder.Default
    private Integer totalRatings = 0;

    @Column(name = "total_rating_sum")
    @Builder.Default
    private Integer totalRatingSum = 0;

    @Enumerated(EnumType.STRING)
    @Column(name = "vehicle_type", nullable = false)
    @Builder.Default
    private VehicleType vehicleType = VehicleType.SMALL_CAR;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum DriverStatus {
        AVAILABLE,
        BUSY,
        OFFLINE
    }

    public enum VehicleType {
        MOTORBIKE,
        SMALL_CAR,
        LARGE_CAR,
        TUK
    }
}
