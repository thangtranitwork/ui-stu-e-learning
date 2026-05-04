import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import { BACKEND_BASE_URL, DEFAULT_AVATAR_URL } from "../../constant";
import Button from "../../components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faMessage, faUserGroup, faUserMinus, faUserPlus, faUserXmark } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import UpdateEmail from "../../components/UpdateEmail";
import UpdatePassword from "../../components/UpdatePassword";
import Loader from "../../components/Loader";
import Course from "../../components/Course";
import QuizInfo from "../../components/QuizInfo";
import ViewMore from "../../components/ViewMore";
import QuizHistory from "../../components/QuizHistory";
import { getToken } from "../../App";

export default function UserDetail() {
  const { id: paramId } = useParams();
  const location = useLocation();
  const currentUserId = localStorage.getItem("userId");
  const id = location.pathname === "/profile" ? currentUserId : paramId;

  const [user, setUser] = useState(null);
  const avatarImg = useRef();
  const [showUpdateEmail, setShowUpdateEmail] = useState(false);
  const [showUpdatePassword, setShowUpdatePassword] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const token = getToken();
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const response = await fetch(`${BACKEND_BASE_URL}/api/users/${id}`, { method: "GET", headers });
      const data = await response.json();
      if (data.code === 200) setUser(data.body);
    };
    fetchUser();
  }, [id, location.pathname]);

  const handleAvatarChange = (e) => {
    e.preventDefault();
    const formData = new FormData(); formData.append("avatar", avatarImg.current.files[0]);
    fetch(`${BACKEND_BASE_URL}/api/users/update/avatar`, { method: "PUT", body: formData, headers: { Authorization: `Bearer ${getToken()}` } })
      .then(r => r.json()).then(data => { if (data.code === 200) { setUser({ ...user, avatar: data.body }); toast.success("Avatar updated!"); } else toast.error(data.message); });
  };

  const handleFriendAction = (action, method, successMsg, stateUpdate) => {
    fetch(`${BACKEND_BASE_URL}/api/friendship/${id}/${action}`, { method, headers: { Authorization: `Bearer ${getToken()}` } })
      .then(r => r.json()).then(data => { if (data.code === 200) { setUser({ ...user, ...stateUpdate }); toast.success(successMsg); } else toast.error(data.message); });
  };

  const formatDate = (s) => { const [y, m, d] = s.split("-"); return `${d}/${m}/${y}`; };

  if (!user) return <Loader />;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-200 py-10">
      <div className="container mx-auto px-6 max-w-4xl space-y-8">
        {/* Profile Card */}
        <div className="bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl shadow-2xl overflow-hidden">
          {/* Banner */}
          <div className="h-40 bg-gradient-to-r from-indigo-600/30 to-purple-600/30 relative"></div>
          
          <div className="px-8 pb-8">
            {/* Avatar */}
            <div className="relative -mt-16 mb-4 inline-block">
              <img className="w-32 h-32 rounded-full object-cover ring-4 ring-[#0a0a0a] shadow-2xl" src={user.avatar || DEFAULT_AVATAR_URL} alt={`${user.firstname}`} />
              {currentUserId === user.id && (
                <>
                  <input type="file" name="avatar" id="avatar" ref={avatarImg} onChange={handleAvatarChange} className="hidden" />
                  <label htmlFor="avatar" className="absolute bottom-1 right-1 w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm cursor-pointer hover:bg-indigo-500 transition-colors shadow-lg">
                    <FontAwesomeIcon icon={faCamera} />
                  </label>
                </>
              )}
            </div>

            {/* Info */}
            <h1 className="text-3xl font-extrabold text-white">{user.lastname} {user.firstname}</h1>
            <p className="text-slate-400 italic mt-1">{user.bio || "Học viên STU E-Learning"}</p>
            <div className="flex flex-wrap gap-x-8 gap-y-2 mt-4 text-sm text-slate-500">
              {user.birthday && <span><strong className="text-slate-300">Ngày sinh:</strong> {formatDate(user.birthday)}</span>}
              {user.address && <span><strong className="text-slate-300">Địa chỉ:</strong> {user.address}</span>}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 mt-6">
              {currentUserId === user.id ? (
                <>
                  <Button outline to="/friends" leftIcon={<FontAwesomeIcon icon={faUserGroup} />}>Bạn bè</Button>
                  <Button primary onClick={() => window.location.href = "/profile/edit"}>Chỉnh sửa</Button>
                  {!localStorage.getItem("scope")?.includes("OAUTH2") && (
                    <>
                      <Button outline onClick={() => { setShowUpdateEmail(true); setShowUpdatePassword(false); }}>Đổi email</Button>
                      <Button outline onClick={() => { setShowUpdatePassword(true); setShowUpdateEmail(false); }}>Đổi mật khẩu</Button>
                    </>
                  )}
                </>
              ) : (
                <>
                  {user.friend ? (
                    <>
                      <Button primary to={`/chat/${id}`} rightIcon={<FontAwesomeIcon icon={faMessage} />}>Nhắn tin</Button>
                      <Button danger onClick={() => handleFriendAction("unfriend", "DELETE", "Hủy kết bạn thành công!", { friend: false })} rightIcon={<FontAwesomeIcon icon={faUserXmark} />}>Hủy kết bạn</Button>
                    </>
                  ) : user.addFriendRequestSent === 1 ? (
                    <Button outline onClick={() => handleFriendAction("cancel", "DELETE", "Đã hủy lời mời!", { addFriendRequestSent: 0 })} leftIcon={<FontAwesomeIcon icon={faUserMinus} />}>Hủy lời mời</Button>
                  ) : user.addFriendRequestSent === 0 ? (
                    <Button primary onClick={() => handleFriendAction("add", "POST", "Đã gửi lời mời!", { addFriendRequestSent: 1 })} leftIcon={<FontAwesomeIcon icon={faUserPlus} />}>Kết bạn</Button>
                  ) : user.addFriendRequestSent === -1 ? (
                    <Button primary onClick={() => handleFriendAction("accept", "PATCH", "Đã trở thành bạn bè!", { friend: true })} leftIcon={<FontAwesomeIcon icon={faUserPlus} />}>Đồng ý kết bạn</Button>
                  ) : null}
                </>
              )}
            </div>

            {/* Update Forms */}
            {showUpdateEmail && <div className="mt-6"><UpdateEmail onCancel={() => setShowUpdateEmail(false)} /></div>}
            {showUpdatePassword && <div className="mt-6"><UpdatePassword onCancel={() => setShowUpdatePassword(false)} /></div>}
          </div>
        </div>

        {/* Activity Sections */}
        {[
          { title: "Khóa học đã tạo", url: `${BACKEND_BASE_URL}/api/users/${id}/courses/created`, render: (c, i) => <Course key={i} course={c} /> },
          { title: "Khóa học đã học", url: `${BACKEND_BASE_URL}/api/users/${id}/courses/learned`, render: (c, i) => <Course key={i} course={c} /> },
          { title: "Bài kiểm tra đã tạo", url: `${BACKEND_BASE_URL}/api/users/${id}/quizzes/created`, render: (q) => <QuizInfo quiz={q} key={q.id} /> },
          { title: "Bài kiểm tra đã chơi", url: `${BACKEND_BASE_URL}/api/users/${id}/quizzes/played`, render: (aq, i) => <QuizHistory key={i} answerQuiz={aq} /> },
        ].map((section, i) => (
          <section key={i} className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
            <h2 className="text-xl font-bold text-white mb-4">{section.title}</h2>
            <div className="space-y-3"><ViewMore url={section.url} render={section.render} /></div>
          </section>
        ))}
      </div>
    </div>
  );
}
