package com.ridebooking.api.controller;

import com.ridebooking.api.dto.AuthResponseDTO;
import com.ridebooking.api.dto.LoginRequestDTO;
import com.ridebooking.api.entity.User;
import com.ridebooking.api.service.UserService;
import com.ridebooking.api.util.JwtTokenProvider;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "APIs for user authentication")
public class AuthenticationController {

    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;

    /**
     * User login
     */
    @PostMapping("/login")
    @Operation(summary = "User login")
    public ResponseEntity<AuthResponseDTO> login(@Valid @RequestBody LoginRequestDTO request) {
        // Authenticate user
        User user = userService.authenticateUser(request.getEmail(), request.getPassword());
        
        // Generate JWT token
        String token = jwtTokenProvider.generateToken(user.getEmail());
        
        // Build response
        AuthResponseDTO response = AuthResponseDTO.builder()
                .token(token)
                .tokenType("Bearer")
                .user(com.ridebooking.api.dto.UserDTO.builder()
                        .id(user.getId())
                        .name(user.getName())
                        .email(user.getEmail())
                        .phone(user.getPhone())
                        .build())
                .expiresIn(jwtTokenProvider.getTokenExpirationMs())
                .build();
        
        return ResponseEntity.ok(response);
    }

    /**
     * Verify token
     */
    @PostMapping("/verify")
    @Operation(summary = "Verify JWT token")
    public ResponseEntity<Boolean> verifyToken(@RequestHeader("Authorization") String bearerToken) {
        if (bearerToken == null || !bearerToken.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(false);
        }
        
        String token = bearerToken.substring(7);
        boolean isValid = jwtTokenProvider.validateToken(token);
        return ResponseEntity.ok(isValid);
    }
}
