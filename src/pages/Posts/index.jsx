import React, { useEffect, useState } from "react";
import PostSearch from "../../components/PostSearch";
import { BACKEND_BASE_URL } from "../../constant";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { faMagnifyingGlass, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Pagination from "../../components/Pagination";
import Popup from "../../components/Popup";
import PostCreate from "../../components/PostCreate";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { toast } from "react-toastify";

export default function Posts() {
  const [hottestPosts, setHottestPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateNewPostPopupOpen, setIsCreateNewPostOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [tab, setTab] = useState(0);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    document.title = "Thảo luận";
    const socket = new SockJS(`${BACKEND_BASE_URL}/ws`);
    const client = Stomp.over(socket);
    client.connect({}, () => {
      client.subscribe(`/post`, (p) => { setPosts((prev) => [...prev, JSON.parse(p.body)]); });
    }, () => { toast.error("Lỗi WebSocket!"); });
  }, []);

  useEffect(() => {
    fetch(`${BACKEND_BASE_URL}/api/posts/hottest`, { method: "GET", headers: { "Content-Type": "application/json" } })
      .then(r => r.json()).then(data => { if (data.code === 200) setHottestPosts(data.body); })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-200 py-10">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {["Mới nhất", ...(userId ? ["Của bạn", "Đã thích"] : [])].map((label, i) => (
              <button key={i} onClick={() => setTab(i)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer border
                  ${tab === i ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/20" : "bg-white/5 text-slate-400 border-white/10 hover:border-white/20 hover:text-white"}`}>
                {label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Input small type="search" placeholder="Tìm kiếm" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} actionIcon={<FontAwesomeIcon icon={faMagnifyingGlass} />} />
            <Button outline small onClick={() => setIsCreateNewPostOpen(true)}><FontAwesomeIcon icon={faPenToSquare} /></Button>
          </div>
        </div>

        <Popup isOpen={isCreateNewPostPopupOpen} title="Đăng bài" onClose={() => setIsCreateNewPostOpen(false)}>
          <PostCreate onClose={() => setIsCreateNewPostOpen(false)} />
        </Popup>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 lg:order-2">
            <section className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl sticky top-24">
              <div className="flex items-center gap-2 mb-6"><span className="text-lg">🔥</span><h2 className="text-xl font-bold text-white">Nổi bật nhất</h2></div>
              <div className="space-y-3">{hottestPosts.map((post) => <PostSearch hot post={post} key={post.id} />)}</div>
            </section>
          </div>
          <div className="lg:col-span-8 lg:order-1">
            <section className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <h2 className="text-2xl font-bold text-white mb-6">{tab === 0 ? "Bài viết mới nhất" : tab === 1 ? "Bài viết đã đăng" : "Bài viết đã thích"}</h2>
              <div className="space-y-3">
                {posts?.map((post) => <PostSearch post={post} key={post.id} />)}
                {tab === 0 && <Pagination searchQuery={`name=${searchQuery}`} render={(post) => <PostSearch post={post} key={post.id} />} url={`${BACKEND_BASE_URL}/api/posts/search`} />}
                {tab === 1 && <Pagination render={(post) => <PostSearch post={post} key={post.id} />} url={`${BACKEND_BASE_URL}/api/posts/created`} attachToken />}
                {tab === 2 && <Pagination render={(post) => <PostSearch post={post} key={post.id} />} url={`${BACKEND_BASE_URL}/api/posts/liked`} attachToken />}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
