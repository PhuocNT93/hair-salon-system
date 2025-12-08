package com.hairsalon.backend;

import com.hairsalon.backend.model.Role;
import com.hairsalon.backend.model.User;
import com.hairsalon.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private com.hairsalon.backend.repository.ServiceRepository serviceRepository;

    @Override
    public void run(String... args) throws Exception {
        createDefaultAdmin();
        createDefaultServices();
    }

    private void createDefaultAdmin() {
        Optional<User> adminUser = userRepository.findByUsername("admin");
        if (adminUser.isEmpty()) {
            User admin = User.builder()
                    .username("admin")
                    .email("admin@hairsalon.com")
                    .passwordHash(passwordEncoder.encode("12345tp"))
                    .fullName("System Administrator")
                    .role(Role.ADMIN)
                    .build();
            userRepository.save(admin);
            System.out.println("Default admin user created: admin / 12345tp");
        } else {
            System.out.println("Admin user already exists.");
        }
    }

    private void createDefaultServices() {
        if (serviceRepository.count() == 0) {
            com.hairsalon.backend.model.Service s1 = com.hairsalon.backend.model.Service.builder()
                    .name("Men's Haircut")
                    .description("Standard haircut for men including wash and style.")
                    .price(new java.math.BigDecimal("15.00"))
                    .durationMinutes(30)
                    .build();

            com.hairsalon.backend.model.Service s2 = com.hairsalon.backend.model.Service.builder()
                    .name("Women's Haircut")
                    .description("Standard haircut for women including wash and blow dry.")
                    .price(new java.math.BigDecimal("25.00"))
                    .durationMinutes(60)
                    .build();

            com.hairsalon.backend.model.Service s3 = com.hairsalon.backend.model.Service.builder()
                    .name("Hair Coloring")
                    .description("Full head hair coloring.")
                    .price(new java.math.BigDecimal("50.00"))
                    .durationMinutes(120)
                    .build();

            serviceRepository.saveAll(java.util.List.of(s1, s2, s3));
            System.out.println("Default services created.");
        }
    }
}
