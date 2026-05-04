import Input from "../../components/Input";
import Button from "../../components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import Pagination from "../../components/Pagination";
import { BACKEND_BASE_URL } from "../../constant";
import { useState } from "react";
import UserSearch from "../../components/UserSearch";

export default function Friends() {
  const [searchQuery, setSearchQuery] = useState("");
  const [tab, setTab] = useState(0);

  const tabs = ["Bạn bè", "Kết bạn", "Đã nhận", "Đã gửi"];
  const urls = [
    `${BACKEND_BASE_URL}/api/friendship/search`,
    `${BACKEND_BASE_URL}/api/users/search`,
    `${BACKEND_BASE_URL}/api/friendship/invitationReceived`,
    `${BACKEND_BASE_URL}/api/friendship/invitationSend`,
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-200 py-10">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div className="flex flex-wrap gap-2">
              {tabs.map((label, i) => (
                <button key={i} onClick={() => setTab(i)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer border
                    ${tab === i ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/20" : "bg-white/5 text-slate-400 border-white/10 hover:border-white/20 hover:text-white"}`}>
                  {label}
                </button>
              ))}
            </div>
            <Input small type="search" placeholder="Tìm kiếm" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} actionIcon={<FontAwesomeIcon icon={faMagnifyingGlass} />} />
          </div>

          <h2 className="text-2xl font-bold text-white mb-6">{tabs[tab]}</h2>
          <div className="space-y-3">
            <Pagination
              searchQuery={tab <= 1 ? `name=${searchQuery}` : ""}
              render={(user) => <UserSearch key={user.id} user={user} />}
              url={urls[tab]}
              attachToken
            />
          </div>
        </div>
      </div>
    </div>
  );
}
