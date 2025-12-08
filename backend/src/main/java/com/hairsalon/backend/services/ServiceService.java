package com.hairsalon.backend.services;

import com.hairsalon.backend.model.Service;
import com.hairsalon.backend.payload.ServiceDTO;
import com.hairsalon.backend.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.stream.Collectors;

@org.springframework.stereotype.Service
public class ServiceService {
    @Autowired
    private ServiceRepository serviceRepository;

    public List<ServiceDTO> getAllServices(Locale locale) {
        return serviceRepository.findAll().stream()
                .map(service -> ServiceDTO.fromEntity(service, locale))
                .collect(Collectors.toList());
    }

    public Optional<ServiceDTO> getServiceById(Long id, Locale locale) {
        return serviceRepository.findById(id)
                .map(service -> ServiceDTO.fromEntity(service, locale));
    }

    public Service createService(Service service) {
        // Sync default fields with English fields for backward compatibility
        if (service.getNameEn() == null && service.getName() != null) {
            service.setNameEn(service.getName());
        }
        if (service.getDescriptionEn() == null && service.getDescription() != null) {
            service.setDescriptionEn(service.getDescription());
        }
        // Set default name/description to English if not set
        if (service.getName() == null && service.getNameEn() != null) {
            service.setName(service.getNameEn());
        }
        if (service.getDescription() == null && service.getDescriptionEn() != null) {
            service.setDescription(service.getDescriptionEn());
        }
        return serviceRepository.save(service);
    }

    public Service updateService(Long id, Service serviceDetails) {
        Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found"));

        // Update all language fields
        if (serviceDetails.getNameEn() != null)
            service.setNameEn(serviceDetails.getNameEn());
        if (serviceDetails.getNameVi() != null)
            service.setNameVi(serviceDetails.getNameVi());
        if (serviceDetails.getNameKo() != null)
            service.setNameKo(serviceDetails.getNameKo());
        if (serviceDetails.getNameJa() != null)
            service.setNameJa(serviceDetails.getNameJa());

        if (serviceDetails.getDescriptionEn() != null)
            service.setDescriptionEn(serviceDetails.getDescriptionEn());
        if (serviceDetails.getDescriptionVi() != null)
            service.setDescriptionVi(serviceDetails.getDescriptionVi());
        if (serviceDetails.getDescriptionKo() != null)
            service.setDescriptionKo(serviceDetails.getDescriptionKo());
        if (serviceDetails.getDescriptionJa() != null)
            service.setDescriptionJa(serviceDetails.getDescriptionJa());

        // Update default fields (backward compatibility)
        if (serviceDetails.getName() != null) {
            service.setName(serviceDetails.getName());
            if (service.getNameEn() == null)
                service.setNameEn(serviceDetails.getName());
        }
        if (serviceDetails.getDescription() != null) {
            service.setDescription(serviceDetails.getDescription());
            if (service.getDescriptionEn() == null)
                service.setDescriptionEn(serviceDetails.getDescription());
        }

        if (serviceDetails.getPrice() != null)
            service.setPrice(serviceDetails.getPrice());
        if (serviceDetails.getDurationMinutes() != null)
            service.setDurationMinutes(serviceDetails.getDurationMinutes());
        if (serviceDetails.getImageUrl() != null)
            service.setImageUrl(serviceDetails.getImageUrl());

        return serviceRepository.save(service);
    }

    public void deleteService(Long id) {
        serviceRepository.deleteById(id);
    }
}
