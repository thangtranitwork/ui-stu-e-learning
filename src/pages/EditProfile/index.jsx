import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faCalendar, faHome, faInfoCircle, faImage, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { toast } from "react-toastify";
import { BACKEND_BASE_URL } from "../../constant";
import { getToken } from "../../App";

export default function EditProfile() {
  const [user, setUser] = useState({ firstname: "", lastname: "", birthday: "", address: "", bio: "" });
  const [avatar, setAvatar] = useState();
  const [originalUser, setOriginalUser] = useState(null);
  const avatarImg = useRef();
  const navigate = useNavigate();

  useEffect(() => { document.title = "Chỉnh sửa thông tin"; }, []);
  useEffect(() => {
    fetch(`${BACKEND_BASE_URL}/api/users/${localStorage.getItem("userId")}`, { headers: { Authorization: `Bearer ${getToken()}` } })
      .then(r => r.json()).then(data => {
        if (data.code === 200) {
          const u = { firstname: data.body.firstname || "", lastname: data.body.lastname || "", birthday: data.body.birthday || "", address: data.body.address || "", bio: data.body.bio || "" };
          setUser(u); setOriginalUser(u); setAvatar(data.body.avatar);
        } else toast.error(data.message);
      }).catch(err => toast.error(err.message));
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    fetch(`${BACKEND_BASE_URL}/api/users/update/profile`, {
      method: "PUT", body: JSON.stringify(user), headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
    }).then(r => r.json()).then(data => {
      if (data.code === 200) { toast.success("Cập nhật thành công!"); navigate(`/users/${localStorage.getItem("userId")}`); }
      else toast.error(data.message);
    }).catch(err => toast.error(err.message));
  };

  const handleChange = (e) => { setUser({ ...user, [e.target.name]: e.target.value }); };

  const handleAvatarChange = (e) => {
    e.preventDefault();
    const formData = new FormData(); formData.append("avatar", avatarImg.current.files[0]);
    fetch(`${BACKEND_BASE_URL}/api/users/update/avatar`, { method: "PUT", body: formData, headers: { Authorization: `Bearer ${getToken()}` } })
      .then(r => r.json()).then(data => { if (data.code === 200) { setAvatar(data.body); toast.success("Avatar updated!"); } else toast.error(data.message); })
      .catch(err => toast.error(err.message));
  };

  const isSaveDisabled = JSON.stringify(user) === JSON.stringify(originalUser);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-200 py-6 md:py-10">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-slate-500 hover:text-white transition-colors mb-6 bg-transparent border-none cursor-pointer">
          <FontAwesomeIcon icon={faArrowLeft} /> Quay lại
        </button>

        <form onSubmit={handleSave} className="bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl backdrop-blur-xl shadow-2xl overflow-hidden animate-[slideUp_0.35s_ease]">
          {/* Avatar — mobile: top, desktop: right */}
          <div className="flex flex-col-reverse md:grid md:grid-cols-5">
            {/* Form fields */}
            <div className="md:col-span-3 p-6 md:p-8 space-y-5">
              <h2 className="text-2xl font-bold text-white">Chỉnh sửa thông tin</h2>
              <div className="space-y-4 pt-2">
                <Input type="text" placeholder="Họ" icon={<FontAwesomeIcon icon={faUser} />} name="lastname" value={user.lastname} onChange={handleChange} />
                <Input type="text" placeholder="Tên" icon={<FontAwesomeIcon icon={faUser} />} name="firstname" value={user.firstname} onChange={handleChange} />
                <Input type="date" placeholder="Ngày sinh" icon={<FontAwesomeIcon icon={faCalendar} />} name="birthday" value={user.birthday} onChange={handleChange} />
                <Input type="text" placeholder="Địa chỉ" icon={<FontAwesomeIcon icon={faHome} />} name="address" value={user.address} onChange={handleChange} />
                <Input type="text" placeholder="Tiểu sử" icon={<FontAwesomeIcon icon={faInfoCircle} />} name="bio" value={user.bio} onChange={handleChange} />
              </div>
              {/* Actions — mobile visible below fields */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button type="submit" primary large disable={isSaveDisabled} className="flex-1">Lưu thay đổi</Button>
                <Button secondary large onClick={() => navigate(-1)} className="flex-1">Hủy</Button>
              </div>
            </div>

            {/* Avatar panel */}
            <div className="md:col-span-2 p-6 md:p-8 flex flex-col items-center justify-center gap-4 bg-white/[0.02] border-b md:border-b-0 md:border-l border-white/5">
              <div className="relative group">
                <img src={avatar} alt="Avatar" className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover ring-4 ring-white/10 group-hover:ring-indigo-500/50 transition-all" />
                <input type="file" name="avatar" id="avatar" ref={avatarImg} onChange={handleAvatarChange} className="hidden" />
                <label htmlFor="avatar" className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <FontAwesomeIcon icon={faImage} className="text-white text-2xl" />
                </label>
              </div>
              <p className="text-xs text-slate-600">Click để đổi ảnh đại diện</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
