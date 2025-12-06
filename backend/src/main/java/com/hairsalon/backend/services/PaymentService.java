package com.hairsalon.backend.services;

import com.hairsalon.backend.model.Appointment;
import com.hairsalon.backend.model.Payment;
import com.hairsalon.backend.model.Payment.PaymentStatus;
import com.hairsalon.backend.repository.AppointmentRepository;
import com.hairsalon.backend.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentService {
    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    public Payment createPayment(Long appointmentId, Payment paymentDetails) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        
        paymentDetails.setAppointment(appointment);
        paymentDetails.setStatus(PaymentStatus.PENDING);
        
        return paymentRepository.save(paymentDetails);
    }

    public Payment updatePaymentStatus(Long paymentId, PaymentStatus status, String transactionId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        
        payment.setStatus(status);
        if (transactionId != null) {
            payment.setTransactionId(transactionId);
        }
        return paymentRepository.save(payment);
    }
    
    public List<Payment> getPaymentsByCustomer(Long customerId) {
        return paymentRepository.findByAppointmentCustomerId(customerId);
    }

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }
}
