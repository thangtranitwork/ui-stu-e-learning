import React, { useEffect, useState } from "react";
import { BACKEND_BASE_URL } from "../../constant";
import Course from "../../components/Course";
import QuizInfo from "../../components/QuizInfo";
import PostSearch from "../../components/PostSearch";

export default function Home() {
  useEffect(() => { document.title = "STU E-Learning"; }, []);
  const [hottestCourses, setHottestCourses] = useState([]);
  const [hottestQuizzes, setHottestQuizzes] = useState([]);
  const [hottestPosts, setHottestPosts] = useState([]);

  useEffect(() => {
    const fetchData = async (url, setter) => {
      try { const r = await fetch(url, { method: "GET", headers: { "Content-Type": "application/json" } }); const d = await r.json(); if (d.code === 200) setter(d.body); }
      catch (e) { console.error(e); }
    };
    fetchData(`${BACKEND_BASE_URL}/api/courses/hottest`, setHottestCourses);
    fetchData(`${BACKEND_BASE_URL}/api/quizzes/hottest`, setHottestQuizzes);
    fetchData(`${BACKEND_BASE_URL}/api/posts/hottest`, setHottestPosts);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-200 py-12">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Hero */}
        <div className="mb-16 text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white">
            Khám phá <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">Tri Thức</span> Mới
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">Nền tảng học tập trực tuyến hàng đầu dành cho sinh viên STU.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <section className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-500">🔥</div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Khóa học nổi bật</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hottestCourses.map((course) => <Course hot course={course} key={course.id} />)}
              </div>
            </section>
            <section className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-500">💬</div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Bài viết thảo luận</h2>
              </div>
              <div className="flex flex-col gap-4">
                {hottestPosts.map((post) => <PostSearch hot post={post} key={post.id} />)}
              </div>
            </section>
          </div>
          <div className="lg:col-span-4">
            <section className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-2xl sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center text-green-500">✍️</div>
                <h2 className="text-xl font-bold text-white tracking-tight">Trắc nghiệm HOT</h2>
              </div>
              <div className="flex flex-col gap-3">{hottestQuizzes.map((quiz) => <QuizInfo hot quiz={quiz} key={quiz.id} />)}</div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
