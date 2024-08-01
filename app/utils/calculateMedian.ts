// Функция для расчета медианы
export const calculateMedian = (times: number[]): number => {
    if (times.length === 0) return 0;
    const sorted = times.sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0 ? (sorted[middle - 1] + sorted[middle]) / 2 : sorted[middle];
};
