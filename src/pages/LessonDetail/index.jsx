import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./LessonDetail.module.scss";
import { BACKEND_BASE_URL } from "../../constant";
import UserInfo from "../../components/UserInfo";
import LessonInfo from "../../components/LessonInfo";
import Loader from "../../components/Loader";
import { getToken } from "../../App";

const cx = classNames.bind(styles);

export default function LessonDetail() {
  const { courseId, lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [syllabus, setSyllabus] = useState([]);
  const [isLessonComplete, setIsLessonComplete] = useState(false); // State để theo dõi trạng thái hoàn thành
  const contentRef = useRef();
  useEffect(() => {
    document.title = lesson?.name;
  }, [lesson?.name]);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const response = await fetch(
          `${BACKEND_BASE_URL}/api/courses/${courseId}/lessons/${lessonId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getToken()}`, // Đính kèm accessToken
            },
          }
        );
        const data = await response.json();

        if (data.code === 200) {
          setLesson(data.body);
          setIsLessonComplete(data.body.complete); // Cập nhật trạng thái hoàn thành
        }
      } catch (error) {
        console.error("Error fetching lesson:", error);
      }
    };

    fetchLesson();
  }, [courseId, lessonId]);

  useEffect(() => {
    const fetchSyllabus = async () => {
      try {
        const response = await fetch(
          `${BACKEND_BASE_URL}/api/courses/${courseId}/syllabus`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getToken()}`, // Đính kèm accessToken
            },
          }
        );
        const data = await response.json();

        if (data.code === 200) {
          setSyllabus(data.body);
        }
      } catch (error) {
        console.error("Error fetching syllabus:", error);
      }
    };

    fetchSyllabus();
  }, [courseId]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        contentRef.current &&
        (window.innerHeight + window.scrollY >=
          contentRef.current.offsetHeight - 10 || // Thêm một chút khoảng cách
          contentRef.current.offsetHeight <= window.innerHeight) && // Kiểm tra nếu nội dung ngắn
        !isLessonComplete // Kiểm tra trạng thái hoàn thành
      ) {
        markLessonAsComplete();
      }
    };

    const markLessonAsComplete = async () => {
      try {
        await fetch(
          `${BACKEND_BASE_URL}/api/courses/${courseId}/lessons/${lessonId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getToken()}`, // Đính kèm accessToken
            },
          }
        );
        console.log("Lesson marked as complete");
        setIsLessonComplete(true); // Cập nhật trạng thái hoàn thành sau khi gửi yêu cầu thành công

        // Cập nhật trạng thái hoàn thành trong giáo trình
        setSyllabus((prevSyllabus) => {
          return prevSyllabus.map((item) => {
            // Tìm bài học hiện tại và cập nhật giá trị completed
            if (item.id === lessonId) {
              return { ...item, completed: true }; // Đặt completed thành true
            }
            return item; // Giữ nguyên bài học khác
          });
        });
      } catch (error) {
        console.error("Error marking lesson as complete:", error);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [courseId, lessonId, isLessonComplete]);

  if (!lesson) {
    return <Loader />;
  }

  return (
    <div className={cx("lesson-detail", "b-shadow")} ref={contentRef}>
      <div className={cx("lesson-info")}>
        <Link to={`/courses/${courseId}`}>
          <h1 className={cx("course")}>{lesson?.course.name}</h1>
        </Link>
        <UserInfo className={cx("creator")} user={lesson?.course.creator} />
      </div>
      <h2 className={cx("lesson-title")}>{lesson?.name}</h2>
      <div className={cx("lesson-theory")}>
        <p>{lesson.theory}</p>
      </div>
      {syllabus.length > 0 && (
        <div className={cx("syllabus")}>
          <h3>Giáo trình</h3>
          {syllabus.map((item, index) => (
            <LessonInfo
              key={index}
              lesson={item}
              index={index + 1}
              courseId={courseId}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} // Cuộn về đầu trang
            />
          ))}
        </div>
      )}
    </div>
  );
}
