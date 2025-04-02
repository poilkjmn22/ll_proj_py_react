import { NavLink as RouterNavLink } from "react-router";

// 基础样式
export default function Navigation() {
  return (
    <nav className="flex gap-4 items-center justify-center h-16">
      <RouterNavLink 
        to="/" 
        className="text-blue-600 hover:text-blue-800 px-4 py-2 rounded-md hover:bg-gray-100"
      >
        首页
      </RouterNavLink>
      <RouterNavLink 
        to="/topics" 
        className={({ isActive }) => 
          `px-4 py-2 rounded-md ${
            isActive 
              ? "bg-blue-600 text-white" 
              : "text-blue-600 hover:text-blue-800 hover:bg-gray-100"
          }`
        }
      >
        学习主题
      </RouterNavLink>
    </nav>
  );
} 