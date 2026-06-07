package com.ridebooking.api.controller;

import com.ridebooking.api.dto.UserDTO;
import com.ridebooking.api.dto.UserCreateDTO;
import com.ridebooking.api.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Tag(name = "User Management", description = "APIs for managing users")
public class UserController {
    
    private final UserService userService;
    
    /**
     * Register a new user
     */
    @PostMapping
    @Operation(summary = "Register a new user")
    public ResponseEntity<UserDTO> registerUser(@Valid @RequestBody UserCreateDTO request) {
        UserDTO user = userService.registerUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }
    
    /**
     * Get user by ID
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get user details")
    public ResponseEntity<UserDTO> getUser(@PathVariable Long id) {
        UserDTO user = userService.getUser(id);
        return ResponseEntity.ok(user);
    }
    
    /**
     * Get all users
     */
    @GetMapping
    @Operation(summary = "List all users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }
}
