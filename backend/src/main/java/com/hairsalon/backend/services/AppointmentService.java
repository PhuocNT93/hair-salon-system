package com.hairsalon.backend.services;

import com.hairsalon.backend.model.Appointment;
import com.hairsalon.backend.model.AppointmentStatus;
import com.hairsalon.backend.model.Service;
import com.hairsalon.backend.model.User;
import com.hairsalon.backend.repository.AppointmentRepository;
import com.hairsalon.backend.repository.ServiceRepository;
import com.hairsalon.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@org.springframework.stereotype.Service
public class AppointmentService {
    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public List<Appointment> getAppointmentsByCustomer(Long customerId) {
        return appointmentRepository.findByCustomerId(customerId);
    }
    
    public List<Appointment> getAppointmentsByStaff(Long staffId) {
        return appointmentRepository.findByStaffId(staffId);
    }

    public Appointment createAppointment(Long customerId, Long serviceId, Long staffId, Appointment appointmentDetails) {
        User customer = userRepository.findById(customerId).orElseThrow(() -> new RuntimeException("Customer not found"));
        Service service = serviceRepository.findById(serviceId).orElseThrow(() -> new RuntimeException("Service not found"));
        User staff = null;
        if(staffId != null) {
            staff = userRepository.findById(staffId).orElseThrow(() -> new RuntimeException("Staff not found"));
        }

        appointmentDetails.setCustomer(customer);
        appointmentDetails.setService(service);
        appointmentDetails.setStaff(staff);
        appointmentDetails.setStatus(AppointmentStatus.PENDING);
        
        return appointmentRepository.save(appointmentDetails);
    }
    
     public Appointment updateStatus(Long id, AppointmentStatus status) {
        Appointment appointment = appointmentRepository.findById(id).orElseThrow(() -> new RuntimeException("Appointment not found"));
        appointment.setStatus(status);
        return appointmentRepository.save(appointment);
    }
}
