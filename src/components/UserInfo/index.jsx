import React from "react";
import { useNavigate } from "react-router-dom";
import { DEFAULT_AVATAR_URL } from "../../constant";

const UserInfo = ({ user, className = "" }) => {
  const navigate = useNavigate();

  const isUserOnline = () => {
    if (!user?.lastOnline) return false;
    const lastOnlineDate = new Date(user.lastOnline);
    return Date.now() < lastOnlineDate.getTime();
  };

  return (
    <span
      className={`inline-flex items-center gap-2 cursor-pointer group/user ${className}`}
      onClick={(e) => { e.stopPropagation(); e.preventDefault(); navigate(`/users/${user?.id}`); }}
    >
      <span className="relative flex-shrink-0">
        <img
          className="w-7 h-7 rounded-full object-cover ring-2 ring-white/10 group-hover/user:ring-indigo-500/50 transition-all"
          src={user?.avatar || DEFAULT_AVATAR_URL}
          alt={`${user?.lastname} ${user?.firstname}`}
        />
        {isUserOnline() && (
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-[#0a0a0a]"></span>
        )}
      </span>
      <span className="text-xs text-slate-400 group-hover/user:text-indigo-400 transition-colors font-medium">
        {localStorage.getItem("userId") === String(user?.id)
          ? "Bạn"
          : user?.lastname + " " + user?.firstname}
      </span>
    </span>
  );
};

export default UserInfo;

export function UserAvartarOnly({ user, className = "" }) {
  const navigate = useNavigate();

  const isUserOnline = () => {
    if (!user?.lastOnline) return false;
    const lastOnlineDate = new Date(user.lastOnline);
    return Date.now() < lastOnlineDate.getTime();
  };

  return (
    <span
      className={`inline-flex cursor-pointer ${className}`}
      onClick={() => navigate(`/users/${user?.id}`)}
    >
      <span className="relative flex-shrink-0">
        <img
          className="w-9 h-9 rounded-full object-cover ring-2 ring-white/10 hover:ring-indigo-500/50 transition-all"
          src={user?.avatar || DEFAULT_AVATAR_URL}
          alt={`${user?.lastname} ${user?.firstname}`}
        />
        {isUserOnline() && (
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-[#0a0a0a]"></span>
        )}
      </span>
    </span>
  );
}
