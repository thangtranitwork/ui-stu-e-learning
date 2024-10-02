import React, { useRef } from "react";
import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./Header.module.scss";
import { Link, useLocation } from "react-router-dom";
import {
  faBars,
  faCircleUser,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { getToken } from "../../../../App";

const Header = () => {
  const cx = classNames.bind(styles);
  const toggler = useRef();
  const location = useLocation(); // Sử dụng useLocation để lấy đường dẫn hiện tại
  const hasToken = getToken() !== null;

  const handleLinkClick = () => {
    if (toggler.current.checked) {
      toggler.current.checked = false;
    }
  };

  return (
    <header>
      <nav className={cx("wrapper", "b-shadow")}>
        <Link to="/">
          <div className={cx("logo")}></div>
        </Link>
        <input
          type="checkbox"
          id="toggler"
          name="toggler"
          ref={toggler}
          className={cx("toggler")}
        />
        <label htmlFor="toggler" className={cx("label-toggler")}>
          <FontAwesomeIcon icon={faBars} />
        </label>
        <div className={cx("menu")}>
          <div className={cx("list")}>
            <li>
              <Link
                className={cx("item", { active: location.pathname === "/" })}
                to="/"
                onClick={handleLinkClick}
              >
                Trang chủ
              </Link>
            </li>
            <li>
              <Link
                className={cx("item", {
                  active: location.pathname === "/courses",
                })}
                to="/courses"
                onClick={handleLinkClick}
              >
                Khoá học
              </Link>
            </li>
            <li>
              <Link
                className={cx("item", {
                  active: location.pathname === "/quizzes",
                })}
                to="/quizzes"
                onClick={handleLinkClick}
              >
                Trắc nghiệm
              </Link>
            </li>
            <li>
              <Link
                className={cx("item", {
                  active: location.pathname === "/posts",
                })}
                to="/posts"
                onClick={handleLinkClick}
              >
                Thảo luận
              </Link>
            </li>
            {!hasToken && (
              <React.Fragment>
                <li>
                  <Link
                    className={cx("item", {
                      active: location.pathname === "/register",
                    })}
                    to="/register"
                  >
                    Đăng ký
                  </Link>
                </li>
                <li>
                  <Link
                    className={cx("item", {
                      active: location.pathname === "/login",
                    })}
                    to="/login"
                  >
                    Đăng nhập
                  </Link>
                </li>
              </React.Fragment>
            )}
            {hasToken && (
              <>
                {localStorage.getItem("scope").includes("ADMIN") && (
                  <li>
                    <Link
                      className={cx("item", "icon", {
                        active: location.pathname === "/admin",
                      })}
                      to="/admin"
                      onClick={handleLinkClick}
                    >
                      Quản lý
                    </Link>
                  </li>
                )}
                <li>
                  <Link
                    className={cx("item", "icon", {
                      active: location.pathname === "/profile",
                    })}
                    to="/profile"
                    onClick={handleLinkClick}
                  >
                    <FontAwesomeIcon
                      className={cx("user-icon")}
                      icon={faCircleUser}
                    />
                  </Link>
                </li>
                <li>
                  <Link
                    className={cx("item", "icon", {
                      active: location.pathname === "/logout",
                    })}
                    to="/logout"
                  >
                    <FontAwesomeIcon
                      className={cx("user-icon")}
                      icon={faRightFromBracket}
                    />
                  </Link>
                </li>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
