package com.hairsalon.backend.repository;

import com.hairsalon.backend.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByCustomerId(Long customerId);
    List<Appointment> findByStaffId(Long staffId);
    List<Appointment> findByBookingTimeBetween(LocalDateTime start, LocalDateTime end);
}
