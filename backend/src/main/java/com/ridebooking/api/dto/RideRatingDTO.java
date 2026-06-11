package com.ridebooking.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RideRatingDTO {
    private Long rideId;
    private Integer rating;
    private String feedback;
}
