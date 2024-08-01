"use client";

import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { parseISO, formatDistance } from 'date-fns';
import { RootState } from './store/store';
import { setLoading } from './store/loadingSlice';
import { fetchComments } from './actions/apiComments';
import { getAllDesigners, Task } from './actions/apiDesigner';
import { calculateMedian } from './utils/calculateMedian';
import { formatDateDistanceDetailed } from './utils/formatDateDistanceDetailed';
import styles from './page.module.css';

// export const metadata: Metadata = {
//     title: 'Creos Next',
// }
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
                // Запрашиваем данные для обоих компонентов
                const [fetchedComments, fetchedDesigners] = await Promise.all([
                    fetchComments(),
                    getAllDesigners(),
                ]);

                // Обработка данных для дизайнеров
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

                designersArray.sort((a, b) => a.medianTime - b.medianTime || b.totalTasks - a.totalTasks);

                setComments(fetchedComments);
                setDesigners(designersArray.slice(0, 10));
            } catch (error) {
                console.error('Error:', error);
            } finally {
                dispatch(setLoading(false));
            }
        };
        fetchData();
        window.scrollTo(0, 0);

        // Устанавливаем светлую тему при первом рендеринге
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
                <h3 className={styles.loadingText}>{t('Loading...')}</h3>
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
                                        <p><b>{t('Median time:')}</b> {
                                            getFormatedTimes(formatDistance(0, designer.medianTime * 1000))
                                        }</p>
                                        <p><b>{t('Tasks completed:')}</b>{designer.totalTasks}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h2 className={styles.commentsHeading}>{t('User\'s comments')}</h2>
                        {comments.map(comment => (
                            <div key={comment.id} className={styles.card}>
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
