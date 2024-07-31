"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './NavBar.module.css';

const NavBar: React.FC = () => {
    const pathname = usePathname();

    return (
        <nav className={styles.nav}>
            <ul className={styles.navList}>
                <li className={styles.navItem}>
                    <Link href="/" passHref>
                        <span className={`${styles.navLink} ${pathname === '/' ? styles.active : ''}`}>
                            Главная
                        </span>
                    </Link>
                </li>
                <li className={styles.navItem}>
                    <Link href="/tasks" passHref>
                        <span className={`${styles.navLink} ${pathname === '/tasks' ? styles.active : ''}`}>
                            Задачи
                        </span>
                    </Link>
                </li>
                <li className={styles.navItem}>
                    <Link href="/designers" passHref>
                        <span className={`${styles.navLink} ${pathname === '/designers' ? styles.active : ''}`}>
                            Дизайнеры
                        </span>
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default NavBar;
