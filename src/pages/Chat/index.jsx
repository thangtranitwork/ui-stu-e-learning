import React, { useState, useCallback, useEffect } from "react";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { toast } from "react-toastify";
import { BACKEND_BASE_URL } from "../../constant";
import styles from "./Chat.module.scss";
import classNames from "classnames/bind";
import { getToken } from "../../App";
import UserInfo from "../../components/UserInfo";
import TimeDisplay from "../../components/TimeDisplay";
import ChatContainer from "../../components/ChatContainer";
import NumberDisplay from "../../components/NumberDisplay";
import Button from "../../components/Button";
import { useParams, useHistory, useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);

function Chat() {
  const [stompClient, setStompClient] = useState(null);
  const userId = localStorage.getItem("userId");
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [chat, setChat] = useState([]);
  const { id } = useParams(); // Lấy id từ URL
  const navigate = useNavigate();
  const [selectedChat, setSelectedChat] = useState(id || ""); // Sử dụng id từ URL làm giá trị ban đầu

  const setupWebSocket = useCallback(() => {
    const client = Stomp.over(() => new SockJS(`${BACKEND_BASE_URL}/ws`)); // Đưa vào một factory

    client.debug = () => {};
    client.connect(
      {},
      () => {
        setStompClient(client);
        client.subscribe(`/user/${userId}/chat`, (c) => {
          const newChat = JSON.parse(c.body); // Parse the new message received

          setChat((prevChats) => {
            const existingChatIndex = prevChats.findIndex(
              (chat) => chat.friend.id === newChat.friend.id
            );

            if (existingChatIndex !== -1) {
              // If the chat already exists, remove it from its current position
              const updatedChats = [...prevChats];
              updatedChats.splice(existingChatIndex, 1);
              return [newChat, ...updatedChats]; // Add it to the top
            } else {
              // If it's a new chat, just add it to the top
              return [newChat, ...prevChats];
            }
          });
        });
      },
      () => {
        toast.error("Có lỗi xảy ra khi kết nối WebSocket!");
      }
    );
  }, []);

  const fetchChat = async () => {
    try {
      const response = await fetch(
        `${BACKEND_BASE_URL}/api/chat/search?name=${search}&page=${page}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      const data = await response.json();

      if (data.code === 200) {
        setChat(data.body.content);

        // Nếu không có id trong URL, chọn chat đầu tiên
        if (!id && data.body.content.length > 0) {
          handleChatClick(data.body.content[0].friend.id);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error :", error);
      toast.error("Có lỗi xảy ra!");
    }
  };

  useEffect(() => {
    document.title = "Trò chuyện";
    setupWebSocket();
    fetchChat();

    return () => {
      if (stompClient) {
        stompClient.disconnect();
      }
    };
  }, [setupWebSocket, page, search]); // Thêm setupWebSocket để tránh lỗi dependencies

  useEffect(() => {
    // Cập nhật selectedChat khi id trong URL thay đổi
    if (id) {
      setSelectedChat(id);
    }
  }, [id]);

  const handleChatClick = (friendId) => {
    setSelectedChat(friendId);

    // Cập nhật URL khi người dùng chọn chat khác
    navigate(`/chat/${friendId}`);

    // Cập nhật trạng thái chat, đặt notReadMessagesCount về 0 cho chat được nhấp
    setChat((prevChats) =>
      prevChats.map((chat) =>
        chat.friend.id === friendId
          ? { ...chat, notReadMessagesCount: 0 }
          : chat
      )
    );
  };

  return (
    <div className={cx("wrapper")}>
      {chat?.length > 0 ? (
        <>
          <div className={cx("chat-list")}>
            {chat?.map((c) => (
              <div
                className={cx("chat", {
                  active: selectedChat === c?.friend?.id,
                })}
                key={c?.friend?.id}
                onClick={() => handleChatClick(c?.friend?.id)}
              >
                <UserInfo className={cx("user")} user={c?.friend} />
                {c?.notReadMessagesCount > 0 && (
                  <span className={cx("red")}>
                    <NumberDisplay value={c?.notReadMessagesCount} />
                  </span>
                )}
                <div className={cx("message")}>
                  {c?.message ? (
                    <>
                      {c?.message?.sender?.id === userId
                        ? "Bạn: "
                        : c?.message?.sender?.firstname + ": "}
                      {c?.message?.type === "IMAGE"
                        ? "Đã gửi một ảnh"
                        : c?.message?.content}
                      <br></br>
                      <TimeDisplay time={c?.message?.createdAt} />
                    </>
                  ) : (
                    "Hãy bắt đầu trò chuyện"
                  )}
                </div>
                <hr />
              </div>
            ))}
          </div>
          {chat?.length > 0 && (
            <div className={cx("chat-container")}>
              <ChatContainer targetUserId={selectedChat} />
            </div>
          )}
        </>
      ) : (
        <div className={cx("add-friend")}>
          <em>Chưa có bạn bè?</em>
          <Button primary to={"/friends"}>
            Kết bạn
          </Button>
        </div>
      )}
    </div>
  );
}

export default Chat;
