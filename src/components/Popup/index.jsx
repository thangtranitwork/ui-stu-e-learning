import React from "react";
import classNames from "classnames/bind";
import styles from "./Popup.module.scss";

const Popup = ({ isOpen, onClose, title, children }) => {
  const cx = classNames.bind(styles);

  if (!isOpen) return null;

  return (
    <div className={cx("overlay")} onClick={onClose}>
      <div className={cx("popup")} onClick={(e) => e.stopPropagation()}>
        <div className={cx("header")}>
          <h2>{title}</h2>
          <button className={cx("close-button")} onClick={onClose}>
            &times;
          </button>
        </div>
        <div className={cx("content")}>{children}</div>
      </div>
    </div>
  );
};

export default Popup;
