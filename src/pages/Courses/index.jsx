import React, { useEffect, useState } from "react";
import Course from "../../components/Course";
import { BACKEND_BASE_URL } from "../../constant";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { faMagnifyingGlass, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Pagination from "../../components/Pagination";

export default function Courses() {
  const [hottestCourses, setHottestCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [tab, setTab] = useState(0);
  const userId = localStorage.getItem("userId");

  useEffect(() => { document.title = "Khoá học"; }, []);

  useEffect(() => {
    fetch(`${BACKEND_BASE_URL}/api/courses/hottest`, { method: "GET", headers: { "Content-Type": "application/json" } })
      .then(r => r.json()).then(data => { if (data.code === 200) setHottestCourses(data.body); })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-200 py-10">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {["Mới nhất", ...(localStorage.getItem("scope")?.includes("CONTRIBUTOR") ? ["Của bạn"] : []), "Đã học"].map((label, i) => (
              <button key={i} onClick={() => setTab(i)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer border
                  ${tab === i ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/20" : "bg-white/5 text-slate-400 border-white/10 hover:border-white/20 hover:text-white"}`}>
                {label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Input small type="search" placeholder="Tìm kiếm" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              actionIcon={<FontAwesomeIcon icon={faMagnifyingGlass} />} />
            {localStorage.getItem("scope")?.includes("CONTRIBUTOR") && (
              <Button to="new" outline small><FontAwesomeIcon icon={faPenToSquare} /></Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Hot Courses Sidebar */}
          <div className="lg:col-span-4 lg:order-2">
            <section className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-lg">🔥</span>
                <h2 className="text-xl font-bold text-white">Nổi bật nhất</h2>
              </div>
              <div className="space-y-3">
                {hottestCourses.map((course) => <Course hot course={course} key={course.id} />)}
              </div>
            </section>
          </div>

          {/* Main List */}
          <div className="lg:col-span-8 lg:order-1">
            <section className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <h2 className="text-2xl font-bold text-white mb-6">
                {tab === 0 ? "Khoá học mới nhất" : tab === 1 ? "Khoá học của bạn" : "Khoá học đã học"}
              </h2>
              <div className="space-y-3">
                {tab === 0 && <Pagination searchQuery={`name=${searchQuery}`} render={(course) => <Course course={course} key={course.id} />} url={`${BACKEND_BASE_URL}/api/courses/search`} />}
                {tab === 1 && <Pagination render={(course, i) => <Course key={i} course={course} />} url={`${BACKEND_BASE_URL}/api/users/${userId}/courses/created`} />}
                {tab === 2 && <Pagination render={(course, i) => <Course key={i} course={course} />} url={`${BACKEND_BASE_URL}/api/users/${userId}/courses/learned`} />}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
