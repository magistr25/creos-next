"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Header.module.css';
import { useTheme } from '../../utils/ThemeContext';
import { useTranslation } from 'react-i18next';

const Header: React.FC = () => {
    const currentWeekNumber = 31;
    const { theme, toggleTheme, locale, setLocale } = useTheme();
    const { t, i18n } = useTranslation();

    useEffect(() => {
        i18n.changeLanguage(locale);
    }, [locale, i18n]);

    useEffect(() => {
        document.body.className = theme;
    }, [theme]);

    const handleLocaleToggle = () => {
        const newLocale = i18n.language === 'en' ? 'ru' : 'en';
        setLocale(newLocale);
    };

    const handleThemeToggle = () => {
        toggleTheme();
    };

    return (
        <header className={styles.header}>
            <div className={styles.logo}>
                <Link href="/" legacyBehavior>
                    <a className={styles.logo}>
                        <Image
                            src='/logo.png'
                            alt='logo'
                            width={80}
                            height={80}
                            className={styles.img}
                            priority
                        />
                    </a>
                </Link>
                <h1 className={styles.title}>Creos CRM</h1>
            </div>
            <div className={styles.right_block}>
                <p className={styles.weekNumber}>{t('currentWeek')}: {currentWeekNumber}</p>
                <div className={styles.buttons}>
                    <button className={styles.button} onClick={handleLocaleToggle}>
                        {i18n.language === 'en' ? 'RU' : 'EN'}
                    </button>
                    <button className={styles.button2} onClick={handleThemeToggle}>
                        {theme === 'light' ? t('dark') : t('light')}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
