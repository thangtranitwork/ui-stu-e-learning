import React, { useCallback, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Link, useLocation } from "react-router-dom";
import {
  faBars,
  faCircleUser,
  faMessage,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { getToken } from "../../../../App";
import NumberDisplay from "../../../NumberDisplay";
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { BACKEND_BASE_URL } from "../../../../constant";
import { toast } from "react-toastify";

const Header = () => {
  const toggler = useRef();
  const location = useLocation(); // Sử dụng useLocation để lấy đường dẫn hiện tại
  const hasToken = getToken() !== null;
  const [notReadMessagesCount, setNotReadMessagesCount] = useState(0);
  const [stompClient, setStompClient] = useState(null);

  const userId = localStorage.getItem("userId");
  const handleLinkClick = () => {
    if (toggler.current.checked) {
      toggler.current.checked = false;
    }
  };

  const setupWebSocket = useCallback(() => {
    const client = Stomp.over(() => new SockJS(`${BACKEND_BASE_URL}/ws`)); // Đưa vào một factory

    //client.debug = () => {};
    client.connect(
      {},
      () => {
        setStompClient(client);
        client.subscribe(`/user/${userId}/chat/count`, (c) => {
          setNotReadMessagesCount(JSON.parse(c.body));
        });
      },
      () => {
        toast.error("Có lỗi xảy ra khi kết nối WebSocket!");
      }
    );
  }, []);

  const fetchNotReadMessagesCount = async () => {
    try {
      const response = await fetch(
        `${BACKEND_BASE_URL}/api/chat/notReadMessagesCount`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      const data = await response.json();

      if (data.code === 200) {
        setNotReadMessagesCount(data.body);
        setupWebSocket();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error :", error);
      toast.error("Có lỗi xảy ra!");
    }
  };

  useEffect(() => {
    fetchNotReadMessagesCount();
    return () => {
      if (stompClient) {
        stompClient.disconnect();
      }
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/60 backdrop-blur-xl transition-all duration-300 shadow-sm text-slate-100">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
            STU
          </div>
          <span className="font-semibold text-lg tracking-tight hidden sm:block group-hover:text-indigo-400 transition-colors">E-Learning</span>
        </Link>

        {/* Mobile Toggle */}
        <input type="checkbox" id="toggler" ref={toggler} className="hidden peer" />
        <label htmlFor="toggler" className="md:hidden cursor-pointer w-10 h-10 flex flex-col justify-center items-center gap-[5px] z-50">
          <div className="w-6 h-[2px] bg-white rounded transition-transform origin-center peer-checked:rotate-45 peer-checked:translate-y-[7px]"></div>
          <div className="w-6 h-[2px] bg-white rounded transition-opacity peer-checked:opacity-0"></div>
          <div className="w-6 h-[2px] bg-white rounded transition-transform origin-center peer-checked:-rotate-45 peer-checked:-translate-y-[7px]"></div>
          {notReadMessagesCount > 0 && (
            <span className="absolute top-2 right-4 bg-red-500 text-xs font-bold px-1.5 rounded-full ring-2 ring-black">
              {notReadMessagesCount}
            </span>
          )}
        </label>

        {/* Navigation */}
        <nav className="fixed inset-0 bg-black/95 flex flex-col items-center justify-center gap-6 opacity-0 pointer-events-none transition-opacity duration-300 peer-checked:opacity-100 peer-checked:pointer-events-auto md:static md:bg-transparent md:flex-row md:opacity-100 md:pointer-events-auto md:w-auto">
          
          <Link to="/" onClick={handleLinkClick} className={`text-sm font-medium transition-colors hover:text-indigo-400 ${location.pathname === "/" ? "text-indigo-400" : "text-slate-300"}`}>Trang chủ</Link>
          <Link to="/courses" onClick={handleLinkClick} className={`text-sm font-medium transition-colors hover:text-indigo-400 ${location.pathname === "/courses" ? "text-indigo-400" : "text-slate-300"}`}>Khoá học</Link>
          <Link to="/quizzes" onClick={handleLinkClick} className={`text-sm font-medium transition-colors hover:text-indigo-400 ${location.pathname === "/quizzes" ? "text-indigo-400" : "text-slate-300"}`}>Trắc nghiệm</Link>
          <Link to="/posts" onClick={handleLinkClick} className={`text-sm font-medium transition-colors hover:text-indigo-400 ${location.pathname === "/posts" ? "text-indigo-400" : "text-slate-300"}`}>Thảo luận</Link>

          {!hasToken ? (
            <div className="flex flex-col md:flex-row items-center gap-4 mt-6 md:mt-0 md:ml-6 border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 pl-0 md:pl-6">
              <Link to="/login" onClick={handleLinkClick} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Đăng nhập</Link>
              <Link to="/register" onClick={handleLinkClick} className="px-4 py-2 bg-white text-black text-sm font-semibold rounded-full hover:bg-slate-200 transition-colors shadow-lg">Đăng ký</Link>
            </div>
          ) : (
            <div className="flex items-center gap-4 mt-6 md:mt-0 md:ml-6 border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 pl-0 md:pl-6">
              {localStorage.getItem("scope")?.includes("ADMIN") && (
                <Link to="/admin" onClick={handleLinkClick} className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 hover:bg-indigo-500/20 text-slate-300 hover:text-indigo-400 transition-all">
                  <span className="text-xs font-bold">A</span>
                </Link>
              )}
              
              <Link to="/chat" onClick={handleLinkClick} className="relative w-9 h-9 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all">
                <FontAwesomeIcon icon={faMessage} />
                {notReadMessagesCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-black shadow-sm">
                    {notReadMessagesCount}
                  </span>
                )}
              </Link>
              
              <Link to="/profile" onClick={handleLinkClick} className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all">
                <FontAwesomeIcon icon={faCircleUser} className="text-lg" />
              </Link>

              <Link to="/logout" onClick={handleLinkClick} className="w-9 h-9 flex items-center justify-center rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all ml-2">
                <FontAwesomeIcon icon={faRightFromBracket} />
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
