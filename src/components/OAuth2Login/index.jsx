import {
  faFacebook,
  faGithub,
  faGoogle,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import classNames from "classnames/bind";
import styles from "./OAuth2Login.module.scss";
import Button from "../Button";
import { BACKEND_BASE_URL } from "../../constant";

export default function OAuth2Login() {
  const cx = classNames.bind(styles);
  const handleOAuthLogin = (e, provider) => {
    e.preventDefault();
    window.location.href = `${BACKEND_BASE_URL}/oauth2/authorization/${provider}`;
  };
  return (
    <>
      <Button
        className={cx("login-google-btn")}
        large
        leftIcon={<FontAwesomeIcon icon={faGoogle} />}
        onClick={(e) => handleOAuthLogin(e, "google")}
      >
        Tiếp tục với Google
      </Button>
      <Button
        className={cx("login-facebook-btn")}
        large
        leftIcon={<FontAwesomeIcon icon={faFacebook} />}
        onClick={(e) => handleOAuthLogin(e, "facebook")}
      >
        Tiếp tục với Facebook
      </Button>
      <Button
        className={cx("login-github-btn")}
        large
        leftIcon={<FontAwesomeIcon icon={faGithub} />}
        onClick={(e) => handleOAuthLogin(e, "github")}
      >
        Tiếp tục với Github
      </Button>
    </>
  );
}
