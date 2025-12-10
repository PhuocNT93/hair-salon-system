'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { IntlProvider } from 'next-intl';
import { defaultLocale, type Locale } from '@/lib/i18n';

const LocaleContext = createContext<{
    locale: Locale;
    setLocale: (locale: Locale) => void;
}>({
    locale: defaultLocale,
    setLocale: () => { },
});

export function TranslationProvider({ children }: { children: ReactNode }) {
    const [locale, setLocale] = useState<Locale>(defaultLocale);
    const [messages, setMessages] = useState<any>({});

    useEffect(() => {
        // Load messages for current locale
        import(`@/messages/${locale}.json`)
            .then((module) => setMessages(module.default))
            .catch((error) => console.error('Failed to load messages:', error));
    }, [locale]);

    return (
        <LocaleContext.Provider value={{ locale, setLocale }}>
            <IntlProvider locale={locale} messages={messages}>
                {children}
            </IntlProvider>
        </LocaleContext.Provider>
    );
}

export function useLocale() {
    return useContext(LocaleContext);
}
