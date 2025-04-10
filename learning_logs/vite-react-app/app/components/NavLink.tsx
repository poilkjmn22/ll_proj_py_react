import { NavLink as RouterNavLink, useNavigate } from "react-router";
import { useAuth } from "~/context/AuthContext";

export default function Navigation() {
  const { isAuthenticated, logout, user } = useAuth(); // 获取登录状态和注销方法
  const navigate = useNavigate(); // 初始化导航
  const username =  user.username; // 假设从后端或上下文中获取用户名

  const handleLogout = () => {
    logout(); // 调用注销方法
    navigate("/login"); // 导航到登录页面
  };

  return (
    <nav className="flex items-center justify-between h-16 px-4 bg-gray-100">
      <div className="flex grow justify-center gap-4">
        <RouterNavLink 
          to="/" 
          className="text-blue-600 hover:text-blue-800 px-4 py-2 rounded-md hover:bg-gray-200"
        >
          首页
        </RouterNavLink>
        <RouterNavLink 
          to="/topics" 
          className={({ isActive }) => 
            `px-4 py-2 rounded-md ${
              isActive 
                ? "bg-blue-600 text-white" 
                : "text-blue-600 hover:text-blue-800 hover:bg-gray-200"
            }`
          }
        >
          学习主题
        </RouterNavLink>
      </div>
      <div className="flex items-center gap-4">
        {isAuthenticated && (
          <>
            <span className="text-gray-700">欢迎, {username}</span>
            <button 
              onClick={handleLogout} 
              className="text-blue-600 hover:text-blue-800 px-4 py-2 rounded-md hover:bg-gray-200"
            >
              注销
            </button>
          </>
        )}
        {!isAuthenticated && (
          <button 
            onClick={() => navigate("/register")} 
            className="text-blue-600 hover:text-blue-800 px-4 py-2 rounded-md hover:bg-gray-200"
          >
            注册
          </button>
        )}
      </div>
    </nav>
  );
}