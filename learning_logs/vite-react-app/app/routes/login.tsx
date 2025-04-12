import React, { useState } from 'react';
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext"; // 引入 useToast
import { useNavigate } from "react-router";
import useReq from "~/utils/request";

const Login: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const { showToast } = useToast(); // 使用 Toast 上下文
  const navigate = useNavigate();
  const req = useReq();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.target as HTMLFormElement);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    try {
      const response = await req("/api/accounts/login/", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "登录失败");
      }

      sessionStorage.setItem('token', data.token); // 不要添加任何前缀
      login({ username: data.username });
      showToast("登录成功", "success");
      navigate("/");
    } catch (err: any) {
      setError(err.message);
      showToast(err.message, "error"); // 显示错误提示
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-center mb-6">登录</h2>
        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              用户名
            </label>
            <input
              type="text"
              id="username"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="请输入用户名"
              name="username"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              密码
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="请输入密码"
              name="password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            登录
          </button>
        </form>
        <div className="text-center mt-4">
          <button
            onClick={() => navigate("/register")}
            className="text-blue-500 hover:underline"
          >
            没有账号？注册
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;