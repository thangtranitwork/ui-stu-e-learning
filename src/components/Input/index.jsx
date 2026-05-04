import React, { useState } from "react";

export default function Input({
  icon,
  actionIcon,
  placeholder,
  value,
  small = false,
  large = false,
  full = false,
  onChange,
  type = "text",
  otherClass = "",
  onActionIconClick,
  className = "",
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(value !== "");

  const hasValue = value !== undefined && value !== "";
  const isActive = isFocused || hasValue || type === "date";

  const height = small ? "h-10" : large ? "h-14" : "h-12";
  const textSize = small ? "text-xs" : large ? "text-base" : "text-sm";
  const widthClass = full ? "w-full" : "";
  const focusRing = isActive
    ? "border-indigo-500 ring-2 ring-indigo-500/20"
    : "border-white/10 hover:border-white/20";

  return (
    <div
      className={`relative flex items-center gap-2.5 bg-white/5 rounded-xl px-4 border transition-all duration-200 ${height} ${focusRing} ${textSize} ${widthClass} ${otherClass} ${className}`}
    >
      {icon && (
        <span className="text-slate-500 text-sm flex-shrink-0 w-5 text-center">
          {icon}
        </span>
      )}

      <div className="relative flex-1 h-full flex items-center">
        <input
          className={`w-full bg-transparent text-white outline-none border-none p-0 placeholder-transparent peer ${textSize}`}
          type={type}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={onChange}
          value={value}
          placeholder={placeholder}
          {...props}
        />
        <label
          className={`absolute left-0 transition-all duration-200 pointer-events-none origin-left
            ${isActive
              ? "-top-[22px] text-[11px] text-indigo-400 font-medium"
              : "top-1/2 -translate-y-1/2 text-sm text-slate-500"
            }`}
        >
          {placeholder}
        </label>
      </div>

      {actionIcon && (
        <span
          className="text-slate-500 hover:text-indigo-400 cursor-pointer transition-colors flex-shrink-0"
          onClick={onActionIconClick}
        >
          {actionIcon}
        </span>
      )}
    </div>
  );
}
