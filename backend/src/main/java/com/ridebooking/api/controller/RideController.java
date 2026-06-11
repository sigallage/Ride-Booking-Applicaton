package com.ridebooking.api.controller;

import com.ridebooking.api.dto.RideDTO;
import com.ridebooking.api.dto.RideRequestDTO;
import com.ridebooking.api.dto.RideRatingDTO;
import com.ridebooking.api.entity.Ride.RideStatus;
import com.ridebooking.api.service.RideService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import java.util.List;

@RestController
@RequestMapping("/rides")
@RequiredArgsConstructor
@Tag(name = "Ride Management", description = "APIs for booking and managing rides")
public class RideController {
    
    private final RideService rideService;
    
    /**
     * Create a new ride booking
     */
    @PostMapping
    @Operation(summary = "Create a new ride booking")
    public ResponseEntity<RideDTO> createRide(@Valid @RequestBody RideRequestDTO request) {
        RideDTO ride = rideService.createRide(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ride);
    }
    
    /**
     * Get ride details
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get ride details")
    public ResponseEntity<RideDTO> getRide(@PathVariable Long id) {
        RideDTO ride = rideService.getRide(id);
        return ResponseEntity.ok(ride);
    }
    
    /**
     * Update ride status
     */
    @PatchMapping("/{id}/status")
    @Operation(summary = "Update ride status")
    public ResponseEntity<RideDTO> updateRideStatus(
            @PathVariable Long id,
            @RequestParam RideStatus status) {
        RideDTO ride = rideService.updateRideStatus(id, status);
        return ResponseEntity.ok(ride);
    }
    
    /**
     * Get all rides for a user
     */
    @GetMapping("/user/{userId}")
    @Operation(summary = "Get all rides for a user")
    public ResponseEntity<List<RideDTO>> getRidesByUser(@PathVariable Long userId) {
        List<RideDTO> rides = rideService.getRidesByUser(userId);
        return ResponseEntity.ok(rides);
    }
    
    /**
     * Get all rides for a driver
     */
    @GetMapping("/driver/{driverId}")
    @Operation(summary = "Get all rides for a driver")
    public ResponseEntity<List<RideDTO>> getRidesByDriver(@PathVariable Long driverId) {
        List<RideDTO> rides = rideService.getRidesByDriver(driverId);
        return ResponseEntity.ok(rides);
    }
    
    /**
     * Submit rating for a completed ride
     */
    @PostMapping("/{id}/rating")
    @Operation(summary = "Submit rating for a completed ride")
    public ResponseEntity<RideDTO> submitRideRating(
            @PathVariable Long id,
            @Valid @RequestBody RideRatingDTO ratingRequest) {
        RideDTO ride = rideService.submitRideRating(id, ratingRequest.getRating(), ratingRequest.getFeedback());
        return ResponseEntity.ok(ride);
    }
}
