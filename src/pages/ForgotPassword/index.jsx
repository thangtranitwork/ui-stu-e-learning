import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "./ForgotPassword.module.scss";
import { BACKEND_BASE_URL } from "../../constant";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faKey } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

const cx = classNames.bind(styles);

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleEmailSubmit = async () => {
    try {
      const response = await fetch(
        `${BACKEND_BASE_URL}/api/auth/forgot-password/${email}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setStep(2);
        toast.success("OTP has been sent to your email.");
      } else {
        const data = await response.json();
        toast.error(data.message || "Error preparing for password reset.");
      }
    } catch (error) {
      toast.error("Failed to send OTP.");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await fetch(
        `${BACKEND_BASE_URL}/api/auth/forgot-password/${email}/verify-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ otp }),
        }
      );

      const data = await response.json();
      if (response.ok && data.code === 200) {
        setStep(3);
        toast.success("OTP verified. Please set your new password.");
      } else {
        toast.error(data.message || "Invalid OTP.");
      }
    } catch (error) {
      toast.error("Failed to verify OTP.");
    }
  };

  const handleChangePassword = async () => {
    try {
      const response = await fetch(
        `${BACKEND_BASE_URL}/api/auth/forgot-password/${email}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newPassword }),
        }
      );

      if (response.ok) {
        toast.success("Password changed successfully.");
        setTimeout(() => {
          navigate("/login");
        }, 1500); // Chuyển hướng sau 1.5 giây
      } else {
        const data = await response.json();
        toast.error(data.message || "Failed to change password.");
      }
    } catch (error) {
      toast.error("Failed to change password.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 1) {
      handleEmailSubmit();
    } else if (step === 2) {
      handleVerifyOtp();
    } else if (step === 3) {
      handleChangePassword();
    }
  };

  return (
    <div className={cx("wrapper", "b-shadow")}>
      <h2 className={cx("tittle")}>Forgot Password</h2>
      <form className={cx("form")} onSubmit={handleSubmit}>
        <Input
          icon={<FontAwesomeIcon icon={faEnvelope} />}
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {step === 1 && (
          <Button primary type="submit">
            Send OTP
          </Button>
        )}
      </form>

      {step === 2 && (
        <form className={cx("form")} onSubmit={handleSubmit}>
          <Input
            type="text"
            icon={<FontAwesomeIcon icon={faKey} />}
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <Button primary type="submit">
            Verify OTP
          </Button>
        </form>
      )}

      {step === 3 && (
        <form className={cx("form")} onSubmit={handleSubmit}>
          <Input
            type="password"
            icon={<FontAwesomeIcon icon={faKey} />}
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <Button primary type="submit">
            Change Password
          </Button>
        </form>
      )}
    </div>
  );
}
