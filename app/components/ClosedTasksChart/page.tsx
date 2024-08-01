"use client";
import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { processData, getMonthData } from '../../utils/dataProcessing';
import { useTranslation } from "react-i18next";
import styles from './ClosedTasksChart.module.css';

// регистрация плагинов Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels, ArcElement);

type Task = {
    date_created: string;
    date_finished: string | null;
    received_from_client: number;
    send_to_account_manager: number;
    send_to_designer: number;
    send_to_project_manager: number;
    status: string;
};

const ClosedTasksChart: React.FC<{ tasks: Task[] }> = ({ tasks }) => {
    const data = processData(tasks);
    const { t } = useTranslation();

    const currentMonthData = getMonthData(data, 0); // текущий месяц
    const lastMonthData = getMonthData(data, 1); // прошлый месяц
    const previousMonthData = getMonthData(data, 2); // позапрошлый месяц

    const barOptions = {
        scales: {
            x: {
                beginAtZero: true,
            },
            y: {
                beginAtZero: true,
            },
        },
    };

    const [statusData, setStatusData] = useState<{ [key: string]: number }>({});
    const [numCharts, setNumCharts] = useState<string>('2'); // Use string type for numCharts state

    useEffect(() => {
        const statusCounts: { [key: string]: number } = {};
        tasks.forEach(task => {
            const status = task.status;
            if (!statusCounts[status]) {
                statusCounts[status] = 0;
            }
            statusCounts[status] += 1;
        });
        setStatusData(statusCounts);
    }, [tasks]);

    const pieData = {
        labels: Object.keys(statusData),
        datasets: [
            {
                data: Object.values(statusData),
                backgroundColor: ['rgba(116, 123, 255, 1)', 'rgb(255, 184, 0)', 'rgb(0, 211, 243)'],
                borderColor: ['rgba(66, 133, 244, 1)', 'rgba(246, 178, 107, 1)', 'rgba(106, 168, 79, 1)'],
                borderWidth: 1,
            },
        ],
    };

    const pieOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            datalabels: {
                formatter: (value: number, context: any) => {
                    const total = context.dataset.data.reduce((acc: number, val: number) => acc + val, 0);
                    const percentage = ((value / total) * 100).toFixed(2) + '%';
                    return percentage;
                },
                color: '#fff',
            },
            title: {
                display: true,

            },
        },
    };

    return (
        <div className={styles.card}>
            <div className={styles.diagramma}>
                <div>
                    <h3 className={styles.header} style={{ textAlign: 'center' }}>{t('Task status ratio in percentages')}</h3>
                    <Pie data={pieData} options={pieOptions} />
                </div>
            </div>
            <div className={styles.chartsWrapper}>
                <div className={styles.finans}>
                    <h2 className={styles.header} style={{ paddingLeft: '100px' }}>{t('Financial performance')}</h2>
                    <div style={{ width: '100%' }}>
                        <div className={styles.selectContainer}>
                            <label className={styles.label} htmlFor="numCharts">{t('Choose the number of weeks:')}</label>
                            <select id="numCharts" className={styles.select} value={numCharts}
                                    onChange={(e) => setNumCharts(e.target.value)}>
                                <option value="1">{t('4 weeks')}</option>
                                <option value="2">{t('8 weeks')}</option>
                                <option value="3">{t('12 weeks')}</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className={styles.chartContainer}>
                    {Number(numCharts) >= 1 && (
                        <div className={styles.chart}>
                            <h3 className={styles.header}>{t('Finances, current month')}</h3>
                            <Bar data={{ labels: currentMonthData.labels, datasets: currentMonthData.datasets }}
                                 options={barOptions} />
                        </div>
                    )}
                    {Number(numCharts) >= 2 && (
                        <div className={styles.chart}>
                            <h3 className={styles.header}>{t('Finances, last month')}</h3>
                            <Bar data={{ labels: lastMonthData.labels, datasets: lastMonthData.datasets }} options={barOptions} />
                        </div>
                    )}
                    {Number(numCharts) >= 3 && (
                        <div className={styles.chart}>
                            <h3 className={styles.header}>{t('Finances, month before last')}</h3>
                            <Bar data={{ labels: previousMonthData.labels, datasets: previousMonthData.datasets }} options={barOptions} />
                        </div>
                    )}
                    {Number(numCharts) < 3 && <div className={styles.chartPlaceholder}></div>}
                    {Number(numCharts) < 2 && <div className={styles.chartPlaceholder}></div>}
                </div>
            </div>
        </div>
    );
};

export default ClosedTasksChart;
