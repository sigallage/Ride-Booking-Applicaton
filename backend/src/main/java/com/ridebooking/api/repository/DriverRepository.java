package com.ridebooking.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.ridebooking.api.entity.Driver;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface DriverRepository extends JpaRepository<Driver, Long> {
    
    Optional<Driver> findByEmail(String email);
    
    List<Driver> findByStatus(Driver.DriverStatus status);
    
    @Query(value = "SELECT * FROM drivers d " +
           "WHERE d.status = 'AVAILABLE' " +
           "AND SQRT(POW(d.current_latitude - :latitude, 2) + POW(d.current_longitude - :longitude, 2)) * 111 <= :radiusKm " +
           "ORDER BY SQRT(POW(d.current_latitude - :latitude, 2) + POW(d.current_longitude - :longitude, 2)) * 111 ASC " +
           "LIMIT 1", 
           nativeQuery = true)
    Optional<Driver> findNearestAvailableDriver(
        @Param("latitude") BigDecimal latitude,
        @Param("longitude") BigDecimal longitude,
        @Param("radiusKm") double radiusKm
    );
    
    @Query(value = "SELECT * FROM drivers d " +
           "WHERE d.status = 'AVAILABLE' " +
           "AND SQRT(POW(d.current_latitude - :latitude, 2) + POW(d.current_longitude - :longitude, 2)) * 111 <= :radiusKm " +
           "ORDER BY SQRT(POW(d.current_latitude - :latitude, 2) + POW(d.current_longitude - :longitude, 2)) * 111 ASC",
           nativeQuery = true)
    List<Driver> findAvailableDriversNearby(
        @Param("latitude") BigDecimal latitude,
        @Param("longitude") BigDecimal longitude,
        @Param("radiusKm") double radiusKm
    );
}
