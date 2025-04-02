export default function Index() {
    return (
        <div className="flex flex-col flex-1 items-center justify-center bg-gray-100 p-6">
            <h1 className="text-4xl font-extrabold text-center mb-4">欢迎来到学习日志</h1>
            <p className="text-lg text-center mb-6">
                学习日志帮助您跟踪您的学习进度，记录您感兴趣的任何主题。
            </p>
            <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full">
                <h2 className="text-2xl font-bold mb-4">开始您的学习之旅</h2>
                <p className="text-gray-700 mb-4">
                    在这里，您可以创建新的学习主题，记录您的学习笔记，并与他人分享您的见解。
                </p>
            </div>
            <footer className="mt-6 text-gray-600">
                <p>© 2023 学习日志. 保留所有权利.</p>
            </footer>
        </div>
    );
}