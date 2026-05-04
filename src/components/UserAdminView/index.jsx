import { DEFAULT_AVATAR_URL, BACKEND_BASE_URL } from "../../constant";
import { toast } from "react-toastify";
import Button from "../Button";
import { getToken } from "../../App";

export default function UserAdminView({ user }) {
  const availableRoles = ["CONTRIBUTOR", "ADMIN"];
  const userRoles = user?.roles ? user.roles.split(" ") : [];

  const handleRoleChange = async (e, role) => {
    const isChecked = e.target.checked;
    const url = `${BACKEND_BASE_URL}/api/admin/users/${isChecked ? "grant" : "revoke"}`;
    try {
      const response = await fetch(`${url}?id=${user?.id}&role=${role}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
      });
      const data = await response.json();
      if (data.code === 200) {
        toast.success(`${isChecked ? "Thêm" : "Xóa"} quyền ${role} của người dùng ${user?.id}`);
      } else { toast.error(data.message); }
    } catch (error) { console.error("Error:", error); }
  };

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
      <img className="w-10 h-10 rounded-full object-cover ring-2 ring-white/10" src={user?.avatar || DEFAULT_AVATAR_URL} alt={`${user?.lastname} ${user?.firstname}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white truncate">
          {localStorage.getItem("userId") === String(user?.id) ? "Bạn" : `${user?.lastname} ${user?.firstname}`}
        </p>
        <p className="text-xs text-slate-500">ID: {user.id}</p>
      </div>
      <div className="flex items-center gap-3">
        {availableRoles.map((role, index) => (
          <label key={index} className="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer hover:text-white transition-colors">
            <input type="checkbox" defaultChecked={userRoles.includes(role)} onChange={(e) => handleRoleChange(e, role)}
              className="w-4 h-4 rounded bg-white/5 border-white/20 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0 cursor-pointer" />
            {role}
          </label>
        ))}
      </div>
      <Button danger small>Xóa</Button>
    </div>
  );
}
