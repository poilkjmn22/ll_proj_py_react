import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import useReq from "~/utils/request";

interface Topic {
    id: number;
    text: string;
    date_added: string;
}

export default function Topics() {
    const [topics, setTopics] = useState<Topic[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const req = useReq();

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                setIsLoading(true);
                const response = await req('/api/topics/', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`API请求失败: ${response.status}`);
                }

                const data = await response.json();
                setTopics(data);
                setError(null);
            } catch (err) {
                console.error('获取主题失败:', err);
                setError('获取主题列表时出错，请稍后再试');
            } finally {
                setIsLoading(false);
            }
        };

        fetchTopics();
    }, []);

    const navigate = useNavigate();

    const handleCreateNewTopic = () => {
        navigate('/newTopic');
    };

    const handleEditTopic = (topicId: number) => {
        navigate(`/newTopic/${topicId}`);
    };

    const handleDeleteTopic = async (topicId: number) => {
        // 弹出确认对话框
        const confirmDelete = window.confirm("您确定要删除这个主题吗？");
        if (!confirmDelete) {
            return; // 如果用户选择取消，直接返回
        }

        try {
            const response = await req(`/api/topics/${topicId}/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`删除失败: ${response.status}`);
            }

            // 更新主题列表
            setTopics(topics.filter(topic => topic.id !== topicId));
        } catch (err) {
            console.error('删除主题失败:', err);
            setError('删除主题时出错，请稍后再试');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold mb-4">学习主题列表</h2>
                <button
                    className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600"
                    onClick={handleCreateNewTopic}
                >
                    创建新主题
                </button>
            </div>

            {isLoading && <p className="text-gray-500">加载中...</p>}

            {error && <p className="text-red-500">{error}</p>}

            {!isLoading && !error && (
                topics.length > 0 ? (
                    <nav>
                        <ul className="list-disc pl-5">
                            {topics.map(topic => (
                                <li key={topic.id} className="mb-2 relative group">
                                    <Link to={`/topics/${topic.id}`} className="text-blue-500 hover:underline">{topic.text}</Link>
                                    <button
                                        className="absolute right-16 bg-yellow-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => handleEditTopic(topic.id)}
                                    >
                                        编辑
                                    </button>
                                    <button
                                        className="absolute right-0 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => handleDeleteTopic(topic.id)}
                                    >
                                        删除
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                ) : (
                    <p className="text-gray-500">没有找到学习主题。</p>
                )
            )}
        </div>
    );
}