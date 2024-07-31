"use client";

import './globals.css';

import { Inter } from 'next/font/google';
import Header from './components/Header/page';
import NavBar from './components/NavBar/page';
import { ThemeProvider } from './utils/ThemeContext';

const inter = Inter({ subsets: ['latin'] });



export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <ThemeProvider>
            <Header />
            <NavBar />
            {children}
        </ThemeProvider>
        </body>
        </html>
    );
}
