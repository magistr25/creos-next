import React from 'react';
import Link from 'next/link';
import styles from './Header.module.css';
import Image from 'next/image';

const Header: React.FC = () => {
    const currentWeekNumber = 31;

    return (
        <header className={styles.header}>
            <Link href="/" legacyBehavior>
                <a className={styles.logo}>
                    <Image
                        src='https://static.tildacdn.com/tild3130-3965-4433-b632-323131643662/logo-Creos-Play-tran.png'
                        alt='logo'
                        width={50}
                        height={50}
                        className={styles.img}
                    />
                </a>
            </Link>
            <h1 className={styles.title}>Creos CRM</h1>
            <div className={styles.right_block}>
                <p className={styles.weekNumber}>Current Week Number: {currentWeekNumber}</p>
                <div className={styles.buttons}>
                    <button className={styles.button}>RU</button>
                    <button className={styles.button}>Dark</button>
                </div>
            </div>
        </header>
    );
};

export default Header;
