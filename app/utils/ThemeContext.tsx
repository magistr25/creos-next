import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
    const [isLoaded, setIsLoaded] = useState(false);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    const setLocale = (locale: string) => {
        setLocaleState(locale);
        localStorage.setItem('locale', locale);
    };

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        const savedLocale = localStorage.getItem('locale') || 'en';
        setTheme(savedTheme);
        setLocaleState(savedLocale);
        setIsLoaded(true);
    }, []);

    if (!isLoaded) {
        return <div className="spinner"></div>; // Спиннер вместо "Loading..."
    }

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
