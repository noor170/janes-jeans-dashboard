package com.janesjeans.api.controller;

import com.janesjeans.api.dto.UserDTO;
import com.janesjeans.api.entity.Role;
import com.janesjeans.api.entity.User;
import com.janesjeans.api.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@Tag(name = "Admin – Users", description = "User management (ADMIN / SUPER_ADMIN only)")
@SecurityRequirement(name = "bearerAuth")
public class AdminController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Operation(summary = "List all users")
    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = userRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @Operation(summary = "Get user by ID")
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable String id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(mapToDTO(user));
    }

    @Operation(summary = "Update user details")
    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(@PathVariable String id, @RequestBody Map<String, Object> updates) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        if (updates.containsKey("firstName")) user.setFirstName((String) updates.get("firstName"));
        if (updates.containsKey("lastName")) user.setLastName((String) updates.get("lastName"));
        if (updates.containsKey("email")) user.setEmail((String) updates.get("email"));
        return ResponseEntity.ok(mapToDTO(userRepository.save(user)));
    }

    @Operation(summary = "Update user role")
    @PatchMapping("/{id}/role")
    public ResponseEntity<UserDTO> updateUserRole(@PathVariable String id, @RequestBody Map<String, String> body) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setRole(Role.valueOf(body.get("role")));
        return ResponseEntity.ok(mapToDTO(userRepository.save(user)));
    }

    @Operation(summary = "Activate a user")
    @PatchMapping("/{id}/activate")
    public ResponseEntity<Void> activateUser(@PathVariable String id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setIsActive(true);
        userRepository.save(user);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Deactivate a user")
    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<Void> deactivateUser(@PathVariable String id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setIsActive(false);
        userRepository.save(user);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Delete a user")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Reset user password")
    @PostMapping("/{id}/reset-password")
    public ResponseEntity<Void> resetPassword(@PathVariable String id, @RequestBody Map<String, String> body) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setPassword(passwordEncoder.encode(body.get("newPassword")));
        userRepository.save(user);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Create a new admin user")
    @PostMapping("/create-admin")
    public ResponseEntity<UserDTO> createAdmin(@RequestBody Map<String, String> body) {
        if (userRepository.existsByEmail(body.get("email"))) {
            throw new RuntimeException("Email already exists");
        }
        User user = User.builder()
                .email(body.get("email"))
                .password(passwordEncoder.encode(body.get("password")))
                .firstName(body.get("firstName"))
                .lastName(body.get("lastName"))
                .role(Role.ADMIN)
                .isActive(true)
                .build();
        return ResponseEntity.ok(mapToDTO(userRepository.save(user)));
    }

    private UserDTO mapToDTO(User user) {
        return UserDTO.builder()
                .id(user.getId()).email(user.getEmail())
                .firstName(user.getFirstName()).lastName(user.getLastName())
                .role(user.getRole()).isActive(user.getIsActive())
                .createdAt(user.getCreatedAt()).updatedAt(user.getUpdatedAt())
                .build();
    }
}
