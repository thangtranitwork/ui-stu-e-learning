import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "../Button";
import Input from "../Input";
import { BACKEND_BASE_URL } from "../../constant";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faKey, faShieldHalved } from "@fortawesome/free-solid-svg-icons";
import { getToken } from "../../App";

export default function UpdatePassword({ onCancel }) {
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(2);

  useEffect(() => {
    fetch(`${BACKEND_BASE_URL}/api/users/update/password`, { method: "GET", headers: { Authorization: `Bearer ${getToken()}` } })
      .then(r => r.json()).then(data => { if (data.code === 200) { toast.success("OTP đã gửi."); setStep(2); } else toast.error(data.message); })
      .catch(err => toast.error(err.message));
  }, []);

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    fetch(`${BACKEND_BASE_URL}/api/users/update/password/verify-otp`, {
      method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` }, body: JSON.stringify({ otp }),
    }).then(r => r.json()).then(data => {
      if (data.code === 200) { if (data.body.success) { toast.success("OTP xác nhận thành công."); setStep(3); } else toast.error(`OTP sai! Còn ${data.body.remaining} lần`); }
      else toast.error(data.message);
    });
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    fetch(`${BACKEND_BASE_URL}/api/users/update/password`, {
      method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` }, body: JSON.stringify({ password }),
    }).then(r => r.json()).then(data => {
      if (data.code === 200) { toast.success("Đổi mật khẩu thành công!"); onCancel(); }
      else toast.error(data.message);
    });
  };

  return (
    <div className="bg-[#141420] border border-white/10 rounded-2xl p-6 mt-4 animate-[slideUp_0.25s_ease]">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-bold text-white">Đổi mật khẩu</h3>
          <p className="text-xs text-slate-500 mt-0.5">Bước {step - 1}/2 — {step === 2 ? "Xác minh OTP" : "Mật khẩu mới"}</p>
        </div>
        <button onClick={onCancel} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer bg-transparent border-none">
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </div>
      {/* Progress */}
      <div className="flex gap-2 mb-5">
        <div className={`flex-1 h-1 rounded-full transition-all ${step >= 2 ? "bg-indigo-600" : "bg-white/10"}`}></div>
        <div className={`flex-1 h-1 rounded-full transition-all ${step >= 3 ? "bg-indigo-600" : "bg-white/10"}`}></div>
      </div>
      {step === 2 && (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <Input type="text" placeholder="Nhập OTP" icon={<FontAwesomeIcon icon={faShieldHalved} />} value={otp} onChange={(e) => setOtp(e.target.value)} />
          <Button primary type="submit" className="w-full">Xác nhận OTP</Button>
        </form>
      )}
      {step === 3 && (
        <form onSubmit={handleChangePassword} className="space-y-4">
          <Input type="password" placeholder="Mật khẩu mới" icon={<FontAwesomeIcon icon={faKey} />} value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button primary type="submit" className="w-full">Đổi mật khẩu</Button>
        </form>
      )}
    </div>
  );
}
