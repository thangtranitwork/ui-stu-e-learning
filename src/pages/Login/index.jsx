import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey, faEnvelope, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/Input";
import Button from "../../components/Button";
import OAuth2Login from "../../components/OAuth2Login";
import { BACKEND_BASE_URL } from "../../constant";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getToken, setToken } from "../../App";
import moment from "moment/moment";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => { if (getToken()) { toast.info("Bạn đã đăng nhập!"); navigate("/"); } }, 300);
  }, [navigate]);

  const validateInput = () => {
    if (!email || !password) { toast.error("Vui lòng nhập đầy đủ email và password"); return false; }
    if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) { toast.error("Email không hợp lệ"); return false; }
    if (password.length < 8) { toast.error("Password gồm ít nhất 8 ký tự"); return false; }
    return true;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!validateInput()) return;
    fetch(`${BACKEND_BASE_URL}/api/auth/login`, {
      method: "POST", body: JSON.stringify({ email, password }), headers: { "Content-Type": "application/json" },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.code === 200) { toast.success("Login successful!"); setToken(data.body.accessToken); navigate("/"); }
        else if (data.code === 104) { toast.error(`Đăng nhập thất bại! Bạn còn ${data.body.remainingTry} lần thử`); }
        else if (data.code === 124) { toast.error(`Tài khoản bị khóa đến ${moment(data.body.lockoutTime).format("HH:mm DD/MM/YYYY")}`); }
        else { toast.error(data.message); }
      })
      .catch((err) => toast.error(err.message));
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-4xl bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl backdrop-blur-xl shadow-2xl overflow-hidden animate-[slideUp_0.35s_ease]">
        <div className="grid md:grid-cols-2">
          {/* Left: Login Form */}
          <form onSubmit={handleLogin} className="p-6 md:p-10 flex flex-col justify-center gap-5">
            <Link to="/" className="text-slate-500 hover:text-white transition-colors text-sm flex items-center gap-2">
              <FontAwesomeIcon icon={faArrowLeft} /> Trang chủ
            </Link>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">Đăng nhập</h2>
              <p className="text-sm text-slate-500">Chào mừng trở lại nền tảng học tập</p>
            </div>
            <div className="space-y-4 pt-2">
              <Input type="text" placeholder="Email" icon={<FontAwesomeIcon icon={faEnvelope} />} value={email} onChange={(e) => setEmail(e.target.value)} />
              <Input type="password" placeholder="Password" icon={<FontAwesomeIcon icon={faKey} />} value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Link to="/forgot-password" className="text-xs text-indigo-400 hover:text-indigo-300 self-end -mt-1">Quên mật khẩu?</Link>
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <Button primary large type="submit" className="flex-1">Đăng nhập</Button>
              <Button outline large to="/register" className="flex-1">Đăng ký</Button>
            </div>
          </form>

          {/* Right: OAuth */}
          <div className="p-6 md:p-10 flex flex-col justify-center bg-white/[0.02] border-t md:border-t-0 md:border-l border-white/5">
            <OAuth2Login />
          </div>
        </div>
      </div>
    </div>
  );
}
