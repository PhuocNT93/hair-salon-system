package com.hairsalon.backend.controllers;

import com.hairsalon.backend.model.Payment;
import com.hairsalon.backend.model.Payment.PaymentStatus;
import com.hairsalon.backend.services.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/payments")
public class PaymentController {
    @Autowired
    private PaymentService paymentService;

    @PostMapping
    @PreAuthorize("hasAuthority('CUSTOMER') or hasAuthority('ADMIN')")
    public Payment createPayment(@RequestParam Long appointmentId, @RequestBody Payment payment) {
        return paymentService.createPayment(appointmentId, payment);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAuthority('ADMIN')")
    public Payment updatePaymentStatus(@PathVariable Long id,
            @RequestParam PaymentStatus status,
            @RequestParam(required = false) String transactionId) {
        return paymentService.updatePaymentStatus(id, status, transactionId);
    }

    @GetMapping("/my-history")
    @PreAuthorize("hasAuthority('CUSTOMER')")
    public List<Payment> getMyPayments(@RequestParam Long userId) {
        return paymentService.getPaymentsByCustomer(userId);
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<Payment> getAllPayments() {
        return paymentService.getAllPayments();
    }
}
