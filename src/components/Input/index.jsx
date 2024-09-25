import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "./Input.module.scss";

const cx = classNames.bind(styles);

export default function Input({
  icon,
  actionIcon, // Prop cho icon hành động nằm phía bên phải
  placeholder,
  value,
  small = false,
  large = false,
  full = false,
  onChange,
  type = "text",
  otherClass,
  onActionIconClick, // Xử lý khi click vào icon hành động
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(value !== "");

  return (
    <div
      className={cx("input-wrapper", otherClass ,{
        focused: isFocused || value || type === "date",
        small,
        large,
        full,
        
      })}
    >
      {icon && <span className={cx("icon")}>{icon}</span>}
      <input
        className={cx("input")}
        type={type}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={onChange}
        value={value}
        {...props}
      />
      <label
        className={cx("placeholder", { "date-placeholder": type === "date" })}
      >
        {placeholder}
      </label>
      {actionIcon && (
        <span className={cx("action-icon")} onClick={onActionIconClick}>
          {actionIcon}
        </span>
      )}
    </div>
  );
}
