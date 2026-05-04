import React from "react";
import { useNavigate } from "react-router-dom";
import { DEFAULT_AVATAR_URL } from "../../constant";

const UserSearch = ({ user }) => {
  const navigate = useNavigate();
  const isUserOnline = () => {
    if (!user?.lastOnline) return false;
    return Date.now() < new Date(user.lastOnline).getTime();
  };

  return (
    <div onClick={() => navigate(`/users/${user?.id}`)}
      className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/[0.08] transition-all cursor-pointer">
      <div className="relative flex-shrink-0">
        <img className="w-11 h-11 rounded-full object-cover ring-2 ring-white/10" src={user?.avatar || DEFAULT_AVATAR_URL} alt={`${user?.lastname}`} />
        {isUserOnline() && <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-[#0a0a0a]"></span>}
      </div>
      <span className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
        {localStorage.getItem("userId") === String(user?.id) ? "Bạn" : `${user?.lastname} ${user?.firstname}`}
      </span>
    </div>
  );
};

export default UserSearch;
