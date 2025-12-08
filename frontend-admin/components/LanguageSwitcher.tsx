"use client";

import React, { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';

const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
];

export default function LanguageSwitcher() {
    const [currentLocale, setCurrentLocale] = useState('en');
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Get saved locale from localStorage or default to 'en'
        const savedLocale = localStorage.getItem('locale') || 'en';
        setCurrentLocale(savedLocale);
    }, []);

    const handleLanguageChange = (locale: string) => {
        setCurrentLocale(locale);
        localStorage.setItem('locale', locale);
        setIsOpen(false);
        // Reload the page to apply new language
        window.location.reload();
    };

    const currentLanguage = languages.find(lang => lang.code === currentLocale);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
            >
                <Globe className="h-4 w-4" />
                <span>{currentLanguage?.flag} {currentLanguage?.name}</span>
            </button>

            {isOpen && (
                <>
                    {/* Backdrop to close dropdown when clicking outside */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => handleLanguageChange(lang.code)}
                                className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 first:rounded-t-md last:rounded-b-md ${currentLocale === lang.code ? 'bg-gray-50 font-medium' : ''
                                    }`}
                            >
                                <span>{lang.flag}</span>
                                <span>{lang.name}</span>
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
