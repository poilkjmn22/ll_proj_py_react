import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import useReq from "~/utils/request";
import ConfirmDialog from "~/components/ConfirmDialog"; // 引入 ConfirmDialog

interface Topic {
    id: number;
    text: string;
    date_added: string;
}

interface Entry {
    id: number;
    topic: number;
    text: string;
    date_added: string;
}

export default function TopicDetail() {
    const { topicId } = useParams();
    const [topic, setTopic] = useState<Topic | null>(null);
    const [entries, setEntries] = useState<Entry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const [confirmDialog, setConfirmDialog] = useState<{
        isOpen: boolean;
        entryId: number | null;
    }>({ isOpen: false, entryId: null });

    const req = useReq();

    useEffect(() => {
        const fetchTopicAndEntries = async () => {
            try {
                setIsLoading(true);

                // 获取主题详情
                const topicResponse = await req(`/api/topics/${topicId}/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (topicResponse.status === 404 || topicResponse.status === 403) {
                    navigate('/404');
                    return;
                }
                if (!topicResponse.ok) {
                    throw new Error(`获取主题详情失败: ${topicResponse.status}`);
                }
                const topicData = await topicResponse.json();
                setTopic(topicData);

                // 获取主题相关的条目
                const entriesResponse = await req(`/api/topics/${topicId}/entries/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (!entriesResponse.ok) {
                    throw new Error(`获取条目列表失败: ${entriesResponse.status}`);
                }
                const entriesData = await entriesResponse.json();
                setEntries(entriesData);

                setError(null);
            } catch (err) {
                console.error('获取数据失败:', err);
                setError('获取主题和条目数据时出错，请稍后再试');
            } finally {
                setIsLoading(false);
            }
        };

        if (topicId) {
            fetchTopicAndEntries();
        }
    }, [topicId]);

    const handleDeleteEntry = async (entryId: number) => {
        try {
            const response = await req(`/api/entries/${entryId}/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`删除失败: ${response.status}`);
            }

            // 更新条目列表
            setEntries(entries.filter(entry => entry.id !== entryId));
        } catch (err) {
            console.error('删除条目失败:', err);
            setError('删除条目时出错，请稍后再试');
        }
    };
    const openConfirmDialog = (entryId: number) => {
        setConfirmDialog({ isOpen: true, entryId });
    };

    const closeConfirmDialog = () => {
        setConfirmDialog({ isOpen: false, entryId: null });
    };

    const confirmDelete = () => {
        if (confirmDialog.entryId !== null) {
            handleDeleteEntry(confirmDialog.entryId);
        }
        closeConfirmDialog();
    };

    const handleEditEntry = (entryId: number) => {
        navigate(`/newEntry/${topicId}/${entryId}`);
    };

    if (isLoading) {
        return <div>加载中...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    if (!topic) {
        return <div>未找到该主题</div>;
    }

    const handleNewEntryClick = () => {
        navigate(`/newEntry/${topicId}`);
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-2">{topic.text}</h2>
            <p className="text-gray-600 mb-4">创建时间: {new Date(topic.date_added).toLocaleString()}</p>

            <div className="entries bg-white shadow-md rounded-lg p-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold mb-2">条目列表</h3>
                    <button onClick={handleNewEntryClick} className="mb-4 bg-blue-500 text-white p-2 rounded">
                        添加新条目
                    </button>
                </div>

                {entries.length > 0 ? (
                    <ul className="space-y-2 list-decimal">
                        {entries.map(entry => (
                            <li key={entry.id} className="entry p-2 border-b border-gray-200 relative group">
                                <div className="entry-text text-lg whitespace-pre-wrap">{entry.text}</div>
                                <div className="entry-date text-gray-500">
                                    {new Date(entry.date_added).toLocaleString()}
                                </div>
                                <button
                                    className="absolute right-16 bottom-1 bg-yellow-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                    onClick={() => handleEditEntry(entry.id)}
                                >
                                    编辑
                                </button>
                                <button
                                    className="absolute right-0 bottom-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                    onClick={() => openConfirmDialog(entry.id)}
                                >
                                    删除
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">该主题下还没有条目。</p>
                )}
            </div>

            <div className="actions mt-4">
                <Link to="/topics" className="text-blue-500 hover:underline">返回主题列表</Link>
            </div>
            {confirmDialog.isOpen && (
                <ConfirmDialog
                    message="您确定要删除这个条目吗？"
                    onConfirm={confirmDelete}
                    onCancel={closeConfirmDialog}
                />
            )}
        </div>
    );
}