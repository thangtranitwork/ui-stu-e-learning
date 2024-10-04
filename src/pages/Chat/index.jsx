import React, {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  useCallback,
} from "react";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { useParams } from "react-router-dom";
import { getToken } from "../../App";
import { toast } from "react-toastify";
import { BACKEND_BASE_URL } from "../../constant";
import Message from "../../components/Message";
import Input from "../../components/Input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faImage,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./Chat.module.scss";
import classNames from "classnames/bind";
import UserInfo from "../../components/UserInfo";
import Button from "../../components/Button";
import Popup from "../../components/Popup";
import CameraCapture from "../../components/CameraCapture";

const cx = classNames.bind(styles);

function ChatRoom() {
  const [stompClient, setStompClient] = useState(null);
  const userId = localStorage.getItem("userId");
  const { targetUserId } = useParams();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [target, setTarget] = useState();
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [file, setFile] = useState(null);
  const [isUploadImagePopupOpen, setIsUploadImagePopupOpen] = useState(false);
  const [isCameraCapturePopupOpen, setIsCameraCapturePopupOpen] =
    useState(false);
  const messageContainerRef = useRef(null);
  const prevScrollHeight = useRef(0);
  const [friendshipId, setFriendshipId] = useState("");
  let isSending = false;

  // Setup WebSocket connection
  const setupWebSocket = useCallback((fId) => {
    const socket = new SockJS(`${BACKEND_BASE_URL}/ws`);
    const client = Stomp.over(socket);

    client.connect(
      {},
      () => {
        setStompClient(client);
        client.subscribe(`/user/${fId}/private`, (message) => {
          const receivedMessage = JSON.parse(message.body);
          setMessages((prevMessages) => [...prevMessages, receivedMessage]);
        });
      },
      () => {
        toast.error("Có lỗi xảy ra khi kết nối WebSocket!");
      }
    );
  }, []);

  // Fetch friendship details and message history
  useEffect(() => {
    const fetchFriendShip = async () => {
      try {
        const response = await fetch(
          `${BACKEND_BASE_URL}/api/friendship/${targetUserId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getToken()}`,
            },
          }
        );

        const data = await response.json();
        if (data.code === 200) {
          if (!data.body.accepted) {
            toast.warn("Chưa là bạn bè với người dùng này!");
            return;
          }

          const { id, a, b } = data.body;
          setFriendshipId(id);
          setTarget(a.id === userId ? b : a);
          setupWebSocket(id);
          fetchHistory(0, id);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.error("Có lỗi ", error);
        toast.error("Không thể tải thông tin bạn bè");
      }
    };

    fetchFriendShip();

    return () => {
      if (stompClient) {
        stompClient.disconnect();
      }
    };
  }, [targetUserId, setupWebSocket, userId]);

  // Fetch message history
  const fetchHistory = async (page, fId) => {
    if (!hasMore) return;

    const messageContainer = messageContainerRef.current;
    if (messageContainer) {
      prevScrollHeight.current = messageContainer.scrollHeight;
    }

    try {
      const response = await fetch(
        `${BACKEND_BASE_URL}/api/chat/${fId}/history?page=${page}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      const data = await response.json();
      if (data.code === 200) {
        setMessages((prevMessages) => [
          ...data.body.content.reverse(),
          ...prevMessages,
        ]);
        setHasMore(!data.body.last);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Có lỗi ", error);
      toast.error("Không thể tải lịch sử tin nhắn");
    }
  };

  // Scroll to the bottom of the message container
  useLayoutEffect(() => {
    const messageContainer = messageContainerRef.current;

    if (messageContainer && prevScrollHeight.current) {
      const newScrollHeight = messageContainer.scrollHeight;
      messageContainer.scrollTop = newScrollHeight - prevScrollHeight.current;
    }
  }, [messages]);

  // Handle scroll to load more messages
  const handleScroll = () => {
    if (messageContainerRef.current.scrollTop === 0 && hasMore) {
      setPage((prevPage) => {
        const newPage = prevPage + 1;
        fetchHistory(newPage, friendshipId);
        return newPage;
      });
    }
  };

  // Send a message
  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() === "" || !stompClient) return;

    const msg = {
      friendshipId,
      content: message,
    };
    stompClient.send(
      "/app/chat",
      { Authorization: `Bearer ${getToken()}` },
      JSON.stringify(msg)
    );
    setMessage("");
  };

  // Handle file selection for image upload
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setIsUploadImagePopupOpen(true);
    }
  };

  // Trigger image selection
  const handleImageChange = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = (e) => {
      const newFile = e.target.files[0];
      if (newFile) setFile(newFile);
    };
    fileInput.click();
  };

  // Send the selected image
  const sendImage = async (f) => {
    if (!f) return;
    if (isSending) return;
    isSending = true;
    const formData = new FormData();
    formData.append("file", f);
    formData.append("friendshipId", friendshipId);

    try {
      const response = await fetch(`${BACKEND_BASE_URL}/api/chat/image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (data.code === 200) {
        setIsUploadImagePopupOpen(false);
        setFile(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error sending image:", error);
      toast.error("Failed to send image");
    } finally {
      isSending = false;
    }
  };

  return (
    <div className={cx("chat-container")}>
      <UserInfo className={cx("user")} user={target} />
      <div
        className={cx("history-container")}
        onScroll={handleScroll}
        ref={messageContainerRef}
      >
        {messages.map((msg) => (
          <Message key={msg.id} message={msg} own={msg.sender.id === userId} />
        ))}
      </div>
      <Popup
        isOpen={isUploadImagePopupOpen}
        onClose={() => setIsUploadImagePopupOpen(false)}
        title={"Xem trước"}
      >
        {file && (
          <div>
            <img
              src={URL.createObjectURL(file)}
              alt="Preview"
              style={{ maxWidth: "100%", maxHeight: "300px" }}
            />
          </div>
        )}
        <Button primary onClick={() => sendImage(file)}>
          Gửi
        </Button>

        <Button secondary onClick={handleImageChange}>
          Thay ảnh
        </Button>
      </Popup>

      <Popup
        isOpen={isCameraCapturePopupOpen}
        onClose={() => setIsCameraCapturePopupOpen(false)}
        title={"Chụp ảnh"}
      >
        <CameraCapture onCapture={sendImage} />
      </Popup>
      <form onSubmit={sendMessage} className={cx("form")}>
        <span className={cx("image")}>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <label htmlFor="image">
            <FontAwesomeIcon className={cx("icon")} icon={faImage} />
          </label>
        </span>
        <span
          onClick={() => setIsCameraCapturePopupOpen(true)}
          className={cx("camera")}
        >
          <FontAwesomeIcon className={cx("icon")} icon={faCamera} />
        </span>
        <Input
          otherClass={cx("text")}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={"Nhắn tin"}
          actionIcon={
            <Button noBackground scaleHoverAnimation type="submit">
              <FontAwesomeIcon icon={faPaperPlane} />
            </Button>
          }
        />
      </form>
    </div>
  );
}

export default ChatRoom;
