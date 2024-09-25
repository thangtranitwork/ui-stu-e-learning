import React, { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "../Login/Login.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey, faEnvelope, faXmark } from "@fortawesome/free-solid-svg-icons";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import OAuth2Login from "../../components/OAuth2Login";
import { toast } from "react-toastify";
import { BACKEND_BASE_URL } from "../../constant";

const cx = classNames.bind(styles);

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      navigate("/");
    }
  }, [navigate]);

  const validateInput = () => {
    if (!email || !password || !confirmPassword) {
      toast.error("Hãy điền đầy đủ các trường");
      return false;
    }
    if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
      toast.error("Email không hợp lệ");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Mật khẩu không khớp");
      return false;
    }
    if (password.length < 8) {
      toast.error("Password gồm ít nhất 8 ký tự");
      return false;
    }
    return true;
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!validateInput()) {
      return;
    }

    fetch(`${BACKEND_BASE_URL}/api/auth/register`, {
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
          toast.success("Đăng ký thành công! Email xác thực đã được gửi tới email của bạn");
        } else {
          toast.error(data.message);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  return (
    <div className={cx("wrapper", "b-shadow")}>
      <Button className={cx("close-icon")} to="/" scaleHoverAnimation>
        {<FontAwesomeIcon icon={faXmark} />}
      </Button>
      <form className={cx("left")} onSubmit={handleRegister}>
        <h2 className={cx("tittle")}>Đăng ký tài khoản mới</h2>
        <Input
          type="email"
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
        <Input
          type="password"
          placeholder="Confirm password"
          icon={<FontAwesomeIcon icon={faKey} />}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <div className={cx("action-btn")}>
          <Button className={cx("login-btn")} primary large to="/login">
            Đăng nhập
          </Button>
          <Button
            className={cx("register-btn")}
            secondary
            large
            type="submit"
          >
            Đăng ký
          </Button>
        </div>
      </form>
      <div className={cx("right")}>
        <OAuth2Login />
      </div>
    </div>
  );
}
