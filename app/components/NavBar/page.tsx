"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './NavBar.module.css';
import { useTranslation } from 'react-i18next';

const NavBar: React.FC = () => {
    const pathname = usePathname();
    const { t } = useTranslation();

    return (
        <nav className={styles.nav}>
            <ul className={styles.navList}>
                <li className={styles.navItem}>
                    <Link href="/" passHref>
                        <span className={`${styles.navLink} ${pathname === '/' ? styles.active : ''}`}>
                            {t('Main')}
                        </span>
                    </Link>
                </li>
                <li className={styles.navItem}>
                    <Link href="/tasks" passHref>
                        <span className={`${styles.navLink} ${pathname === '/tasks' ? styles.active : ''}`}>
                            {t('Tasks')}
                        </span>
                    </Link>
                </li>
                <li className={styles.navItem}>
                    <Link href="/designers" passHref>
                        <span className={`${styles.navLink} ${pathname === '/designers' ? styles.active : ''}`}>
                            {t('Designers')}
                        </span>
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default NavBar;
