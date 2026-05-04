import React from "react";

const Alert = ({ message, type, onClose }) => {
  const typeStyles = {
    success: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
    error: "bg-red-500/10 border-red-500/30 text-red-400",
    warning: "bg-amber-500/10 border-amber-500/30 text-amber-400",
    info: "bg-blue-500/10 border-blue-500/30 text-blue-400",
  };

  return (
    <div className={`fixed top-6 right-6 z-[9999] flex items-center gap-3 px-5 py-3 rounded-xl border backdrop-blur-xl shadow-2xl animate-[slideIn_0.3s_ease] ${typeStyles[type] || typeStyles.info}`}>
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="text-lg leading-none opacity-60 hover:opacity-100 transition-opacity cursor-pointer bg-transparent border-none text-current">×</button>
    </div>
  );
};

export default Alert;
