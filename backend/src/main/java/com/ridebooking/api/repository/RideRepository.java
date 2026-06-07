package com.ridebooking.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.ridebooking.api.entity.Ride;
import java.util.List;

@Repository
public interface RideRepository extends JpaRepository<Ride, Long> {
    List<Ride> findByUserId(Long userId);
    List<Ride> findByDriverId(Long driverId);
    List<Ride> findByStatus(Ride.RideStatus status);
}
