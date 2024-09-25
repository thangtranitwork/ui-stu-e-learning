import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import styles from "./EditCourse.module.scss";
import { BACKEND_BASE_URL } from "../../constant";
import { toast } from "react-toastify";
import Button from "../../components/Button";
import Input from "../../components/Input";
import RichTextEditor from "../../components/RichTextEditor";
import Course from "../../components/Course";
import LessonInfo from "../../components/LessonInfo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilSquare } from "@fortawesome/free-solid-svg-icons";

export default function EditCourse() {
  const { courseId } = useParams(); // Lấy courseId từ URL
  const [course, setcourse] = useState({
    name: "",
    creator: {
      id: 0,
    },
    price: 0,
    introduction: "",
    lessons: [],
  });
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Chỉnh sửa khóa học";

    const fetchcourse = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const userId = localStorage.getItem("userId");

        const response = await fetch(
          `${BACKEND_BASE_URL}/api/courses/${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        if (data.code === 200) {
          const course = data.body;
          // Kiểm tra quyền sở hữu khóa học
          if (course.creator.id !== userId) {
            toast.error("Bạn không có quyền chỉnh sửa khóa học này.");
            navigate("/");
            return;
          }

          setcourse(course);
        } else {
          toast.error("Không thể lấy dữ liệu khóa học.");
          navigate("/");
        }
      } catch (error) {
        toast.error("Đã có lỗi xảy ra, vui lòng thử lại.");
        navigate("/");
      }
    };

    fetchcourse();
  }, [courseId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setcourse((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleRichTextChange = (value) => {
    setcourse((prevState) => ({
      ...prevState,
      introduction: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `${BACKEND_BASE_URL}/api/courses/${courseId}/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(course),
        }
      );
      const data = await response.json();

      if (data.code === 200) {
        toast.success("Khóa học đã được cập nhật thành công!");
        // navigate(`/courses/${courseId}`);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Đã có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  return (
    <div className={styles.card}>
      <h1 className={styles.title}>Chỉnh Sửa Khóa Học</h1>
      <Course course={course} reviewMode />
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          placeholder="Tên khóa học"
          name="name"
          value={course.name}
          onChange={handleChange}
          noBackground // Sử dụng input không có nền
          white // Màu chữ trắng
        />
        <Input
          placeholder="Giá khóa học"
          name="price"
          value={course.price}
          onChange={handleChange}
          type="number"
          noBackground // Sử dụng input không có nền
          white // Màu chữ trắng
        />
        <Input
          placeholder="Mô tả khóa học"
          name="description"
          value={course.description}
          onChange={handleChange}
          noBackground // Sử dụng input không có nền
          white // Màu chữ trắng
        />
        <RichTextEditor
          value={course.introduction}
          className={styles.textarea}
          onChange={handleRichTextChange}
          label="Giới thiệu"
        />
        <Button primary large type="submit" className={styles.submitButton}>
          Cập Nhật Khóa Học
        </Button>

        <div className={styles.lessonHeader}>
          <h3>Bài học</h3>
          <Link to={`/courses/${courseId}/new`} className={styles.addLessonIcon}>
            <FontAwesomeIcon icon={faPencilSquare} />
          </Link>
        </div>
        <div className={styles.lessonList}>
          {Array.isArray(course.lessons) &&
            course.lessons.map((lesson, index) => (
              <LessonInfo
                key={index}
                index={index + 1}
                lesson={lesson}
                courseId={course.id}
                disable={!course.enroll}
                editing
              />
            ))}
        </div>
      </form>
    </div>
  );
}
