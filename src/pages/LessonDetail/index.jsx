import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { BACKEND_BASE_URL } from "../../constant";
import UserInfo from "../../components/UserInfo";
import LessonInfo from "../../components/LessonInfo";
import Loader from "../../components/Loader";
import { getToken } from "../../App";

export default function LessonDetail() {
  const { courseId, lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [syllabus, setSyllabus] = useState([]);
  const [isLessonComplete, setIsLessonComplete] = useState(false);
  const contentRef = useRef();

  useEffect(() => { document.title = lesson?.name; }, [lesson?.name]);

  useEffect(() => {
    const fetchLesson = async () => {
      const response = await fetch(`${BACKEND_BASE_URL}/api/courses/${courseId}/lessons/${lessonId}`, {
        method: "GET", headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
      });
      const data = await response.json();
      if (data.code === 200) { setLesson(data.body); setIsLessonComplete(data.body.complete); }
    };
    fetchLesson();
  }, [courseId, lessonId]);

  useEffect(() => {
    const fetchSyllabus = async () => {
      const response = await fetch(`${BACKEND_BASE_URL}/api/courses/${courseId}/syllabus`, {
        method: "GET", headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
      });
      const data = await response.json();
      if (data.code === 200) setSyllabus(data.body);
    };
    fetchSyllabus();
  }, [courseId]);

  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current &&
        (window.innerHeight + window.scrollY >= contentRef.current.offsetHeight - 10 || contentRef.current.offsetHeight <= window.innerHeight) &&
        !isLessonComplete) {
        fetch(`${BACKEND_BASE_URL}/api/courses/${courseId}/lessons/${lessonId}`, {
          method: "PATCH", headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        }).then(() => {
          setIsLessonComplete(true);
          setSyllabus(prev => prev.map(item => item.id === lessonId ? { ...item, completed: true } : item));
        });
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [courseId, lessonId, isLessonComplete]);

  if (!lesson) return <Loader />;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-200 py-10" ref={contentRef}>
      <div className="container mx-auto px-6 max-w-4xl space-y-8">
        {/* Header */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
          <Link to={`/courses/${courseId}`} className="text-indigo-400 hover:text-indigo-300 text-sm mb-2 inline-block">
            ← {lesson?.course.name}
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <UserInfo user={lesson?.course.creator} />
          </div>
          <h1 className="text-3xl font-extrabold text-white">{lesson?.name}</h1>
        </div>

        {/* Theory */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
          <div className="prose prose-invert prose-sm max-w-none text-slate-300" dangerouslySetInnerHTML={{ __html: lesson.theory }}></div>
        </div>

        {/* Syllabus */}
        {syllabus.length > 0 && (
          <section className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
            <h3 className="text-xl font-bold text-white mb-4">Giáo trình</h3>
            <div className="space-y-2">
              {syllabus.map((item, index) => (
                <LessonInfo key={index} lesson={item} index={index + 1} courseId={courseId}
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
