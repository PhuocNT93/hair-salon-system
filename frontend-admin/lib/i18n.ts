// Locale configuration for the application
export const locales = ['en', 'vi', 'ko', 'ja'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

// Get current locale from localStorage or return default
export function getLocale(): Locale {
    if (typeof window === 'undefined') return defaultLocale;

    const savedLocale = localStorage.getItem('locale');
    if (savedLocale && locales.includes(savedLocale as Locale)) {
        return savedLocale as Locale;
    }

    return defaultLocale;
}

// Load messages for a specific locale
export async function getMessages(locale: Locale) {
    try {
        const messages = await import(`../messages/${locale}.json`);
        return messages.default;
    } catch (error) {
        console.error(`Failed to load messages for locale: ${locale}`, error);
        // Fallback to English
        const fallback = await import(`../messages/en.json`);
        return fallback.default;
    }
}
