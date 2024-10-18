import classNames from "classnames/bind";
import styles from "./Post.module.scss";
import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { BACKEND_BASE_URL } from "../../constant";
import UserInfo from "../../components/UserInfo";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faPaperPlane,
  faShare,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import TimeDisplay from "../../components/TimeDisplay";
import { getToken } from "../../App";
import ViewMore from "../../components/ViewMore";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { toast } from "react-toastify";
import Comment from "../../components/Comment";
import Popup from "../../components/Popup";
export default function Post() {
  const cx = classNames.bind(styles);
  const { postId } = useParams();
  const [post, setPost] = useState();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const navigate = useNavigate();

  const setupWebSocket = useCallback((pId) => {
    const socket = new SockJS(`${BACKEND_BASE_URL}/ws`);
    const client = Stomp.over(socket);

    client.connect(
      {},
      () => {
        client.subscribe(`/post/${pId}/like`, (l) => {
          setPost((prevPost) => ({
            ...prevPost,
            likeCount: JSON.parse(l.body),
          }));
        });
        client.subscribe(`/post/${pId}/comment`, (c) => {
          setComments((prevComments) => [JSON.parse(c.body), ...prevComments]);
        });
      },
      () => {
        toast.error("Có lỗi xảy ra khi kết nối WebSocket!");
      }
    );
  }, []);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = getToken();
        const headers = {
          "Content-Type": "application/json",
        };

        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(
          `${BACKEND_BASE_URL}/api/posts/${postId}`,
          {
            method: "GET",
            headers: headers,
          }
        );
        const data = await response.json();

        if (data.code === 200) {
          setPost(data.body);
          setupWebSocket(data.body.id);
          document.title = data.body.title;
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchCourse();
  }, [postId]);

  const handleLikeButtonClick = async () => {
    if (!post?.liked) {
      try {
        const token = getToken();
        const headers = {
          "Content-Type": "application/json",
        };

        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(
          `${BACKEND_BASE_URL}/api/posts/${postId}/like`,
          {
            method: "POST",
            headers: headers,
          }
        );
        const data = await response.json();

        if (data.code === 200) {
          setPost((prevPost) => ({
            ...prevPost,
            liked: true,
          }));
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    } else {
      try {
        const token = getToken();
        const headers = {
          "Content-Type": "application/json",
        };

        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(
          `${BACKEND_BASE_URL}/api/posts/${postId}/unlike`,
          {
            method: "DELETE",
            headers: headers,
          }
        );
        const data = await response.json();

        if (data.code === 200) {
          setPost((prevPost) => ({
            ...prevPost,
            liked: false,
          }));
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    try {
      const token = getToken();
      const headers = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(
        `${BACKEND_BASE_URL}/api/posts/${postId}/comments/new`,
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify({
            content: comment,
          }),
        }
      );
      const data = await response.json();

      if (data.code === 200) {
        setComment("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching post:", error);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: "STU E-Learning",
        text: post?.title,
      });
    } catch {}
  };

  const handleDelete = async () => {
    try {
      const token = getToken();
      const headers = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(
        `${BACKEND_BASE_URL}/api/posts/${postId}/delete`,
        {
          method: "DELETE",
          headers: headers,
        }
      );
      const data = await response.json();
      if (data.code === 200) {
        navigate("/posts");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error deleteing post:", error);
    }
  };

  return (
    <div className={cx("wrapper")}>
      <UserInfo user={post?.creator}></UserInfo>
      <h2>{post?.title}</h2>
      <div
        className={cx("content")}
        dangerouslySetInnerHTML={{ __html: post?.content }}
      ></div>
      <TimeDisplay time={post?.createdAt} />
      <div className={cx("act-btn")}>
        <Button
          className={cx("like", { liked: post?.liked })}
          onClick={handleLikeButtonClick}
          noBackground
          scaleHoverAnimation
          leftIcon={<FontAwesomeIcon icon={faHeart} />}
        >
          {post?.likeCount}
        </Button>
        <Popup
          title={"Xác nhận"}
          onClose={() => setIsPopupOpen(false)}
          isOpen={isPopupOpen}
        >
          <Button primary onClick={() => setIsPopupOpen(false)}>
            Hủy
          </Button>
          <Button
            secondary
            onClick={handleDelete}
            rightIcon={<FontAwesomeIcon icon={faTrashCan} />}
          >
            Xóa
          </Button>
        </Popup>
        <Button
          className={cx("share-btn")}
          primary
          onClick={handleShare}
          rightIcon={<FontAwesomeIcon icon={faShare} />}
        >
          Chia sẻ
        </Button>
        {localStorage.getItem("userId") === post?.creator.id && (
          <Button
            danger
            className={cx("delete-btn")}
            onClick={() => setIsPopupOpen(true)}
          >
            <FontAwesomeIcon icon={faTrashCan} />
          </Button>
        )}
      </div>
      <form onSubmit={handleComment}>
        <Input
          placeholder={"Bình luận"}
          actionIcon={
            <Button noBackground scaleHoverAnimation type="submit">
              <FontAwesomeIcon icon={faPaperPlane} />
            </Button>
          }
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </form>
      {comments.map((c) => (
        <Comment key={c.id} comment={c} />
      ))}
      <ViewMore
        url={`${BACKEND_BASE_URL}/api/posts/${postId}/comments`}
        render={(c) => <Comment key={c.id} comment={c} />}
      ></ViewMore>
    </div>
  );
}
