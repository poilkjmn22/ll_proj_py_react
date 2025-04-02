import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams, Link } from "react-router";
import useReq from "~/utils/request";

interface Topic {
    id: number;
    text: string;
}

export default function NewEntry() {
    const [topics, setTopics] = useState<Topic[]>([]);
    const [selectedTopicId, setSelectedTopicId] = useState<string | undefined>(undefined);
    const [entryText, setEntryText] = useState("");
    const [error, setError] = useState<string | null>(null);
    const { topicId, entryId } = useParams();
    const req = useReq();
    const navigate = useNavigate();

    const actionText = useMemo(() => entryId ? '更新条目' : '新建条目', [entryId]);

    useEffect(() => {
        const fetchTopics = async () => {
            try {
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
            } catch (err) {
                console.error('获取主题失败:', err);
                setError('获取主题列表时出错，请稍后再试');
            }
        };

        setSelectedTopicId(topicId)
        fetchTopics();
        const fetchEntry = async () => {
            try {
                const response = await req(`/api/entries/${entryId}/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                console.log(data, 'entry data')
                setEntryText(data.text);
            } catch (err) {
                console.error('获取主题失败:', err);
                setError('获取主题列表时出错，请稍后再试');
            }
        };
        entryId && fetchEntry();

    }, [topicId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedTopicId && entryText) {
            try {
                const method = entryId ? 'PUT' : 'POST'; // 根据是否有 entryId 决定请求方法
                const url = entryId ? `/api/entries/${entryId}/` : `/api/entries/`;
                const response = await req(url, {
                    method,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        topic: selectedTopicId,
                        text: entryText,
                        ...(entryId ? { id: entryId } : undefined)
                    }),
                });
                if (!response.ok) {
                    throw new Error(`提交失败: ${response.status}`);
                }
                navigate(`/topics/${selectedTopicId}`); // 提交成功后跳转回主题列表
            } catch (err) {
                console.error(`${actionText}失败:`, err);
                setError(`${actionText}时出错，请稍后再试`);
            }
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">{actionText}</h2>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="topic" className="block mb-2">选择主题:</label>
                    <select
                        id="topic"
                        value={selectedTopicId || ""}
                        onChange={(e) => setSelectedTopicId(e.target.value)}
                        className="border p-2 mb-4"
                    >
                        <option value="">请选择主题</option>
                        {topics.map(topic => (
                            <option key={topic.id} value={topic.id}>{topic.text}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="entryText" className="block mb-2">条目内容:</label>
                    <textarea
                        id="entryText"
                        value={entryText}
                        rows={ 12 }
                        onChange={(e) => setEntryText(e.target.value)}
                        className="border p-2 mb-4 w-full"
                    />
                </div>
                <div className="flex items-center justify-center gap-10">
                    <Link to={`/topics/${topicId}`} className="text-blue-500 hover:underline">取消</Link>
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                        {actionText}
                    </button></div>
            </form>
        </div>
    );
} 