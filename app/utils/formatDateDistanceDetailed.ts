// Функция для форматирования времени
import {t} from "i18next";
export const formatDateDistanceDetailed = (createdAt: string) => {
    const now = new Date();
    const createdDate = new Date(createdAt);
    const diff = Math.abs(now.getTime() - createdDate.getTime());
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const formatted = [];
    const getCorrectForm = (number: number, forms: [string, string, string]): string => {
        const n = Math.abs(number) % 100;
        const n1 = n % 10;
        if (n > 10 && n < 20) {
            return forms[2];
        }
        if (n1 > 1 && n1 < 5) {
            return forms[1];
        }
        if (n1 === 1) {
            return forms[0];
        }
        return forms[2];
    };

    if (minutes % 60 > 0) {
        formatted.push(`${minutes % 60} ${getCorrectForm(minutes % 60, [t('minute'), t('minutes'), t('minutes ')])}`);
    }
    if (hours % 24 > 0) {
        formatted.push(`${hours % 24} ${getCorrectForm(hours % 24, [t('hour'), t('hours'), t('hours ')])}`);
    }
    if (days > 0) {
        formatted.push(`${days} ${getCorrectForm(days, [t('day'), t('days'), t('days ')])}`);
    }
    if (formatted.length === 0) {
        return t('just now');
    } else {
        return formatted.join(' ') +  t(' ago');
    }
};
