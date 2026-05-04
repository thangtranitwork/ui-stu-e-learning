import Input from "../Input";
import RichTextEditor from "../RichTextEditor";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Button from "../Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSave } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { BACKEND_BASE_URL } from "../../constant";
import { getToken } from "../../App";

export default function LessonEditor({ initLesson, create = true, courseId }) {
  const [name, setName] = useState(initLesson?.name || "");
  const [theory, setTheory] = useState(initLesson?.theory || "");
  const [lessonId] = useState(initLesson?.id || null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) { toast.error("Tên bài học trống!"); return; }
    if (!theory.trim()) { toast.error("Nội dung trống!"); return; }

    const method = create ? "POST" : "PUT";
    const url = create ? `${BACKEND_BASE_URL}/api/courses/${courseId}/lessons/new` : `${BACKEND_BASE_URL}/api/courses/${courseId}/lessons/${lessonId}`;
    const response = await fetch(url, { method, headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` }, body: JSON.stringify({ name, theory }) });
    const data = await response.json();
    if (data.code === 200) { toast.success(create ? "Thêm bài học thành công!" : "Cập nhật thành công!"); navigate(`/courses/${courseId}/edit`); }
    else toast.error(data.message);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
      <Input placeholder="Tên bài học" value={name} onChange={(e) => setName(e.target.value)} />
      <RichTextEditor value={theory} label="Nội dung bài học" onChange={setTheory} />
      <Button primary type="submit" rightIcon={<FontAwesomeIcon icon={create ? faPlus : faSave} />}>
        {create ? "Thêm bài học" : "Lưu bài học"}
      </Button>
    </form>
  );
}
