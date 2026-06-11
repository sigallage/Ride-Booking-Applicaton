package com.ridebooking.api.service;

import com.ridebooking.api.dto.RideDTO;
import com.ridebooking.api.dto.RideRequestDTO;
import com.ridebooking.api.entity.Driver;
import com.ridebooking.api.entity.Ride;
import com.ridebooking.api.entity.Ride.RideStatus;
import com.ridebooking.api.entity.User;
import com.ridebooking.api.exception.ResourceNotFoundException;
import com.ridebooking.api.exception.RideBookingException;
import com.ridebooking.api.repository.DriverRepository;
import com.ridebooking.api.repository.RideRepository;
import com.ridebooking.api.repository.UserRepository;
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
public class RideService {
    
    private final RideRepository rideRepository;
    private final UserRepository userRepository;
    private final DriverRepository driverRepository;
    private final DriverService driverService;
    
    /**
     * Create a new ride request and assign nearest driver
     */
    public RideDTO createRide(RideRequestDTO request) {
        // Verify user exists
        User user = userRepository.findById(request.getUserId())
            .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + request.getUserId()));
        
        // Calculate estimated distance and fare
        Double distanceKm = LocationUtil.calculateDistanceKm(
            request.getPickupLatitude(), request.getPickupLongitude(),
            request.getDropoffLatitude(), request.getDropoffLongitude()
        );
        
        // Determine fare based on vehicle type if driver is specified, otherwise use default
        BigDecimal estimatedFare;
        Driver selectedDriver = null;
        
        if (request.getDriverId() != null) {
            selectedDriver = driverRepository.findById(request.getDriverId())
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found with ID: " + request.getDriverId()));
            estimatedFare = LocationUtil.calculateEstimatedFareByVehicle(distanceKm, selectedDriver.getVehicleType());
        } else {
            estimatedFare = LocationUtil.calculateEstimatedFare(distanceKm);
        }
        
        // Create ride in REQUESTED status
        Ride ride = Ride.builder()
            .user(user)
            .driver(selectedDriver)
            .pickupLatitude(request.getPickupLatitude())
            .pickupLongitude(request.getPickupLongitude())
            .dropoffLatitude(request.getDropoffLatitude())
            .dropoffLongitude(request.getDropoffLongitude())
            .status(selectedDriver != null ? RideStatus.ASSIGNED : RideStatus.REQUESTED)
            .estimatedDistanceKm(distanceKm)
            .estimatedFare(estimatedFare)
            .build();
        
        Ride savedRide = rideRepository.save(ride);
        
        // If no driver was specified, try to assign nearest driver
        if (selectedDriver == null) {
            try {
                assignNearestDriver(savedRide);
                savedRide = rideRepository.save(savedRide);
            } catch (RideBookingException e) {
                // No drivers available, but ride is created and waiting
                // Client can check later or try again
            }
        } else {
            // Mark selected driver as BUSY
            selectedDriver.setStatus(Driver.DriverStatus.BUSY);
            driverRepository.save(selectedDriver);
        }
        
        return mapToDTO(savedRide);
    }
    
    /**
     * Assign the nearest available driver to a ride
     */
    @Transactional
    public void assignNearestDriver(Ride ride) {
        if (ride.getStatus() != RideStatus.REQUESTED) {
            throw new RideBookingException("Ride can only be assigned when in REQUESTED status");
        }
        
        Driver nearestDriver = driverRepository.findNearestAvailableDriver(
            ride.getPickupLatitude(), 
            ride.getPickupLongitude(), 
            10.0
        ).orElseThrow(() -> new RideBookingException("No available drivers found in the area"));
        
        ride.setDriver(nearestDriver);
        ride.setStatus(RideStatus.ASSIGNED);
        
        // Update driver status to BUSY
        nearestDriver.setStatus(Driver.DriverStatus.BUSY);
        driverRepository.save(nearestDriver);
    }
    
    /**
     * Get ride details
     */
    @Transactional(readOnly = true)
    public RideDTO getRide(Long rideId) {
        Ride ride = rideRepository.findById(rideId)
            .orElseThrow(() -> new ResourceNotFoundException("Ride not found with ID: " + rideId));
        return mapToDTO(ride);
    }
    
    /**
     * Update ride status
     */
    public RideDTO updateRideStatus(Long rideId, RideStatus newStatus) {
        Ride ride = rideRepository.findById(rideId)
            .orElseThrow(() -> new ResourceNotFoundException("Ride not found with ID: " + rideId));
        
        validateStatusTransition(ride.getStatus(), newStatus);
        
        ride.setStatus(newStatus);
        
        // If ride is completed, mark driver as AVAILABLE
        if (newStatus == RideStatus.COMPLETED) {
            if (ride.getDriver() != null) {
                ride.getDriver().setStatus(Driver.DriverStatus.AVAILABLE);
                driverRepository.save(ride.getDriver());
            }
        }
        
        Ride updatedRide = rideRepository.save(ride);
        return mapToDTO(updatedRide);
    }
    
    /**
     * Get all rides for a user
     */
    @Transactional(readOnly = true)
    public List<RideDTO> getRidesByUser(Long userId) {
        return rideRepository.findByUserId(userId).stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Get all rides for a driver
     */
    @Transactional(readOnly = true)
    public List<RideDTO> getRidesByDriver(Long driverId) {
        return rideRepository.findByDriverId(driverId).stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Submit rating for a completed ride
     */
    public RideDTO submitRideRating(Long rideId, Integer rating, String feedback) {
        if (rating < 1 || rating > 5) {
            throw new RideBookingException("Rating must be between 1 and 5");
        }
        
        Ride ride = rideRepository.findById(rideId)
            .orElseThrow(() -> new ResourceNotFoundException("Ride not found with ID: " + rideId));
        
        if (ride.getStatus() != RideStatus.COMPLETED) {
            throw new RideBookingException("Only completed rides can be rated");
        }
        
        ride.setRating(rating);
        ride.setFeedback(feedback);
        Ride updatedRide = rideRepository.save(ride);
        
        // Update driver rating
        if (ride.getDriver() != null) {
            Driver driver = ride.getDriver();
            
            // Handle null values for existing drivers (fields added later)
            Integer currentTotalRatings = driver.getTotalRatings() != null ? driver.getTotalRatings() : 0;
            Integer currentTotalRatingSum = driver.getTotalRatingSum() != null ? driver.getTotalRatingSum() : 0;
            Integer currentTotalTrips = driver.getTotalTrips() != null ? driver.getTotalTrips() : 0;
            
            driver.setTotalRatings(currentTotalRatings + 1);
            driver.setTotalRatingSum(currentTotalRatingSum + rating);
            driver.setTotalTrips(currentTotalTrips + 1);
            
            // Recalculate average rating
            int newTotalRatingSum = driver.getTotalRatingSum();
            int newTotalRatings = driver.getTotalRatings();
            double newRating = (double) newTotalRatingSum / newTotalRatings;
            driver.setRating(Math.round(newRating * 10.0) / 10.0); // Round to 1 decimal place
            
            driverRepository.save(driver);
        }
        
        return mapToDTO(updatedRide);
    }
    
    private void validateStatusTransition(RideStatus currentStatus, RideStatus newStatus) {
        // Define valid transitions
        if (currentStatus == RideStatus.REQUESTED && (newStatus != RideStatus.ASSIGNED && newStatus != RideStatus.CANCELLED)) {
            throw new RideBookingException("Invalid status transition from " + currentStatus + " to " + newStatus);
        }
        if (currentStatus == RideStatus.ASSIGNED && (newStatus != RideStatus.IN_PROGRESS && newStatus != RideStatus.CANCELLED)) {
            throw new RideBookingException("Invalid status transition from " + currentStatus + " to " + newStatus);
        }
        if (currentStatus == RideStatus.IN_PROGRESS && newStatus != RideStatus.COMPLETED) {
            throw new RideBookingException("Invalid status transition from " + currentStatus + " to " + newStatus);
        }
    }
    
    private RideDTO mapToDTO(Ride ride) {
        return RideDTO.builder()
            .id(ride.getId())
            .userId(ride.getUser().getId())
            .driverId(ride.getDriver() != null ? ride.getDriver().getId() : null)
            .driverName(ride.getDriver() != null ? ride.getDriver().getName() : null)
            .driverPhone(ride.getDriver() != null ? ride.getDriver().getPhone() : null)
            .driverRating(ride.getDriver() != null ? ride.getDriver().getRating() : null)
            .pickupLatitude(ride.getPickupLatitude())
            .pickupLongitude(ride.getPickupLongitude())
            .dropoffLatitude(ride.getDropoffLatitude())
            .dropoffLongitude(ride.getDropoffLongitude())
            .status(ride.getStatus())
            .estimatedDistanceKm(ride.getEstimatedDistanceKm())
            .estimatedFare(ride.getEstimatedFare())
            .createdAt(ride.getCreatedAt())
            .completedAt(ride.getCompletedAt())
            .rating(ride.getRating())
            .feedback(ride.getFeedback())
            .driverGender(ride.getDriver() != null ? ride.getDriver().getGender() : null)
            .build();
    }
}
