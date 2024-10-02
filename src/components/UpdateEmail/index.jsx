import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "../Button";
import classNames from "classnames/bind";
import styles from "./UpdateEmail.module.scss";
import { BACKEND_BASE_URL } from "../../constant";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { getToken } from "../../App";

const cx = classNames.bind(styles);

export default function UpdateEmail({ onCancel }) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // Bắt đầu từ bước nhập OTP
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${BACKEND_BASE_URL}/api/users/update/email`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200) {
          toast.success("OTP đã được gửi tới email hiện tại của bạn.");
          setStep(1); // Chuyển sang bước nhập OTP
        } else {
          toast.error(data.message);
        }
      })
      .catch((err) => toast.error(err.message));
  }, []);

  const handleVerifyOtp = () => {
    fetch(`${BACKEND_BASE_URL}/api/users/update/email/verify-otp`, {
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
            setStep(2);
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

  const handleChangeEmail = () => {
    fetch(`${BACKEND_BASE_URL}/api/users/update/email`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ email }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200) {
          toast.success(
            "Đổi email thành công. Email xác thực đã được gửi tới email mới của bạn, bạn sẽ bị đăng xuất sau 3s."
          );
          setTimeout(() => {
            navigate("/logout");
          }, 3000);
        } else {
          toast.error(data.message);
        }
      })
      .catch((err) => toast.error(err.message));
  };

  const handleBack = () => {
    setStep((prevStep) => Math.max(prevStep - 1, 1)); 
  };

  return (
    <div className={cx("update-email-container")}>
      <div className={cx("header")}>
        <h2>
          Thay đổi email <span>{step}/2</span> {/* Hiển thị bước hiện tại */}
        </h2>
        <Button noBackground small className={cx("close-icon")} onClick={onCancel} scaleHoverAnimation>
          {<FontAwesomeIcon icon={faXmark} />}
        </Button>
      </div>
      {step === 1 && (
        <div>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className={cx("input")}
          />
          <Button primary onClick={handleVerifyOtp}>Verify OTP</Button>
        </div>
      )}
      {step === 2 && (
        <div>
          <input
            type="email"
            placeholder="New Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={cx("input")}
          />
          <Button primary onClick={handleChangeEmail}>Change Email</Button>
        </div>
      )}
      <Button
        secondary
        onClick={handleBack}
        className={cx("back-button")}
        disabled={step === 1} // Vô hiệu hóa nút Back khi ở step 1
      >
        Back
      </Button>
    </div>
  );
}
