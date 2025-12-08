package com.hairsalon.backend.payload;

import com.hairsalon.backend.model.Service;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Locale;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ServiceDTO {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer durationMinutes;
    private String imageUrl;

    // Multi-language fields for admin/create/update operations
    private String nameEn;
    private String nameVi;
    private String nameKo;
    private String nameJa;
    private String descriptionEn;
    private String descriptionVi;
    private String descriptionKo;
    private String descriptionJa;

    public static ServiceDTO fromEntity(Service service, Locale locale) {
        String localizedName = getLocalizedField(
                locale,
                service.getNameEn() != null ? service.getNameEn() : service.getName(),
                service.getNameVi(),
                service.getNameKo(),
                service.getNameJa());

        String localizedDescription = getLocalizedField(
                locale,
                service.getDescriptionEn() != null ? service.getDescriptionEn() : service.getDescription(),
                service.getDescriptionVi(),
                service.getDescriptionKo(),
                service.getDescriptionJa());

        return ServiceDTO.builder()
                .id(service.getId())
                .name(localizedName)
                .description(localizedDescription)
                .price(service.getPrice())
                .durationMinutes(service.getDurationMinutes())
                .imageUrl(service.getImageUrl())
                .nameEn(service.getNameEn())
                .nameVi(service.getNameVi())
                .nameKo(service.getNameKo())
                .nameJa(service.getNameJa())
                .descriptionEn(service.getDescriptionEn())
                .descriptionVi(service.getDescriptionVi())
                .descriptionKo(service.getDescriptionKo())
                .descriptionJa(service.getDescriptionJa())
                .build();
    }

    private static String getLocalizedField(Locale locale, String en, String vi, String ko, String ja) {
        if (locale == null) {
            return en != null ? en : "";
        }

        String language = locale.getLanguage();
        switch (language) {
            case "vi":
                return vi != null ? vi : (en != null ? en : "");
            case "ko":
                return ko != null ? ko : (en != null ? en : "");
            case "ja":
                return ja != null ? ja : (en != null ? en : "");
            case "en":
            default:
                return en != null ? en : "";
        }
    }
}
