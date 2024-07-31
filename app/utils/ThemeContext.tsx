"use client";
import React, { createContext, useState, useEffect, useContext } from 'react';
import { getWeek, subHours } from 'date-fns';
import '../../i18n';
import { useTranslation } from "react-i18next";

interface ThemeContextType {
    theme: string;
    toggleTheme: () => void;
    locale: string;
    toggleLocale: () => void;
    weekNumber: number;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { t, i18n } = useTranslation();
    const [theme, setTheme] = useState<string>('');
    const [locale, setLocale] = useState<string>('en');
    const [weekNumber, setWeekNumber] = useState<number>(0);

    useEffect(() => {
        // Проверяем, есть ли тема и локаль в localStorage при инициализации
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) {
            setTheme(storedTheme);
        }
        const storedLocale = localStorage.getItem('locale');
        if (storedLocale) {
            setLocale(storedLocale);
            i18n.changeLanguage(storedLocale);
        }
    }, [i18n]);

    useEffect(() => {
        // Применяем тему к body и сохраняем в localStorage
        document.body.className = theme;
        localStorage.setItem('theme', theme);
    }, [theme]);

    useEffect(() => {
        // Сохраняем локаль в localStorage
        localStorage.setItem('locale', locale);
    }, [locale]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    const toggleLocale = () => {
        setLocale((prevLocale) => {
            const newLocale = prevLocale === 'en' ? 'ru' : 'en';
            i18n.changeLanguage(newLocale);
            return newLocale;
        });
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, locale, toggleLocale, weekNumber }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
