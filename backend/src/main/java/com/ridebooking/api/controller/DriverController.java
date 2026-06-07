package com.ridebooking.api.controller;

import com.ridebooking.api.dto.DriverDTO;
import com.ridebooking.api.dto.DriverCreateDTO;
import com.ridebooking.api.entity.Driver.DriverStatus;
import com.ridebooking.api.service.DriverService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/drivers")
@RequiredArgsConstructor
@Tag(name = "Driver Management", description = "APIs for managing drivers")
public class DriverController {
    
    private final DriverService driverService;
    
    /**
     * Register a new driver
     */
    @PostMapping
    @Operation(summary = "Register a new driver")
    public ResponseEntity<DriverDTO> registerDriver(@Valid @RequestBody DriverCreateDTO request) {
        DriverDTO driver = driverService.registerDriver(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(driver);
    }
    
    /**
     * Get driver by ID
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get driver details")
    public ResponseEntity<DriverDTO> getDriver(@PathVariable Long id) {
        DriverDTO driver = driverService.getDriver(id);
        return ResponseEntity.ok(driver);
    }
    
    /**
     * Get all drivers
     */
    @GetMapping
    @Operation(summary = "List all drivers")
    public ResponseEntity<List<DriverDTO>> getAllDrivers() {
        List<DriverDTO> drivers = driverService.getAllDrivers();
        return ResponseEntity.ok(drivers);
    }
    
    /**
     * Update driver status (AVAILABLE, BUSY, OFFLINE)
     */
    @PatchMapping("/{id}/status")
    @Operation(summary = "Update driver availability status")
    public ResponseEntity<DriverDTO> updateDriverStatus(
            @PathVariable Long id,
            @RequestParam DriverStatus status) {
        DriverDTO driver = driverService.updateDriverStatus(id, status);
        return ResponseEntity.ok(driver);
    }
    
    /**
     * Update driver location
     */
    @PatchMapping("/{id}/location")
    @Operation(summary = "Update driver's current location")
    public ResponseEntity<DriverDTO> updateDriverLocation(
            @PathVariable Long id,
            @RequestParam BigDecimal latitude,
            @RequestParam BigDecimal longitude) {
        DriverDTO driver = driverService.updateDriverLocation(id, latitude, longitude);
        return ResponseEntity.ok(driver);
    }
    
    /**
     * Find nearby available drivers
     */
    @GetMapping("/nearby")
    @Operation(summary = "Find available drivers nearby a location")
    public ResponseEntity<List<DriverDTO>> findNearbyDrivers(
            @RequestParam BigDecimal latitude,
            @RequestParam BigDecimal longitude) {
        List<DriverDTO> drivers = driverService.findAvailableDriversNearby(latitude, longitude);
        return ResponseEntity.ok(drivers);
    }
}
