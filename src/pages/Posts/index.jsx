import React, { useCallback, useEffect, useState } from "react";
import PostSearch from "../../components/PostSearch";
import styles from "./Posts.module.scss";
import classNames from "classnames/bind";
import { BACKEND_BASE_URL } from "../../constant";
import Input from "../../components/Input";
import Button from "../../components/Button";
import {
  faMagnifyingGlass,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Pagination from "../../components/Pagination";
import Popup from "../../components/Popup";
import PostCreate from "../../components/PostCreate";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { toast } from "react-toastify";

const cx = classNames.bind(styles);

export default function Posts() {
  const [hottestPosts, setHottestPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateNewPostPopupOpen, setIsCreateNewPostOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    document.title = "Thảo luận";
    const socket = new SockJS(`${BACKEND_BASE_URL}/ws`);
    const client = Stomp.over(socket);

    client.connect(
      {},
      () => {
        client.subscribe(`/post`, (p) => {
          setPosts((prevPosts) => [...prevPosts, JSON.parse(p.body)]);
        });
      },
      () => {
        toast.error("Có lỗi xảy ra khi kết nối WebSocket!");
      }
    );
  }, []);

  useEffect(() => {
    const fetchHottestPosts = async () => {
      try {
        const response = await fetch(`${BACKEND_BASE_URL}/api/posts/hottest`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (data.code === 200) {
          setHottestPosts(data.body);
        }
      } catch (error) {
        console.error("Error fetching hottest posts:", error);
      }
    };

    fetchHottestPosts();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className={cx("posts-container")}>
      <div className={cx("header")}>
        <div className={cx("left-buttons")}>
          <Button rounded outline>
            Bài viết của bạn
          </Button>
          {/* <Button rounded outline>
            Khoá đã học
          </Button> */}
        </div>
        <div className={cx("right-buttons")}>
          <form onSubmit={handleSearchSubmit} className={cx("search-form")}>
            <Input
              type="search"
              placeholder="Tìm kiếm"
              value={searchQuery}
              onChange={handleSearchChange}
              actionIcon={<FontAwesomeIcon icon={faMagnifyingGlass} />}
              onActionIconClick={handleSearchSubmit}
            />
          </form>

          <Button
            noBackground
            noHoverAnimation
            scaleHoverAnimation
            onClick={() => setIsCreateNewPostOpen(true)}
          >
            <FontAwesomeIcon icon={faPenToSquare} />
          </Button>
        </div>
      </div>
      <Popup
        isOpen={isCreateNewPostPopupOpen}
        title={"Đăng bài"}
        onClose={() => setIsCreateNewPostOpen(false)}
      >
        <PostCreate onClose={() => setIsCreateNewPostOpen(false)} />
      </Popup>
      <div className={cx("content")}>
        <div className={cx("hottest-posts")}>
          <h2>Bài viết nổi bật nhất 🔥</h2>
          <div className={cx("posts-list")}>
            {hottestPosts.map((post) => (
              <PostSearch hot post={post} key={post.id} />
            ))}
          </div>
        </div>
        <div className={cx("normal-posts")}>
          <h2>Bài viết mới nhất</h2>
          <div className={cx("posts-list")}>
            {posts?.map((post) => (
              <PostSearch post={post} key={post.id} />
            ))}
            <Pagination
              searchQuery={`name=${searchQuery}`}
              render={(post) => <PostSearch post={post} key={post.id} />}
              url={`${BACKEND_BASE_URL}/api/posts/search`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
