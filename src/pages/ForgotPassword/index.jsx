import React, { useState } from "react";
import { BACKEND_BASE_URL } from "../../constant";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faKey, faArrowLeft, faShieldHalved } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleEmailSubmit = async () => {
    const response = await fetch(`${BACKEND_BASE_URL}/api/auth/forgot-password/${email}`, { method: "GET", headers: { "Content-Type": "application/json" } });
    if (response.ok) { setStep(2); toast.success("OTP đã gửi đến email của bạn."); }
    else { const data = await response.json(); toast.error(data.message || "Lỗi."); }
  };

  const handleVerifyOtp = async () => {
    const response = await fetch(`${BACKEND_BASE_URL}/api/auth/forgot-password/${email}/verify-otp`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ otp }),
    });
    const data = await response.json();
    if (response.ok && data.code === 200) { setStep(3); toast.success("OTP xác nhận thành công."); }
    else toast.error(data.message || "OTP sai.");
  };

  const handleChangePassword = async () => {
    const response = await fetch(`${BACKEND_BASE_URL}/api/auth/forgot-password/${email}`, {
      method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ newPassword }),
    });
    if (response.ok) { toast.success("Đổi mật khẩu thành công."); setTimeout(() => navigate("/login"), 1500); }
    else { const data = await response.json(); toast.error(data.message || "Lỗi."); }
  };

  const handleSubmit = (e) => { e.preventDefault(); if (step === 1) handleEmailSubmit(); else if (step === 2) handleVerifyOtp(); else if (step === 3) handleChangePassword(); };
  const steps = ["Email", "OTP", "Mật khẩu mới"];
  const stepIcons = [faEnvelope, faShieldHalved, faKey];

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl backdrop-blur-xl shadow-2xl p-6 md:p-10 space-y-6 animate-[slideUp_0.35s_ease]">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-slate-500 hover:text-white transition-colors bg-transparent border-none cursor-pointer">
          <FontAwesomeIcon icon={faArrowLeft} /> Quay lại
        </button>

        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">Quên mật khẩu</h2>
          <p className="text-sm text-slate-500">Bước {step}/3 — {steps[step - 1]}</p>
        </div>

        {/* Progress steps */}
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex-1 flex flex-col items-center gap-1.5">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300
                ${s <= step ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30" : "bg-white/5 text-slate-600"}`}>
                <FontAwesomeIcon icon={stepIcons[s - 1]} />
              </div>
              <div className={`h-1 w-full rounded-full transition-all duration-500 ${s <= step ? "bg-indigo-600" : "bg-white/10"}`}></div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {step === 1 && <Input icon={<FontAwesomeIcon icon={faEnvelope} />} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />}
          {step === 2 && <Input type="text" icon={<FontAwesomeIcon icon={faShieldHalved} />} placeholder="Nhập mã OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required />}
          {step === 3 && <Input type="password" icon={<FontAwesomeIcon icon={faKey} />} placeholder="Mật khẩu mới" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />}
          <Button primary large type="submit" className="w-full">
            {step === 1 ? "Gửi OTP" : step === 2 ? "Xác nhận OTP" : "Đổi mật khẩu"}
          </Button>
        </form>
      </div>
    </div>
  );
}
