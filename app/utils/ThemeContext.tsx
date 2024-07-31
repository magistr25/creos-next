import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface ThemeContextProps {
    theme: string;
    toggleTheme: () => void;
    locale: string;
    setLocale: (locale: string) => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setTheme] = useState('light');
    const [locale, setLocaleState] = useState('en');

    useEffect(() => {
        const storedTheme = localStorage.getItem('theme');
        const storedLocale = localStorage.getItem('locale');
        if (storedTheme) setTheme(storedTheme);
        if (storedLocale) setLocaleState(storedLocale);
    }, []);

    const toggleTheme = () => {
        setTheme((prevTheme) => {
            const newTheme = prevTheme === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme', newTheme);
            return newTheme;
        });
    };

    const setLocale = (locale: string) => {
        setLocaleState(locale);
        localStorage.setItem('locale', locale);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, locale, setLocale }}>
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
