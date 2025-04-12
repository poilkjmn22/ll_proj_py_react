import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import useReq from "~/utils/request";
import { useToast } from "~/context/ToastContext";  // 引入 Toast Hook

export default function NewTopic() {
    const { topicId } = useParams<{ topicId?: string }>();
    const [topicText, setTopicText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const req = useReq();
    const { showToast } = useToast();

    useEffect(() => {
        if (topicId) {
            const fetchTopic = async () => {
                const response = await req(`/api/topics/${topicId}/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                setTopicText(data.text);
            };

            fetchTopic();
        }
    }, [topicId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const method = topicId ? 'PUT' : 'POST';
            const url = topicId ? `/api/topics/${topicId}/` : '/api/topics/';
            const response = await req(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: topicText }),
            });

            if (response.status === 403) {
                throw new Error('您没有权限执行此操作');
            }

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || '操作失败');
            }

            showToast(topicId ? '主题更新成功' : '主题创建成功', 'success');
            navigate('/topics'); // 提交成功后跳转回主题列表
        } catch (err) {
            const message = err instanceof Error ? err.message : '操作失败';
            setError(message);
            showToast(message, 'error');
            console.error('提交主题失败:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">{topicId ? '编辑主题' : '创建新主题'}</h2>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="topicText" className="block mb-2">主题内容:</label>
                    <input
                        type="text"
                        id="topicText"
                        value={topicText}
                        onChange={(e) => setTopicText(e.target.value)}
                        className="border p-2 mb-4 w-full"
                        required
                    />
                </div>
                <div className="flex items-center justify-center gap-10">
                    <Link to="/topics" className="text-blue-500 hover:underline">取消</Link>
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                        {topicId ? '更新主题' : '创建主题'}
                    </button></div>
            </form>
        </div>
    );
}