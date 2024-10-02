import React from "react";
import classNames from "classnames/bind";
import { useNavigate } from "react-router-dom";
import styles from "./UserInfo.module.scss";
import { DEFAULT_AVATAR_URL } from "../../constant";

const UserInfo = ({ user, className }) => {
  const cx = classNames.bind(styles);
  const navigate = useNavigate();

  // Kiểm tra người dùng có online hay không
  const isUserOnline = () => {
    if (!user?.lastOnline) return false;
    const lastOnlineDate = new Date(user.lastOnline);
    return Date.now() < lastOnlineDate.getTime();
  };

  return (
    <span
      className={cx("user-info-link", className)}
      onClick={() => navigate(`/users/${user?.id}`)}
    >
      <span className={cx("user-info")}>
        <img
          className={cx("user-info-avatar")}
          src={user?.avatar || DEFAULT_AVATAR_URL}
          alt={`${user?.lastname} ${user?.firstname}`}
        />
        {/* Hiển thị online circle nếu người dùng đang online */}
        {isUserOnline() && <p className={cx("online-circle")}></p>}
        <span className={cx("user-info-name")}>
          {localStorage.getItem("userId") === String(user?.id)
            ? "Bạn"
            : user?.lastname + " " + user?.firstname}
        </span>
      </span>
    </span>
  );
};

export default UserInfo;

export function UserAvartarOnly ({ user, className }) {
  const cx = classNames.bind(styles);
  const navigate = useNavigate();

  // Kiểm tra người dùng có online hay không
  const isUserOnline = () => {
    if (!user?.lastOnline) return false;
    const lastOnlineDate = new Date(user.lastOnline);
    return Date.now() < lastOnlineDate.getTime();
  };

  return (
    <span
      className={cx("user-info-link", className)}
      onClick={() => navigate(`/users/${user?.id}`)}
    >
      <span className={cx("user-info")}>
        <img
          className={cx("user-info-avatar")}
          src={user?.avatar || DEFAULT_AVATAR_URL}
          alt={`${user?.lastname} ${user?.firstname}`}
        />
        {isUserOnline() && <p className={cx("online-circle")}></p>}
      </span>
    </span>
  );
};

