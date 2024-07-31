"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Header.module.css';
import { useTheme } from '../../utils/ThemeContext';

const Header: React.FC = () => {
    const currentWeekNumber = 31;
    const { theme, toggleTheme } = useTheme();

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
                <p className={styles.weekNumber}>Current week: {currentWeekNumber}</p>
                <div className={styles.buttons}>
                    <button className={styles.button}>RU</button>
                    <button className={styles.button} onClick={toggleTheme}>
                        {theme === 'light' ? 'Dark' : 'Light'}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
