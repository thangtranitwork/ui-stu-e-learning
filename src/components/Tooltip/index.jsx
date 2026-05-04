import React from "react";

const Tooltip = ({ items, onSelect, position, visible }) => {
  if (!visible || !items || items.length === 0) return null;

  return (
    <div className="absolute z-50 bg-[#1a1a2e] border border-white/10 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl py-1 min-w-[160px]"
      style={{ top: position.top, left: position.left }}>
      {items.map((item) => (
        <div key={item.id} onClick={() => onSelect(item.name)}
          className="px-4 py-2.5 text-sm text-slate-300 hover:bg-indigo-500/10 hover:text-indigo-400 cursor-pointer transition-colors">
          {item.name}
        </div>
      ))}
    </div>
  );
};

export default Tooltip;
