import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { BACKEND_BASE_URL } from "../../constant";
import UserInfo from "../../components/UserInfo";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faPaperPlane, faShare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import TimeDisplay from "../../components/TimeDisplay";
import { getToken } from "../../App";
import ViewMore from "../../components/ViewMore";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { toast } from "react-toastify";
import Comment from "../../components/Comment";
import Popup from "../../components/Popup";

export default function Post() {
  const { postId } = useParams();
  const [post, setPost] = useState();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const navigate = useNavigate();

  const setupWebSocket = useCallback((pId) => {
    const socket = new SockJS(`${BACKEND_BASE_URL}/ws`);
    const client = Stomp.over(socket);
    client.connect({}, () => {
      client.subscribe(`/post/${pId}/like`, (l) => { setPost((prev) => ({ ...prev, likeCount: JSON.parse(l.body) })); });
      client.subscribe(`/post/${pId}/comment`, (c) => { setComments((prev) => [JSON.parse(c.body), ...prev]); });
    }, () => { toast.error("Lỗi WebSocket!"); });
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      const token = getToken();
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const response = await fetch(`${BACKEND_BASE_URL}/api/posts/${postId}`, { method: "GET", headers });
      const data = await response.json();
      if (data.code === 200) { setPost(data.body); setupWebSocket(data.body.id); document.title = data.body.title; }
      else toast.error(data.message);
    };
    fetchPost();
  }, [postId]);

  const handleLike = async () => {
    const token = getToken();
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const url = post?.liked ? `${BACKEND_BASE_URL}/api/posts/${postId}/unlike` : `${BACKEND_BASE_URL}/api/posts/${postId}/like`;
    const method = post?.liked ? "DELETE" : "POST";
    const response = await fetch(url, { method, headers });
    const data = await response.json();
    if (data.code === 200) setPost((prev) => ({ ...prev, liked: !prev.liked }));
    else toast.error(data.message);
  };

  const handleComment = async (e) => {
    e.preventDefault();
    const token = getToken();
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const response = await fetch(`${BACKEND_BASE_URL}/api/posts/${postId}/comments/new`, {
      method: "POST", headers, body: JSON.stringify({ content: comment }),
    });
    const data = await response.json();
    if (data.code === 200) setComment("");
    else toast.error(data.message);
  };

  const handleDelete = async () => {
    const token = getToken();
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const response = await fetch(`${BACKEND_BASE_URL}/api/posts/${postId}/delete`, { method: "DELETE", headers });
    const data = await response.json();
    if (data.code === 200) navigate("/posts");
    else toast.error(data.message);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-200 py-10">
      <div className="container mx-auto px-6 max-w-3xl">
        <article className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
            <UserInfo user={post?.creator} />
            <TimeDisplay time={post?.createdAt} className="text-xs text-slate-500" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">{post?.title}</h1>
          <div className="prose prose-invert prose-sm max-w-none text-slate-300" dangerouslySetInnerHTML={{ __html: post?.content }}></div>

          <div className="flex items-center gap-3 pt-4 border-t border-white/5">
            <button onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer border
                ${post?.liked ? "bg-red-500/10 border-red-500/30 text-red-400" : "bg-white/5 border-white/10 text-slate-400 hover:text-red-400 hover:border-red-500/30"}`}>
              <FontAwesomeIcon icon={faHeart} /> {post?.likeCount}
            </button>
            <Button primary small onClick={() => { try { navigator.share({ title: "STU E-Learning", text: post?.title }); } catch {} }} rightIcon={<FontAwesomeIcon icon={faShare} />}>
              Chia sẻ
            </Button>
            {localStorage.getItem("userId") === post?.creator?.id && (
              <Button danger small onClick={() => setIsPopupOpen(true)}><FontAwesomeIcon icon={faTrashCan} /></Button>
            )}
          </div>

          <Popup title="Xác nhận xóa" onClose={() => setIsPopupOpen(false)} isOpen={isPopupOpen}>
            <p className="text-slate-400 text-sm mb-4">Bạn có chắc muốn xóa bài viết này?</p>
            <div className="flex gap-3">
              <Button outline onClick={() => setIsPopupOpen(false)}>Hủy</Button>
              <Button danger onClick={handleDelete} rightIcon={<FontAwesomeIcon icon={faTrashCan} />}>Xóa</Button>
            </div>
          </Popup>

          {/* Comment Input */}
          <form onSubmit={handleComment}>
            <Input placeholder="Bình luận" value={comment} onChange={(e) => setComment(e.target.value)}
              actionIcon={<button type="submit" className="bg-transparent border-none text-indigo-400 hover:text-indigo-300 cursor-pointer"><FontAwesomeIcon icon={faPaperPlane} /></button>} />
          </form>

          {/* Comments */}
          <div className="space-y-3">
            {comments.map((c) => <Comment key={c.id} comment={c} />)}
            <ViewMore url={`${BACKEND_BASE_URL}/api/posts/${postId}/comments`} render={(c) => <Comment key={c.id} comment={c} />} />
          </div>
        </article>
      </div>
    </div>
  );
}
