"use client";
import React, { useEffect, useState } from 'react';
import ClosedTasksChart from '../components/ClosedTasksChart/page';
import { Task, getAllDesigners } from "../actions/apiDesigner";
import { useTranslation } from "react-i18next";
import styles from './TasksPage.module.css';

const TasksPage: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { t } = useTranslation();

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const data = await getAllDesigners();
                setTasks(data);
                setLoading(false);
            } catch (err) {
                setError('Ошибка при загрузке данных');
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (loading) {
        return <h3 className="loading">{t('Loading...')}</h3>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className={styles.content}>
            <div className={styles.container}>
                <div>
                    <h1  className={styles.h1}>{t('Company statistics')}</h1>
                    <ClosedTasksChart tasks={tasks} />
                </div>
            </div>
        </div>
    );
};

export default TasksPage;
