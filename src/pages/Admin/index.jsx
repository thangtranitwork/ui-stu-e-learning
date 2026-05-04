import { useState } from "react";
import Pagination from "../../components/Pagination";
import { BACKEND_BASE_URL } from "../../constant";
import UserAdminView from "../../components/UserAdminView";
import ForbiddenWordsManage from "../../components/ForbiddenWordsManage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faBan, faShieldHalved } from "@fortawesome/free-solid-svg-icons";

export default function Admin() {
  const [tab, setTab] = useState(0);

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-10">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
          <header className="mb-8">
            <div className="flex items-center gap-4 mb-2">
              <FontAwesomeIcon icon={faShieldHalved} className="text-3xl text-indigo-500 drop-shadow-[0_0_8px_rgba(99,102,241,0.4)]" />
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Quản Trị Hệ Thống</h1>
              <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-xs font-semibold rounded-full border border-indigo-500/20">Admin</span>
            </div>
            <p className="text-slate-500 text-sm">Quản lý người dùng và nội dung nền tảng e-learning</p>
          </header>

          <div className="flex bg-white/5 p-1.5 rounded-2xl mb-8 relative max-w-md">
            <button onClick={() => setTab(0)} className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold z-10 transition-all cursor-pointer ${tab === 0 ? "text-white" : "text-slate-500 hover:text-slate-300"}`}>
              <FontAwesomeIcon icon={faUsers} /> Người dùng
            </button>
            <button onClick={() => setTab(1)} className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold z-10 transition-all cursor-pointer ${tab === 1 ? "text-white" : "text-slate-500 hover:text-slate-300"}`}>
              <FontAwesomeIcon icon={faBan} /> Từ khóa cấm
            </button>
            <div className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl transition-all duration-400 ease-[cubic-bezier(0.25,1,0.5,1)] shadow-lg shadow-indigo-500/30 ${tab === 0 ? "left-1.5" : "left-[50%]"}`}></div>
          </div>

          <div className="bg-[#0c0c14] rounded-2xl p-6 border border-white/5 min-h-[400px]">
            {tab === 1 ? (
              <div key="tab1" className="animate-[fadeIn_0.3s_ease]"><ForbiddenWordsManage /></div>
            ) : (
              <div key="tab0" className="animate-[fadeIn_0.3s_ease] space-y-3">
                <Pagination url={`${BACKEND_BASE_URL}/api/admin/users`} attachToken render={(u) => <UserAdminView key={u.id} user={u} />} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
