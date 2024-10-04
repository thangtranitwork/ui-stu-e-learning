import classNames from "classnames/bind";
import styles from "./LessonEditor.module.scss";
import Input from "../Input";
import RichTextEditor from "../RichTextEditor";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Button from "../Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSave } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { BACKEND_BASE_URL } from "../../constant";
import { getToken } from "../../App";

export default function LessonForm({
  initLesson,
  create = true,
  courseId
}) {
  const [name, setName] = useState(initLesson?.name || "");
  const [theory, setTheory] = useState(initLesson?.theory || "");
  const [lessonId, setLessonId] = useState(initLesson?.id || null); // Để kiểm tra nếu có id thì đang update
  const cx = classNames.bind(styles);
  const navigate = useNavigate();

  const handleTheoryChange = (value) => setTheory(value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const method = create ? "POST" : "PUT";
      const url = create
        ? `${BACKEND_BASE_URL}/api/courses/${courseId}/lessons/new`
        : `${BACKEND_BASE_URL}/api/courses/${courseId}/lessons/${lessonId}`;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          name,
          theory,
        }),
      });

      const data = await response.json();
      if (data.code === 200) {
        toast.success(
          create ? "Thêm bài học thành công!" : "Cập nhật bài học thành công!"
        );
        navigate(`/courses/${courseId}/edit`);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  const validate = () => {
    if (name.trim() === "") {
      toast.error("Tên bài học không được để trống!");
      return false;
    }
    if (theory.trim() === "") {
      toast.error("Nội dung bài học không được để trống!");
      return false;
    }
    return true;
  };

  return (
    <form onSubmit={handleSubmit} className={cx("card")}>
      <Input
        placeholder="Tên bài học"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <RichTextEditor
        value={theory}
        label="Nội dung bài học"
        onChange={handleTheoryChange}
      />
      <Button
        primary
        type="submit"
        rightIcon={<FontAwesomeIcon icon={create ? faPlus : faSave} />}
      >
        {create ? "Thêm bài học" : "Lưu bài học"}
      </Button>
    </form>
  );
}
