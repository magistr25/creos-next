"use client";
// import { Metadata } from 'next';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { parseISO, formatDistance } from 'date-fns';
import { RootState } from './store/store';
import { setLoading } from './store/loadingSlice';
import { fetchComments } from './actions/apiComments.ts';
import { getAllDesigners, Task} from './actions/apiDesigner.ts';
import { calculateMedian } from './utils/calculateMedian';
import { formatDateDistanceDetailed } from './utils/formatDateDistanceDetailed';

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
    const { t} = useTranslation();

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
        document.body.classList.add('light-theme');
    }, [dispatch]);

    function getFormatedTimes(s: string) {
        switch (s) {
            case "about 2 hours":
                return t('about 2 hours')
            case "about 3 hours":
                return t('about 3 hours')
            case "about 4 hours":
                return t('about 4 hours')
            case "about 5 hours":
                return t('about 5 hours')
            case "about 6 hours":
                return t('about 6 hours')
            case "about 7 hours":
                return t('about 7 hours')
            case "about 8 hours":
                return t('about 8 hours')
            case "about 9 hours":
                return t('about 9 hours')
        }

    }

    return (
        <div>
            {isLoading ? (
                <h3 style={{color:'#7f88f1'}}>{t('Loading...')}</h3>
            ) : (
                < div style={{padding: '0 50px'}}>
                    <div>
                        <h1 style={{color: '#7f88f1', marginBottom: '20px'}}>{t('Top 10 designers')}</h1>
                        <div style={{display: 'flex', flexWrap: 'wrap', gap: '20px'}}>
                            {designers.map(designer => (
                                <div key={designer.username} className="card" style={{
                                    border: '1px solid #ddd',
                                    borderRadius: '8px',
                                    padding: '10px',
                                    width: 'calc(33% - 20px)', /* Для 3-х колонок */
                                    boxSizing: 'border-box'
                                }}>
                                    <img
                                        src={designer.avatar}
                                        alt={`${designer.username}'s avatar`}
                                        width={50}
                                        height={50}
                                        style={{
                                            borderRadius: '50%',
                                            float: 'left',
                                            marginRight: '10px'
                                        }}
                                    />
                                    <div>
                                        <p style={{margin: '0', fontWeight: 'bold'}}>{designer.username}</p>
                                        <p style={{margin: '0'}}><b>{t('Median time:')}</b> {
                                            getFormatedTimes(formatDistance(0, designer.medianTime * 1000))
                                        }</p>
                                        <p style={{margin: '0'}}><b>{t('Tasks completed:')}</b>{designer.totalTasks}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h2 style={{color: '#7f88f1', paddingTop: '20px', paddingBottom: '20px'}}>{t('User\'s comments')}</h2>
                        {comments.map(comment => (
                            <div key={comment.id} className="card" style={{
                                marginBottom: '20px',
                                padding: '10px',
                                border: '1px solid #ddd',
                                borderRadius: '8px'
                            }}>
                                <img
                                    src={comment.designer.avatar}
                                    alt={comment.designer.username}
                                    style={{
                                        width: '50px',
                                        height: '50px',
                                        borderRadius: '50%',
                                        float: 'left',
                                        marginRight: '10px'
                                    }}
                                />
                                <div>
                                    <div style={{fontWeight: 'bold'}}>{comment.designer.username}</div>
                                    <div
                                        style={{color: 'gray'}}>{formatDateDistanceDetailed(comment.date_created)}</div>
                                    <div style={{fontWeight: 'bold', marginTop: '10px'}}>{comment.issue}</div>
                                    <div>{comment.message}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
