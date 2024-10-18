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
import { faPencilSquare, faPlus } from "@fortawesome/free-solid-svg-icons";
import { getToken } from "../../App";
import Popup from "../../components/Popup";
import LessonEditor from "../../components/LessonEditor";

export default function EditCourse() {
  const { courseId } = useParams();
  const [course, setCourse] = useState({
    name: "",
    creator: {
      id: 0,
    },
    price: 0,
    introduction: "",
    lessons: [],
  });
  const [selectedLesson, setSelectedLesson] = useState(null); // Bài học được chọn
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isCreatingNewLesson, setIsCreatingNewLesson] = useState(false); // Thêm mới bài học
  const [isLoadingLesson, setIsLoadingLesson] = useState(false); // Trạng thái chờ khi lấy bài học

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Chỉnh sửa khóa học";

    const fetchCourse = async () => {
      try {
        const token = getToken();
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
          if (course.creator.id !== userId) {
            toast.error("Bạn không có quyền chỉnh sửa khóa học này.");
            navigate("/");
            return;
          }

          setCourse(course);
        } else {
          toast.error("Không thể lấy dữ liệu khóa học.");
          navigate("/");
        }
      } catch (error) {
        toast.error("Đã có lỗi xảy ra, vui lòng thử lại.");
        navigate("/");
      }
    };

    fetchCourse();
  }, [courseId, navigate]);

  const fetchLesson = async (id) => {
    try {
      setIsLoadingLesson(true); // Bắt đầu chờ
      const response = await fetch(
        `${BACKEND_BASE_URL}/api/courses/${courseId}/lessons/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      const data = await response.json();
      setIsLoadingLesson(false); // Kết thúc chờ

      if (data.code === 200) {
        return data.body; // Trả về dữ liệu bài học
      } else {
        toast.error("Không thể lấy dữ liệu bài học.");
        return null;
      }
    } catch (error) {
      setIsLoadingLesson(false); // Kết thúc chờ trong trường hợp lỗi
      console.error("Error fetching lesson:", error);
      toast.error("Đã có lỗi xảy ra khi lấy bài học.");
      return null;
    }
  };

  const handleLessonPopup = async (lesson = null) => {
    if (lesson !== null) {
      const lessonData = await fetchLesson(lesson.id); // Đợi lấy dữ liệu bài học
      setSelectedLesson(lessonData); // Cập nhật bài học đã lấy
    } else {
      setSelectedLesson(null); // Tạo mới bài học
    }
    setIsCreatingNewLesson(lesson === null); // Xác định trạng thái thêm mới
    setIsPopupOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleRichTextChange = (value) => {
    setCourse((prevState) => ({
      ...prevState,
      introduction: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = getToken();
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
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Đã có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  return (
    <div className={styles.card}>
      {isPopupOpen && (
        <Popup
          isOpen={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
          title={selectedLesson === null ? "Thêm bài học" : "Chỉnh sửa bài học"}
        >
          {/* Hiển thị trạng thái chờ khi lấy bài học */}
          {isLoadingLesson ? (
            <p>Đang tải dữ liệu bài học...</p>
          ) : (
            <LessonEditor
              initLesson={selectedLesson}
              create={isCreatingNewLesson}
              update={!isCreatingNewLesson}
              courseId={courseId}
            />
          )}
        </Popup>
      )}

      <h1 className={styles.title}>Chỉnh Sửa Khóa Học</h1>
      <Course course={course} reviewMode />
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          placeholder="Tên khóa học"
          name="name"
          value={course.name}
          onChange={handleChange}
          noBackground
          white
        />
        <Input
          placeholder="Giá khóa học"
          name="price"
          value={course.price}
          onChange={handleChange}
          type="number"
          noBackground
          white
        />
        <Input
          placeholder="Mô tả khóa học"
          name="description"
          value={course.description}
          onChange={handleChange}
          noBackground
          white
        />
        <RichTextEditor
          value={course.introduction}
          className={styles.textarea}
          onChange={(value) => handleRichTextChange(value)}
          label="Giới thiệu"
        />
        <Button primary large type="submit" className={styles.submitButton}>
          Cập Nhật Khóa Học
        </Button>

        <div className={styles.lessonHeader}>
          <h3>Bài học</h3>
          <Button
            className={styles.addLessonButton}
            onClick={() => handleLessonPopup(null)} // Thêm mới bài học
          >
            <FontAwesomeIcon icon={faPlus} /> Thêm bài học
          </Button>
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
                onClick={() => handleLessonPopup(lesson)} // Chỉnh sửa bài học
              />
            ))}
        </div>
      </form>
    </div>
  );
}
