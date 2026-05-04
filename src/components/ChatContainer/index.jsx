import React, { useState, useEffect, useRef, useLayoutEffect, useCallback } from "react";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { getToken } from "../../App";
import { toast } from "react-toastify";
import { BACKEND_BASE_URL } from "../../constant";
import Message from "../Message";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faImage, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import UserInfo from "../UserInfo";
import Button from "../Button";
import Popup from "../Popup";
import CameraCapture from "../CameraCapture";

function ChatContainer({ targetUserId }) {
  const [stompClient, setStompClient] = useState(null);
  const userId = localStorage.getItem("userId");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [target, setTarget] = useState();
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [file, setFile] = useState(null);
  const [isUploadImagePopupOpen, setIsUploadImagePopupOpen] = useState(false);
  const [isCameraCapturePopupOpen, setIsCameraCapturePopupOpen] = useState(false);
  const messageContainerRef = useRef(null);
  const prevScrollHeight = useRef(0);
  const [friendshipId, setFriendshipId] = useState("");
  let isSending = false;

  const setupWebSocket = useCallback((fId) => {
    const socket = new SockJS(`${BACKEND_BASE_URL}/ws`);
    const client = Stomp.over(socket);
    client.connect({}, () => {
      setStompClient(client);
      client.subscribe(`/user/${fId}/private`, (message) => {
        setMessages((prev) => [...prev, JSON.parse(message.body)]);
      });
    }, () => { toast.error("Lỗi WebSocket!"); });
  }, []);

  useEffect(() => {
    const fetchFriendShip = async () => {
      const response = await fetch(`${BACKEND_BASE_URL}/api/friendship/${targetUserId}`, {
        method: "GET", headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
      });
      const data = await response.json();
      if (data.code === 200) {
        if (!data.body.accepted) { toast.warn("Chưa là bạn bè!"); return; }
        const { id, a, b } = data.body;
        setFriendshipId(id);
        setTarget(a.id === userId ? b : a);
        setupWebSocket(id);
        fetchHistory(0, id);
      } else toast.error(data.message);
    };
    fetchFriendShip();
    return () => { setPage(0); setHasMore(true); setMessages([]); if (stompClient) stompClient.disconnect(); };
  }, [targetUserId]);

  const fetchHistory = async (page, fId) => {
    if (!hasMore) return;
    const mc = messageContainerRef.current;
    if (mc) prevScrollHeight.current = mc.scrollHeight;
    const response = await fetch(`${BACKEND_BASE_URL}/api/chat/${fId}/history?page=${page}`, {
      method: "GET", headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
    });
    const data = await response.json();
    if (data.code === 200) { setMessages((prev) => [...data.body.content.reverse(), ...prev]); setHasMore(!data.body.last); }
    else toast.error(data.message);
  };

  useLayoutEffect(() => {
    const mc = messageContainerRef.current;
    if (mc && prevScrollHeight.current) mc.scrollTop = mc.scrollHeight - prevScrollHeight.current;
    else if (mc) mc.scrollTop = mc.scrollHeight;
  }, [messages]);

  const handleScroll = () => {
    if (messageContainerRef.current.scrollTop === 0 && hasMore) {
      setPage((prev) => { const np = prev + 1; fetchHistory(np, friendshipId); return np; });
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (message.trim() === "" || isSending) return;
    isSending = true;
    const response = await fetch(`${BACKEND_BASE_URL}/api/chat/${friendshipId}`, {
      method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({ content: message }),
    });
    const data = await response.json();
    if (data.code === 200) setMessage("");
    else toast.error(data.message);
    isSending = false;
  };

  const handleFileChange = (e) => { const f = e.target.files[0]; if (f) { setFile(f); setIsUploadImagePopupOpen(true); } };
  const handleImageChange = () => {
    const fi = document.createElement("input"); fi.type = "file"; fi.accept = "image/*";
    fi.onchange = (e) => { const f = e.target.files[0]; if (f) setFile(f); }; fi.click();
  };

  const sendImage = async (f) => {
    if (!f || isSending) return; isSending = true;
    const formData = new FormData(); formData.append("file", f); formData.append("friendshipId", friendshipId);
    const response = await fetch(`${BACKEND_BASE_URL}/api/chat/image`, {
      method: "POST", headers: { Authorization: `Bearer ${getToken()}` }, body: formData,
    });
    const data = await response.json();
    if (data.code === 200) { setIsUploadImagePopupOpen(false); setIsCameraCapturePopupOpen(false); setFile(null); }
    else toast.error(data.message);
    isSending = false;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 py-3 border-b border-white/5 flex items-center gap-3 flex-shrink-0 bg-white/[0.02]">
        <UserInfo user={target} />
      </div>

      {/* Messages — takes all remaining space, scrolls */}
      <div
        className="flex-1 overflow-y-auto overscroll-contain px-5 py-4 space-y-1"
        onScroll={handleScroll}
        ref={messageContainerRef}
      >
        {hasMore && messages.length > 0 && (
          <p className="text-center text-xs text-slate-600 py-2">Cuộn lên để xem thêm...</p>
        )}
        {messages.map((msg) => (
          <Message key={msg.id} message={msg} own={msg.sender.id === userId} />
        ))}
      </div>

      <Popup isOpen={isUploadImagePopupOpen} onClose={() => setIsUploadImagePopupOpen(false)} title="Xem trước">
        {file && <img src={URL.createObjectURL(file)} alt="Preview" className="max-w-full max-h-72 rounded-xl mb-4 mx-auto block" />}
        <div className="flex gap-3 justify-end">
          <Button outline small onClick={handleImageChange}>Thay ảnh</Button>
          <Button primary small onClick={() => sendImage(file)}>Gửi</Button>
        </div>
      </Popup>

      <Popup isOpen={isCameraCapturePopupOpen} onClose={() => setIsCameraCapturePopupOpen(false)} title="Chụp ảnh">
        <CameraCapture onCapture={(f) => sendImage(f)} />
      </Popup>

      {/* Input bar — always at bottom */}
      <form onSubmit={sendMessage} className="px-4 py-3 border-t border-white/5 flex items-center gap-2 flex-shrink-0 bg-white/[0.02]">
        <input type="file" id="chatImage" accept="image/*" onChange={handleFileChange} className="hidden" />
        <button
          type="button"
          onClick={() => setIsCameraCapturePopupOpen(true)}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer border-none flex-shrink-0"
        >
          <FontAwesomeIcon icon={faCamera} />
        </button>
        <label
          htmlFor="chatImage"
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer flex-shrink-0"
        >
          <FontAwesomeIcon icon={faImage} />
        </label>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Nhắn tin..."
          className="flex-1 min-w-0 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none"
        />
        <button
          type="submit"
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 transition-all cursor-pointer border-none shadow-lg shadow-indigo-500/20 flex-shrink-0"
        >
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </form>
    </div>
  );
}

export default ChatContainer;
