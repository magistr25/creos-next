"use client";

import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { parseISO, formatDistance } from 'date-fns';
import { RootState } from '../store/store';
import { setLoading } from '../store/loadingSlice';
import { fetchComments } from '../actions/apiComments';
import { getAllDesigners, Task } from '../actions/apiDesigner';
import { calculateMedian } from '../utils/calculateMedian';
import { formatDateDistanceDetailed } from '../utils/formatDateDistanceDetailed';
import styles from './page.module.css';

// Типы для данных
type Comment = {
    id: string;
    designer: {
        avatar: string;
        username: string;
    };
    date_created: string;
    issue: string;
    message: string;
};

interface Designer {
    avatar: string;
    username: string;
    totalTasks: number;
    medianTime: number;
    score?: number;
}

function normalize(value: number, min: number, max: number): number {
    return (value - min) / (max - min);
}


// calculateTopDesigners: Пояснение
// Нормализация значений:
//
// Функция normalize нормализует значения в диапазон от 0 до 1.
// Медиана времени нормализуется так, чтобы меньшие значения были лучше.
// Количество задач нормализуется так, чтобы большие значения были лучше.
// Взвешенная оценка:
//
// Итоговая оценка для каждого дизайнера рассчитывается как взвешенное среднее нормализованных значений медианы времени и количества задач.
// Веса для медианы времени и количества задач установлены равными (0.5), но их можно изменить в зависимости от важности каждого показателя.
// Сортировка дизайнеров:
//
// Дизайнеры сортируются по итоговой оценке в порядке убывания.
// Рендеринг компонента:
//
// Компонент рендерит список топ-10 дизайнеров и комментарии пользователей.
function calculateTopDesigners(designers: Designer[]): Designer[] {
    const minMedianTime = Math.min(...designers.map(d => d.medianTime));
    const maxMedianTime = Math.max(...designers.map(d => d.medianTime));
    const minTotalTasks = Math.min(...designers.map(d => d.totalTasks));
    const maxTotalTasks = Math.max(...designers.map(d => d.totalTasks));

    return designers
        .map(designer => {
            const normalizedMedianTime = 1 - normalize(designer.medianTime, minMedianTime, maxMedianTime);
            const normalizedTotalTasks = normalize(designer.totalTasks, minTotalTasks, maxTotalTasks);

            // Взвешенная оценка (0.5 для медианы и 0.5 для задач)
            const score = 0.5 * normalizedMedianTime + 0.5 * normalizedTotalTasks;

            return { ...designer, score };
        })
        .sort((a, b) => b.score - a.score); // Сортировка по оценке в порядке убывания
}

export default function Home() {
    const isLoading = useSelector((state: RootState) => state.loading.isLoading);
    const dispatch = useDispatch();
    const [comments, setComments] = useState<Comment[]>([]);
    const [designers, setDesigners] = useState<Designer[]>([]);
    const { t } = useTranslation();

    useEffect(() => {
        const fetchData = async () => {
            dispatch(setLoading(true));
            try {
                const [fetchedComments, fetchedDesigners] = await Promise.all([
                    fetchComments(),
                    getAllDesigners(),
                ]);

                const designerData: { [key: string]: { avatar: string; username: string; times: number[]; totalTasks: number } } = {};
                fetchedDesigners.forEach((task: Task) => {
                    if (task.status === 'Done' && task.date_finished_by_designer && task.date_started_by_designer && task.designer) {
                        const timeTaken = (parseISO(task.date_finished_by_designer).getTime() - parseISO(task.date_started_by_designer).getTime()) / 1000;
                        if (!designerData[task.designer]) {
                            designerData[task.designer] = {
                                avatar: `https://sandbox.creos.me/media/images/avatars/${task.designer}.jpg`,
                                username: task.designer,
                                times: [],
                                totalTasks: 0,
                            };
                        }
                        designerData[task.designer].times.push(timeTaken);
                        designerData[task.designer].totalTasks += 1;
                    }
                });

                const designersArray = Object.values(designerData).map(designer => ({
                    ...designer,
                    medianTime: calculateMedian(designer.times),
                }));

                const topDesigners = calculateTopDesigners(designersArray);

                setComments(fetchedComments);
                setDesigners(topDesigners.slice(0, 10));
            } catch (error) {
                console.error('Error:', error);
            } finally {
                dispatch(setLoading(false));
            }
        };
        fetchData();
        window.scrollTo(0, 0);

        document.body.classList.add(styles.lightTheme);
    }, [dispatch]);

    function getFormatedTimes(s: string) {
        switch (s) {
            case "about 2 hours":
                return t('about 2 hours');
            case "about 3 hours":
                return t('about 3 hours');
            case "about 4 hours":
                return t('about 4 hours');
            case "about 5 hours":
                return t('about 5 hours');
            case "about 6 hours":
                return t('about 6 hours');
            case "about 7 hours":
                return t('about 7 hours');
            case "about 8 hours":
                return t('about 8 hours');
            case "about 9 hours":
                return t('about 9 hours');
            default:
                return s;
        }
    }

    return (
        <div className={styles.wrapper}>
            {isLoading ? (
                <div className="spinner"/>
            ) : (
                <div className={styles.container}>
                    <div>
                        <h1 className={styles.heading}>{t('Top 10 designers')}</h1>
                        <div className={styles.flexContainer}>
                            {designers.map(designer => (
                                <div key={designer.username} className={styles.card}>
                                    <img
                                        className={styles.img}
                                        src={designer.avatar}
                                        alt={`${designer.username}'s avatar`}
                                        width={50}
                                        height={50}
                                    />
                                    <div>
                                        <p className={styles.bold}>{designer.username}</p>
                                        <p><b>{t('Median time:')}</b> {getFormatedTimes(formatDistance(0, designer.medianTime * 1000))}</p>
                                        <p><b>{t('Tasks completed:')}</b> {designer.totalTasks}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h2 className={styles.commentsHeading}>{t('User\'s comments')}</h2>
                        {comments.map(comment => (
                            <div key={comment.id} className={styles.card2}>
                                <img
                                    src={comment.designer.avatar}
                                    alt={comment.designer.username}
                                    width={50}
                                    height={50}
                                />
                                <div>
                                    <div className={styles.bold}>{comment.designer.username}</div>
                                    <div className={styles.gray}>{formatDateDistanceDetailed(comment.date_created)}</div>
                                    <div className={styles.bold} style={{ marginTop: '10px' }}>{comment.issue}</div>
                                    <div>{comment.message}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
