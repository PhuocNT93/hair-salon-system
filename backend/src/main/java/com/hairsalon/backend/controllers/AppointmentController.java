package com.hairsalon.backend.controllers;

import com.hairsalon.backend.model.Appointment;
import com.hairsalon.backend.model.AppointmentStatus;
import com.hairsalon.backend.services.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('STAFF')")
    public List<Appointment> getAllAppointments() {
        return appointmentService.getAllAppointments();
    }

    @GetMapping("/my-history")
    @PreAuthorize("hasAuthority('CUSTOMER')")
    public List<Appointment> getMyAppointments(@RequestParam Long userId) {
        // In real app, get userId from SecurityContext
        return appointmentService.getAppointmentsByCustomer(userId);
    }

    @PostMapping
    @PreAuthorize("hasAuthority('CUSTOMER')")
    public Appointment bookAppointment(@RequestParam Long customerId, 
                                       @RequestParam Long serviceId,
                                       @RequestParam(required = false) Long staffId,
                                       @RequestBody Appointment appointment) {
        return appointmentService.createAppointment(customerId, serviceId, staffId, appointment);
    }
    
    @PutMapping("/{id}/status")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('STAFF')")
    public ResponseEntity<Appointment> updateStatus(@PathVariable Long id, @RequestParam AppointmentStatus status) {
        return ResponseEntity.ok(appointmentService.updateStatus(id, status));
    }
}
