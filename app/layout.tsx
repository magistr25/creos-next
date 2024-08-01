"use client";

import './globals.css';
import { Inter } from 'next/font/google';
import Header from './components/Header/page';
import NavBar from './components/NavBar/page';
import { ThemeProvider } from './utils/ThemeContext';
import React from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "./utils/i18n";
import {Provider} from "react-redux";
import store from "@/app/store/store.ts"; // путь к вашему файлу конфигурации i18n

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <ThemeProvider>
            <I18nextProvider i18n={i18n}>
                <Provider store={store}>
                <Header />
                <NavBar />
                {children}
                </Provider>
            </I18nextProvider>
        </ThemeProvider>
        </body>
        </html>
    );
}
