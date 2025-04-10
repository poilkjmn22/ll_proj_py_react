import React, { useEffect } from "react";

interface ToastProps {
  message: string;
  type: "success" | "error";
  duration?: number; // 显示时间，单位为毫秒，默认值为 1 秒
  onClose?: () => void; // onClose 可选，默认值为空函数
}

const Toast: React.FC<ToastProps> = ({ message, type, duration = 1000, onClose = () => {} }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration); // 使用可配置的显示时间
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div
      className={`fixed top-8 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded shadow-md text-white ${
        type === "success" ? "bg-green-500" : "bg-red-500"
      }`}
    >
      {message}
    </div>
  );
};

export default Toast;
