package com.hairsalon.backend.controllers;

import com.hairsalon.backend.model.Role;
import com.hairsalon.backend.model.User;
import com.hairsalon.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    UserRepository userRepository;
    
    @Autowired
    PasswordEncoder encoder;

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN') or #id == authentication.principal.id")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN') or #id == authentication.principal.id")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        return userRepository.findById(id).map(user -> {
            user.setFullName(userDetails.getFullName());
            user.setPhone(userDetails.getPhone());
            user.setAddress(userDetails.getAddress());
            user.setAvatarUrl(userDetails.getAvatarUrl());
            user.setQrCodeUrl(userDetails.getQrCodeUrl());
            user.setBankName(userDetails.getBankName());
            user.setBankAccountNumber(userDetails.getBankAccountNumber());
            return ResponseEntity.ok(userRepository.save(user));
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    @PostMapping("/staff")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> createStaff(@RequestBody User staffUser) {
        if (userRepository.existsByUsername(staffUser.getUsername())) {
             return ResponseEntity.badRequest().body("Username taken");
        }
        
        staffUser.setPasswordHash(encoder.encode(staffUser.getPasswordHash())); // Assume raw password sent
        staffUser.setRole(Role.STAFF);
        
        userRepository.save(staffUser);
        return ResponseEntity.ok("Staff created successfully");
    }
}
