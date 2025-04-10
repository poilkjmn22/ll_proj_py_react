import type { Route } from "./+types/home";
import { Outlet, useLocation, Navigate } from "react-router";
import Navigation from "~/components/NavLink";
import { useAuth } from "../context/AuthContext"; // 引入身份验证上下文

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Layout() {
  const { isAuthenticated } = useAuth(); // 获取身份验证状态
  const location = useLocation();

  const publicRoutes = ["/", "/register", "/login"]; // 公共路由
  const isPublicRoute = publicRoutes.includes(location.pathname);

  if (!isAuthenticated && !isPublicRoute) {
    return <Navigate to="/login" replace />; // 未登录时重定向到登录页面
  }

  return (
    <div className="flex flex-col h-screen">
      {!["/register", "/login"].includes(location.pathname) && <Navigation />}
      <main className="flex-1 overflow-auto flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}
