package com.ridebooking.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import com.ridebooking.api.entity.Driver;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DriverCreateDTO {
    @NotBlank(message = "Name cannot be blank")
    private String name;

    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Email should be valid")
    private String email;

    @NotBlank(message = "Phone cannot be blank")
    private String phone;

    @NotNull(message = "Initial latitude cannot be null")
    private BigDecimal currentLatitude;

    @NotNull(message = "Initial longitude cannot be null")
    private BigDecimal currentLongitude;

    @NotNull(message = "Vehicle type cannot be null")
    private Driver.VehicleType vehicleType;

    private String gender;
}
