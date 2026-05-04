import React from "react";

const Popup = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-[fadeIn_0.2s_ease] p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#141420] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-[scaleIn_0.2s_ease] flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header — always visible */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 flex-shrink-0">
          <h2 className="text-lg font-bold text-white truncate pr-4">{title}</h2>
          <button
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer text-xl leading-none bg-transparent border-none flex-shrink-0"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        {/* Body — scrollable when content is tall */}
        <div className="p-6 overflow-y-auto flex-1 overscroll-contain">{children}</div>
      </div>
    </div>
  );
};

export default Popup;
