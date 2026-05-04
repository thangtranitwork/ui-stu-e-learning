import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BACKEND_BASE_URL } from "../../constant";
import { toast } from "react-toastify";
import Button from "../../components/Button";
import Input from "../../components/Input";
import RichTextEditor from "../../components/RichTextEditor";
import Course from "../../components/Course";
import LessonInfo from "../../components/LessonInfo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faArrowLeft, faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { getToken } from "../../App";
import Popup from "../../components/Popup";
import LessonEditor from "../../components/LessonEditor";

export default function EditCourse() {
  const { courseId } = useParams();
  const [course, setCourse] = useState({ name: "", creator: { id: 0 }, price: 0, introduction: "", lessons: [] });
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isCreatingNewLesson, setIsCreatingNewLesson] = useState(false);
  const [isLoadingLesson, setIsLoadingLesson] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Chỉnh sửa khóa học";
    const fetchCourse = async () => {
      const response = await fetch(`${BACKEND_BASE_URL}/api/courses/${courseId}`, { headers: { Authorization: `Bearer ${getToken()}` } });
      const data = await response.json();
      if (data.code === 200) {
        if (data.body.creator.id !== localStorage.getItem("userId")) { toast.error("Không có quyền!"); navigate("/"); return; }
        setCourse(data.body);
      } else { toast.error("Lỗi lấy dữ liệu."); navigate("/"); }
    };
    fetchCourse();
  }, [courseId, navigate]);

  const fetchLesson = async (id) => {
    setIsLoadingLesson(true);
    const response = await fetch(`${BACKEND_BASE_URL}/api/courses/${courseId}/lessons/${id}`, {
      method: "GET", headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
    });
    const data = await response.json();
    setIsLoadingLesson(false);
    return data.code === 200 ? data.body : null;
  };

  const handleLessonPopup = async (lesson = null) => {
    if (lesson) { const d = await fetchLesson(lesson.id); setSelectedLesson(d); }
    else setSelectedLesson(null);
    setIsCreatingNewLesson(lesson === null);
    setIsPopupOpen(true);
  };

  const handleChange = (e) => setCourse(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`${BACKEND_BASE_URL}/api/courses/${courseId}/update`, {
      method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` }, body: JSON.stringify(course),
    });
    const data = await response.json();
    if (data.code === 200) toast.success("Cập nhật thành công!");
    else toast.error(data.message);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-200 py-6 md:py-10">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-slate-500 hover:text-white transition-colors mb-6 bg-transparent border-none cursor-pointer">
          <FontAwesomeIcon icon={faArrowLeft} /> Quay lại
        </button>

        {isPopupOpen && (
          <Popup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} title={selectedLesson ? "Chỉnh sửa bài học" : "Thêm bài học"}>
            {isLoadingLesson ? <p className="text-slate-400">Đang tải...</p> :
              <LessonEditor initLesson={selectedLesson} create={isCreatingNewLesson} courseId={courseId} />}
          </Popup>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
          {/* Form */}
          <div className="lg:col-span-3 bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl animate-[slideUp_0.35s_ease] space-y-6">
            <h1 className="text-2xl font-bold text-white">Chỉnh Sửa Khóa Học</h1>
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input placeholder="Tên khóa học" name="name" value={course.name} onChange={handleChange} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input placeholder="Giá khóa học" name="price" value={course.price} onChange={handleChange} type="number" />
                <Input placeholder="Mô tả" name="description" value={course.description} onChange={handleChange} />
              </div>
              <RichTextEditor value={course.introduction} onChange={(v) => setCourse(prev => ({ ...prev, introduction: v }))} label="Giới thiệu" />
              <Button primary large type="submit" className="w-full" rightIcon={<FontAwesomeIcon icon={faFloppyDisk} />}>Cập Nhật</Button>
            </form>

            {/* Lessons section */}
            <div className="pt-4 border-t border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Bài học ({course.lessons?.length || 0})</h3>
                <Button outline small onClick={() => handleLessonPopup(null)} leftIcon={<FontAwesomeIcon icon={faPlus} />}>Thêm</Button>
              </div>
              <div className="space-y-2 max-h-[400px] overflow-y-auto overscroll-contain pr-1">
                {Array.isArray(course.lessons) && course.lessons.map((lesson, index) => (
                  <LessonInfo key={index} index={index + 1} lesson={lesson} courseId={course.id} disable={!course.enroll} editing onClick={() => handleLessonPopup(lesson)} />
                ))}
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="lg:col-span-2 lg:sticky lg:top-24">
            <p className="text-xs text-slate-600 mb-3">Xem trước</p>
            <Course course={course} reviewMode />
          </div>
        </div>
      </div>
    </div>
  );
}
