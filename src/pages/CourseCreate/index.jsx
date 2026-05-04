import React, { useEffect, useState } from "react";
import { BACKEND_BASE_URL } from "../../constant";
import { toast } from "react-toastify";
import Button from "../../components/Button";
import Input from "../../components/Input";
import RichTextEditor from "../../components/RichTextEditor";
import { useNavigate } from "react-router-dom";
import Course from "../../components/Course";
import { getToken } from "../../App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faRocket } from "@fortawesome/free-solid-svg-icons";

export default function CourseCreate() {
  const [courseData, setCourseData] = useState({ name: "", price: "", description: "", introduction: "" });
  const navigate = useNavigate();

  useEffect(() => { document.title = "Tạo khóa học mới"; }, []);

  const handleChange = (e) => setCourseData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`${BACKEND_BASE_URL}/api/courses/new`, {
      method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({ ...courseData, price: parseInt(courseData.price, 10) }),
    });
    const data = await response.json();
    if (data.code === 200) { toast.success("Tạo khóa học thành công!"); navigate(`/courses/${data.body.id}`); }
    else toast.error(data.message);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-200 py-6 md:py-10">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-slate-500 hover:text-white transition-colors mb-6 bg-transparent border-none cursor-pointer">
          <FontAwesomeIcon icon={faArrowLeft} /> Quay lại
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
          {/* Form */}
          <div className="lg:col-span-3 bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl animate-[slideUp_0.35s_ease]">
            <h1 className="text-2xl font-bold text-white mb-6">Tạo Khóa Học Mới</h1>
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input placeholder="Tên khóa học" name="name" value={courseData.name} onChange={handleChange} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input placeholder="Giá khóa học" name="price" value={courseData.price} onChange={handleChange} type="number" />
                <Input placeholder="Mô tả ngắn" name="description" value={courseData.description} onChange={handleChange} />
              </div>
              <RichTextEditor value={courseData.introduction} onChange={(v) => setCourseData(prev => ({ ...prev, introduction: v }))} label="Giới thiệu chi tiết" />
              <Button primary large type="submit" className="w-full" rightIcon={<FontAwesomeIcon icon={faRocket} />}>Tạo Khóa Học</Button>
            </form>
          </div>

          {/* Preview */}
          <div className="lg:col-span-2 lg:sticky lg:top-24">
            <p className="text-xs text-slate-600 mb-3">Xem trước</p>
            <Course course={{ id: 1, ...courseData, star: 5.0, creator: { id: 0 } }} />
          </div>
        </div>
      </div>
    </div>
  );
}
