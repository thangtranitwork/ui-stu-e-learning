import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "../Button";
import classNames from "classnames/bind";
import styles from "./UpdatePassword.module.scss";
import { BACKEND_BASE_URL } from "../../constant";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { getToken } from "../../App";

const cx = classNames.bind(styles);

export default function UpdatePassword({ onCancel }) {
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(2); // Bắt đầu từ bước nhập OTP

  useEffect(() => {
    // Tự động gọi hàm prepare khi component được hiển thị
    fetch(`${BACKEND_BASE_URL}/api/users/update/password`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200) {
          toast.success("OTP đã được gửi đến email hiện tại của bạn.");
          setStep(2); // Chuyển sang bước nhập OTP
        } else {
          toast.error(data.message);
        }
      })
      .catch((err) => toast.error(err.message));
  }, []);

  const handleVerifyOtp = () => {
    fetch(`${BACKEND_BASE_URL}/api/users/update/password/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ otp }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200) {
          if (data.body.success) {
            toast.success("Xác minh OTP thành công.");
            setStep(3);
          } else {
            toast.error(
              `OTP không chính xác bạn còn ${data.body.remaining} lần thử`
            );
          }
        } else {
          toast.error(data.message);
        }
      })
      .catch((err) => toast.error(err.message));
  };

  const handleChangePassword = () => {
    fetch(`${BACKEND_BASE_URL}/api/users/update/password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200) {
          toast.success("Cập nhật mật khẩu thành công!");
          onCancel();
        } else {
          toast.error(data.message);
        }
      })
      .catch((err) => toast.error(err.message));
  };

  const handleBack = () => {
    setStep((prevStep) => Math.max(prevStep - 1, 2)); // Quay lại bước trước đó nhưng không nhỏ hơn bước 2
  };

  return (
    <div className={cx("update-password-container")}>
      <div className={cx("header")}>
        <h2>
          Thay đổi mật khẩu <span>{step - 1}/2</span>{" "}
          {/* Hiển thị bước hiện tại */}
        </h2>
        <Button
          noBackground
          small
          className={cx("close-icon")}
          onClick={onCancel}
          scaleHoverAnimation
        >
          {<FontAwesomeIcon icon={faXmark} />}
        </Button>
      </div>
      {step === 2 && (
        <div>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className={cx("input")}
          />
          <Button primary onClick={handleVerifyOtp}>
            Verify OTP
          </Button>
        </div>
      )}
      {step === 3 && (
        <div>
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={cx("input")}
          />
          <Button primary onClick={handleChangePassword}>
            Change Password
          </Button>
        </div>
      )}
      <Button
        secondary
        onClick={handleBack}
        className={cx("back-button")}
        disabled={step === 2} // Vô hiệu hóa nút Back khi ở step 2
      >
        Back
      </Button>
    </div>
  );
}
