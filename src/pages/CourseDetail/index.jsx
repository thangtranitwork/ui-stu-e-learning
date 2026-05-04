import React, { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { BACKEND_BASE_URL } from "../../constant";
import UserInfo from "../../components/UserInfo";
import Button from "../../components/Button";
import Star from "../../components/Star";
import LessonInfo from "../../components/LessonInfo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faBasketShopping, faBook, faPlay, faTrashCan, faUserGroup } from "@fortawesome/free-solid-svg-icons";
import ReviewInput from "../../components/ReviewInput";
import Loader from "../../components/Loader";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import Pagination from "../../components/Pagination";
import Review from "../../components/Review";
import { getToken } from "../../App";
import Popup from "../../components/Popup";
import NumberDisplay from "../../components/NumberDisplay";

export default function CourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      const token = getToken();
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const response = await fetch(`${BACKEND_BASE_URL}/api/courses/${courseId}`, { method: "GET", headers });
      const data = await response.json();
      if (data.code === 200) { setCourse(data.body); document.title = data.body.name; }
    };
    fetchCourse();
  }, [courseId]);

  const handleEnroll = async () => {
    const token = getToken(); const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const response = await fetch(`${BACKEND_BASE_URL}/api/courses/${courseId}/enroll`, { method: "POST", headers });
    const data = await response.json();
    if (data.code === 200) setCourse((prev) => ({ ...prev, enroll: true }));
    else toast.error(data.message);
  };

  const handleBuy = async () => {
    const token = getToken(); const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const response = await fetch(`${BACKEND_BASE_URL}/api/courses/buy?id=${courseId}`, { method: "POST", headers });
    const data = await response.json();
    if (data.code === 200) window.open(data.body);
    else toast.error(data.message);
  };

  const handleDelete = async () => {
    const token = getToken(); const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const response = await fetch(`${BACKEND_BASE_URL}/api/courses/${courseId}/delete`, { method: "DELETE", headers });
    const data = await response.json();
    if (data.code === 200) navigate("/courses");
    else toast.error(data.message);
  };

  const handleContinue = async () => {
    const token = getToken(); const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const response = await fetch(`${BACKEND_BASE_URL}/api/courses/${courseId}/lessons/continue`, { method: "GET", headers });
    const data = await response.json();
    if (data.code === 200) navigate(`/courses/${courseId}/lessons/${data.body}`);
    else toast.error("Không thể tiếp tục khóa học.");
  };

  if (!course) return <Loader />;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-200 py-10">
      <div className="container mx-auto px-6 max-w-4xl space-y-8">
        {/* Hero */}
        <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-3xl p-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">{course.name}</h1>
            <Star rating={course.star} />
          </div>
          <p className="text-slate-400">{course.description}</p>
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <span className="flex items-center gap-2 text-amber-400 font-semibold"><NumberDisplay value={course.price} /> VND</span>
            <span className="flex items-center gap-2 text-slate-500"><FontAwesomeIcon icon={faBook} /> {course.lessonCount} bài</span>
            <span className="flex items-center gap-2 text-slate-500"><FontAwesomeIcon icon={faUserGroup} /> {course.enrollmentCount} học viên</span>
          </div>
          <div className="flex items-center gap-3"><span className="text-sm text-slate-500">Tác giả:</span><UserInfo user={course.creator} /></div>

          <div className="flex flex-wrap gap-3 pt-2">
            {course.enroll === false ? (
              course.price === 0 ? (
                <Button primary rightIcon={<FontAwesomeIcon icon={faArrowRight} />} onClick={handleEnroll}>Vào học ngay</Button>
              ) : (
                <Button primary rightIcon={<FontAwesomeIcon icon={faBasketShopping} />} onClick={handleBuy}>Mua khoá học</Button>
              )
            ) : (
              <Button primary rightIcon={<FontAwesomeIcon icon={faPlay} />} onClick={handleContinue}>Tiếp tục</Button>
            )}
            {localStorage.getItem("userId") === course.creator.id && (
              <>
                <Button outline to="edit">Chỉnh sửa</Button>
                <Button danger small onClick={() => setIsPopupOpen(true)}><FontAwesomeIcon icon={faTrashCan} /></Button>
              </>
            )}
          </div>
        </div>

        <Popup title="Xác nhận xóa" onClose={() => setIsPopupOpen(false)} isOpen={isPopupOpen}>
          <p className="text-slate-400 text-sm mb-4">Bạn có chắc muốn xóa khóa học này?</p>
          <div className="flex gap-3">
            <Button outline onClick={() => setIsPopupOpen(false)}>Hủy</Button>
            <Button danger onClick={handleDelete} rightIcon={<FontAwesomeIcon icon={faTrashCan} />}>Xóa</Button>
          </div>
        </Popup>

        {/* Introduction */}
        <section className="bg-white/5 border border-white/10 rounded-3xl p-8">
          <h3 className="text-xl font-bold text-white mb-4">Giới thiệu</h3>
          <div className="prose prose-invert prose-sm max-w-none text-slate-300" dangerouslySetInnerHTML={{ __html: course.introduction }} />
        </section>

        {/* Lessons */}
        <section className="bg-white/5 border border-white/10 rounded-3xl p-8">
          <h3 className="text-xl font-bold text-white mb-4">Bài học ({course.lessons.length})</h3>
          <div className="space-y-2">
            {course.lessons.map((lesson, index) => (
              <LessonInfo key={index} index={index + 1} lesson={lesson} courseId={course.id} disable={!course.enroll} />
            ))}
          </div>
        </section>

        {/* Reviews */}
        <section className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-4">
          <h3 className="text-xl font-bold text-white">Đánh giá</h3>
          {course.canReview && <ReviewInput courseId={courseId} />}
          <Pagination url={`${BACKEND_BASE_URL}/api/courses/${courseId}/reviews`} render={(review) => <Review review={review} />} />
        </section>
      </div>
    </div>
  );
}
