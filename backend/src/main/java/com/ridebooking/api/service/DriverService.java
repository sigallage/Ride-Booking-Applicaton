package com.ridebooking.api.service;

import com.ridebooking.api.dto.DriverDTO;
import com.ridebooking.api.dto.DriverCreateDTO;
import com.ridebooking.api.entity.Driver;
import com.ridebooking.api.entity.Driver.DriverStatus;
import com.ridebooking.api.exception.ResourceNotFoundException;
import com.ridebooking.api.exception.RideBookingException;
import com.ridebooking.api.repository.DriverRepository;
import com.ridebooking.api.util.LocationUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class DriverService {
    
    private final DriverRepository driverRepository;
    private static final double DEFAULT_SEARCH_RADIUS_KM = 10.0;
    
    /**
     * Register a new driver
     */
    public DriverDTO registerDriver(DriverCreateDTO request) {
        // Check if email already exists
        if (driverRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RideBookingException("Email already registered");
        }
        
        Driver driver = Driver.builder()
            .name(request.getName())
            .email(request.getEmail())
            .phone(request.getPhone())
            .currentLatitude(request.getCurrentLatitude())
            .currentLongitude(request.getCurrentLongitude())
            .status(DriverStatus.OFFLINE)
            .rating(5.0)
            .build();
        
        Driver savedDriver = driverRepository.save(driver);
        return mapToDTO(savedDriver, null);
    }
    
    /**
     * Get driver by ID
     */
    @Transactional(readOnly = true)
    public DriverDTO getDriver(Long driverId) {
        Driver driver = driverRepository.findById(driverId)
            .orElseThrow(() -> new ResourceNotFoundException("Driver not found with ID: " + driverId));
        return mapToDTO(driver, null);
    }
    
    /**
     * Update driver's availability status
     */
    public DriverDTO updateDriverStatus(Long driverId, DriverStatus status) {
        Driver driver = driverRepository.findById(driverId)
            .orElseThrow(() -> new ResourceNotFoundException("Driver not found with ID: " + driverId));
        
        driver.setStatus(status);
        Driver updatedDriver = driverRepository.save(driver);
        return mapToDTO(updatedDriver, null);
    }
    
    /**
     * Update driver's current location
     */
    public DriverDTO updateDriverLocation(Long driverId, BigDecimal latitude, BigDecimal longitude) {
        Driver driver = driverRepository.findById(driverId)
            .orElseThrow(() -> new ResourceNotFoundException("Driver not found with ID: " + driverId));
        
        driver.setCurrentLatitude(latitude);
        driver.setCurrentLongitude(longitude);
        Driver updatedDriver = driverRepository.save(driver);
        return mapToDTO(updatedDriver, null);
    }
    
    /**
     * Find nearest available driver within specified radius
     */
    @Transactional(readOnly = true)
    public DriverDTO findNearestAvailableDriver(BigDecimal latitude, BigDecimal longitude) {
        Driver driver = driverRepository.findNearestAvailableDriver(latitude, longitude, DEFAULT_SEARCH_RADIUS_KM)
            .orElseThrow(() -> new RideBookingException("No available drivers found in the area"));
        
        Double distanceKm = LocationUtil.calculateDistanceKm(latitude, longitude, 
                                                              driver.getCurrentLatitude(), 
                                                              driver.getCurrentLongitude());
        return mapToDTO(driver, distanceKm);
    }
    
    /**
     * Find all available drivers nearby
     */
    @Transactional(readOnly = true)
    public List<DriverDTO> findAvailableDriversNearby(BigDecimal latitude, BigDecimal longitude) {
        List<Driver> drivers = driverRepository.findAvailableDriversNearby(latitude, longitude, DEFAULT_SEARCH_RADIUS_KM);
        
        return drivers.stream().map(driver -> {
            Double distanceKm = LocationUtil.calculateDistanceKm(latitude, longitude,
                                                                  driver.getCurrentLatitude(),
                                                                  driver.getCurrentLongitude());
            return mapToDTO(driver, distanceKm);
        }).collect(Collectors.toList());
    }
    
    /**
     * Get all drivers
     */
    @Transactional(readOnly = true)
    public List<DriverDTO> getAllDrivers() {
        return driverRepository.findAll().stream()
            .map(driver -> mapToDTO(driver, null))
            .collect(Collectors.toList());
    }
    
    private DriverDTO mapToDTO(Driver driver, Double distanceKm) {
        return DriverDTO.builder()
            .id(driver.getId())
            .name(driver.getName())
            .email(driver.getEmail())
            .phone(driver.getPhone())
            .status(driver.getStatus())
            .currentLatitude(driver.getCurrentLatitude())
            .currentLongitude(driver.getCurrentLongitude())
            .rating(driver.getRating())
            .distanceKm(distanceKm)
            .build();
    }
}
