import { faFacebook, faGithub, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import Button from "../Button";
import { BACKEND_BASE_URL } from "../../constant";

export default function OAuth2Login() {
  const handleOAuthLogin = (e, provider) => {
    e.preventDefault();
    window.location.href = `${BACKEND_BASE_URL}/oauth2/authorization/${provider}`;
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <p className="text-center text-sm text-slate-500 mb-2">Hoặc đăng nhập với</p>
      <button onClick={(e) => handleOAuthLogin(e, "google")}
        className="flex items-center justify-center gap-3 w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-medium hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer">
        <FontAwesomeIcon icon={faGoogle} className="text-red-400" /> Tiếp tục với Google
      </button>
      <button onClick={(e) => handleOAuthLogin(e, "facebook")}
        className="flex items-center justify-center gap-3 w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-medium hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer">
        <FontAwesomeIcon icon={faFacebook} className="text-blue-400" /> Tiếp tục với Facebook
      </button>
      <button onClick={(e) => handleOAuthLogin(e, "github")}
        className="flex items-center justify-center gap-3 w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-medium hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer">
        <FontAwesomeIcon icon={faGithub} className="text-slate-300" /> Tiếp tục với Github
      </button>
    </div>
  );
}
