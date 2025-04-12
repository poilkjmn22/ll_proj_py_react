import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">页面未找到或您没有访问权限</p>
        <Link 
          to="/topics"
          className="text-blue-500 hover:text-blue-600 underline"
        >
          返回主题列表
        </Link>
      </div>
    </div>
  );
}
