import React, { useState, useCallback, useEffect } from "react";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { toast } from "react-toastify";
import { BACKEND_BASE_URL } from "../../constant";
import { getToken } from "../../App";
import UserInfo from "../../components/UserInfo";
import TimeDisplay from "../../components/TimeDisplay";
import ChatContainer from "../../components/ChatContainer";
import NumberDisplay from "../../components/NumberDisplay";
import Button from "../../components/Button";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

function Chat() {
  const [stompClient, setStompClient] = useState(null);
  const userId = localStorage.getItem("userId");
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [chat, setChat] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedChat, setSelectedChat] = useState(id || "");

  const setupWebSocket = useCallback(() => {
    const client = Stomp.over(() => new SockJS(`${BACKEND_BASE_URL}/ws`));
    client.debug = () => {};
    client.connect({}, () => {
      setStompClient(client);
      client.subscribe(`/user/${userId}/chat`, (c) => {
        const newChat = JSON.parse(c.body);
        setChat((prev) => {
          const idx = prev.findIndex((ch) => ch.friend.id === newChat.friend.id);
          if (idx !== -1) { const updated = [...prev]; updated.splice(idx, 1); return [newChat, ...updated]; }
          return [newChat, ...prev];
        });
      });
    }, () => { toast.error("Lỗi WebSocket!"); });
  }, []);

  const fetchChat = async () => {
    const response = await fetch(`${BACKEND_BASE_URL}/api/chat/search?name=${search}&page=${page}`, {
      method: "GET", headers: { Authorization: `Bearer ${getToken()}` },
    });
    const data = await response.json();
    if (data.code === 200) {
      setChat(data.body.content);
      if (!id && data.body.content.length > 0) handleChatClick(data.body.content[0].friend.id);
    } else toast.error(data.message);
  };

  useEffect(() => {
    document.title = "Trò chuyện";
    setupWebSocket();
    fetchChat();
    return () => { if (stompClient) stompClient.disconnect(); };
  }, [setupWebSocket, page, search]);

  useEffect(() => { if (id) setSelectedChat(id); }, [id]);

  const handleChatClick = (friendId) => {
    setSelectedChat(friendId);
    navigate(`/chat/${friendId}`);
    setChat((prev) => prev.map((ch) => ch.friend.id === friendId ? { ...ch, notReadMessagesCount: 0 } : ch));
  };

  return (
    <div className="h-[calc(100vh-5rem)] bg-[#0a0a0a] text-slate-200">
      <div className="container mx-auto px-4 md:px-6 h-full max-w-6xl py-4">
        <div className="bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl backdrop-blur-xl shadow-2xl overflow-hidden h-full flex flex-col">
          {chat?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-12 flex-1 min-h-0">
              {/* ── Chat List ── */}
              <div className={`md:col-span-4 border-r border-white/5 flex flex-col min-h-0
                ${selectedChat ? "hidden md:flex" : "flex"}`}>
                {/* Search */}
                <div className="p-3 border-b border-white/5 flex-shrink-0">
                  <input
                    type="text" placeholder="Tìm bạn bè..." value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                  />
                </div>

                {/* Conversation list — takes remaining height, scrolls */}
                <div className="flex-1 overflow-y-auto overscroll-contain">
                  {chat?.map((c) => (
                    <div
                      key={c?.friend?.id}
                      onClick={() => handleChatClick(c?.friend?.id)}
                      className={`px-4 py-3.5 cursor-pointer transition-all border-b border-white/5 hover:bg-white/5
                        ${selectedChat === c?.friend?.id ? "bg-indigo-500/10 border-l-2 border-l-indigo-500" : ""}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <UserInfo user={c?.friend} />
                        {c?.notReadMessagesCount > 0 && (
                          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white px-1.5">
                            <NumberDisplay value={c?.notReadMessagesCount} />
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 truncate pl-9">
                        {c?.message ? (
                          <>
                            {c?.message?.sender?.id === userId ? "Bạn: " : c?.message?.sender?.firstname + ": "}
                            {c?.message?.type === "IMAGE" ? "Đã gửi ảnh" : c?.message?.content}
                          </>
                        ) : "Bắt đầu trò chuyện"}
                      </p>
                      {c?.message && <TimeDisplay time={c?.message?.createdAt} className="text-[10px] text-slate-600 pl-9 block" />}
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Chat Area ── */}
              <div className={`md:col-span-8 min-h-0 flex flex-col
                ${selectedChat ? "flex" : "hidden md:flex"}`}>
                {/* Mobile back button */}
                <button
                  onClick={() => setSelectedChat("")}
                  className="md:hidden flex items-center gap-2 px-4 py-2 text-sm text-slate-400 hover:text-white border-b border-white/5 bg-transparent border-x-0 border-t-0 cursor-pointer"
                >
                  <FontAwesomeIcon icon={faArrowLeft} /> Danh sách
                </button>
                <div className="flex-1 min-h-0">
                  <ChatContainer targetUserId={selectedChat} />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center flex-1 gap-4">
              <p className="text-slate-500">Chưa có cuộc trò chuyện nào</p>
              <Button primary to="/friends">Kết bạn</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Chat;
