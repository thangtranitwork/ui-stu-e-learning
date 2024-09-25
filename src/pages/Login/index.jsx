import React, { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./Login.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey, faEnvelope, faXmark } from "@fortawesome/free-solid-svg-icons";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import OAuth2Login from "../../components/OAuth2Login";
import { BACKEND_BASE_URL } from "../../constant";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setToken } from "../../App";
import moment from "moment/moment";

const cx = classNames.bind(styles);

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      if (localStorage.getItem("accessToken")) {
        toast.info("Bạn đã đăng nhập!")
        navigate("/");
      }
    }, 300);
  }, [navigate]);

  const validateInput = () => {
    if (!email || !password) {
      toast.error("Vui lòng nhập đầy đủ email và password");
      return false;
    }
    if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
      toast.error("Email không hợp lệ");
      return false;
    }
    if (password.length < 8) {
      toast.error("Password gồm ít nhất 8 ký tự");
      return false;
    }
    return true;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!validateInput()) {
      return;
    }

    fetch(`${BACKEND_BASE_URL}/api/auth/login`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        if (data.code === 200) {
          toast.success("Login successful!");
          setToken(data.body.accessToken);
          navigate("/");
        } else if (data.code === 104) {
          toast.error(
            `\nĐăng nhập thất bại! Bạn còn ${data.body.remainingTry} lần thử`
          );
        } else if (data.code === 124) {
          toast.error(
            `\nTài khoản của bạn bị khóa đến ${moment(
              data.body.lockoutTime
            ).format("HH:mm DD/MM/YYYY")}`
          );
        } else {
          toast.error(data.message);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  function base64DecodeUnicode(str) {
    let decodedStr = decodeURIComponent(
      atob(str)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return decodedStr;
  }

  return (
    <div className={cx("wrapper", "b-shadow")}>
      <Button className={cx("close-icon")} to="/" scaleHoverAnimation>
        {<FontAwesomeIcon icon={faXmark} />}
      </Button>
      <form className={cx("left")} onSubmit={handleLogin}>
        <h2 className={cx("tittle")}>Đăng nhập bằng tài khoản</h2>
        <Input
          type="text"
          placeholder="Email"
          icon={<FontAwesomeIcon icon={faEnvelope} />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          icon={<FontAwesomeIcon icon={faKey} />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Link to="/forgot-password" className={cx("forgot-password")}>
          Quên mật khẩu?
        </Link>
        <div className={cx("action-btn")}>
          <Button className={cx("register-btn")} secondary large to="/register">
            Đăng ký
          </Button>
          <Button className={cx("login-btn")} primary large type="submit">
            Đăng nhập
          </Button>
        </div>
      </form>
      <div className={cx("right")}>
        <OAuth2Login />
      </div>
    </div>
  );
}
