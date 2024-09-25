import React from "react";
import classNames from "classnames/bind";
import styles from "./Tooltip.module.scss";

const Tooltip = ({ items, onSelect, position, visible }) => {
  const cx = classNames.bind(styles);

  if (!visible || !items || items.length === 0) return null;

  return (
    <div
      className={cx("tooltip")}
      style={{ top: position.top, left: position.left }}
    >
      {items.map((item) => (
        <div
          key={item.id}
          className={cx("tooltip-item")}
          onClick={() => onSelect(item.name)}
        >
          {item.name}
        </div>
      ))}
    </div>
  );
};

export default Tooltip;
