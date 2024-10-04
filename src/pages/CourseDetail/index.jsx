import React, { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./CourseDetail.module.scss";
import { BACKEND_BASE_URL } from "../../constant";
import classNames from "classnames/bind";
import UserInfo from "../../components/UserInfo";
import Button from "../../components/Button";
import Star from "../../components/Star";
import LessonInfo from "../../components/LessonInfo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faBasketShopping,
  faBook,
  faPlay,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import ReviewInput from "../../components/ReviewInput";
import Loader from "../../components/Loader";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import Pagination from "../../components/Pagination";
import Review from "../../components/Review";
import { getToken } from "../../App";

const cx = classNames.bind(styles);

export default function CourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  console.log(course);
  
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = getToken();
        const headers = {
          "Content-Type": "application/json",
        };

        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(
          `${BACKEND_BASE_URL}/api/courses/${courseId}`,
          {
            method: "GET",
            headers: headers,
          }
        );
        const data = await response.json();

        if (data.code === 200) {
          setCourse(data.body);
          document.title = data.body.name;
        }
      } catch (error) {
        console.error("Error fetching course:", error);
      }
    };

    fetchCourse();
  }, [courseId]);

  const handleEnroll = async () => {
    try {
      const token = getToken();
      const headers = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(
        `${BACKEND_BASE_URL}/api/courses/${courseId}/enroll`,
        {
          method: "POST",
          headers: headers,
        }
      );
      const data = await response.json();

      if (data.code === 200) {
        setCourse((prevCourse) => ({
          ...prevCourse,
          enroll: true,
        }));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error enrolling in course:", error);
    }
  };

  const handleBuy = async () => {
    try {
      const token = getToken();
      const headers = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(
        `${BACKEND_BASE_URL}/api/courses/buy?id=${courseId}`,
        {
          method: "POST",
          headers: headers,
        }
      );
      const data = await response.json();
      if (data.code === 200) {
        window.open(data.body);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error enrolling in course:", error);
    }
  };

  const handleContinue = async () => {
    try {
      const token = getToken();
      const headers = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(
        `${BACKEND_BASE_URL}/api/courses/${courseId}/lessons/continue`,
        {
          method: "GET",
          headers: headers,
        }
      );
      const data = await response.json();
      console.log(data);

      if (data.code === 200) {
        const lessonId = data.body;
        navigate(`/courses/${courseId}/lessons/${lessonId}`);
      } else {
        alert("Không thể tiếp tục khóa học. Vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Error continuing course:", error);
    }
  };

  if (!course) {
    return <Loader />;
  }

  return (
    <div className={cx("course-detail-container")}>
      <div className={cx("course-header")}>
        <h1>{course.name}</h1>
        <Star rating={course.star} />
      </div>
      <p className={cx("course-description")}>{course.description}</p>
      <div className={cx("course-info")}>
        <div className={cx("course-price")}>
          <h3>Giá:</h3>
          <p>{course.price} VND</p>
        </div>
        <div className={cx("course-lessons")}>
          <p>
            {course.lessonCount} {<FontAwesomeIcon icon={faBook} />}
          </p>
        </div>
        <div className={cx("course-enrollments")}>
          <p>
            {course.enrollmentCount} {<FontAwesomeIcon icon={faUserGroup} />}
          </p>
        </div>
      </div>
      <div className={cx("course-creator")}>
        <h3>Tác giả:</h3>
        <UserInfo user={course.creator} />
      </div>
      {course.enroll === false ? (
        <>
          {course.price === 0 ? (
            <Button
              primary
              rightIcon={<FontAwesomeIcon icon={faArrowRight} />}
              onClick={handleEnroll}
            >
              Vào học ngay
            </Button>
          ) : (
            <Button
              primary
              rightIcon={<FontAwesomeIcon icon={faBasketShopping} />}
              onClick={handleBuy}
            >
              Mua khoá học
            </Button>
          )}
        </>
      ) : (
        <div classNames={cx("action-btn")}>
          <Button
            primary
            rightIcon={<FontAwesomeIcon icon={faPlay} />}
            onClick={handleContinue}
          >
            Tiếp tục
          </Button>
        </div>
      )}
      {localStorage.getItem("userId") === course.creator.id && (
        <Button secondary to={`edit`}>
          Chỉnh sửa khóa học
        </Button>
      )}

      <div>
        <h3>Giới thiệu</h3>
        <div
          className={cx("course-introduction")}
          dangerouslySetInnerHTML={{ __html: course.introduction }}
        />
      </div>

      <div>
        <h3>Bài học</h3>
        {course.lessons.map((lesson, index) => (
          <LessonInfo
            key={index}
            index={index + 1}
            lesson={lesson}
            courseId={course.id}
            disable={!course.enroll}
          />
        ))}
      </div>
      <div>
        <h3>Đánh giá</h3>
        {course.canReview && <ReviewInput courseId={courseId} />}
        <Pagination
          url={`${BACKEND_BASE_URL}/api/courses/${courseId}/reviews`}
          render={(review) => <Review review={review}></Review>}
        />
      </div>
    </div>
  );
}
