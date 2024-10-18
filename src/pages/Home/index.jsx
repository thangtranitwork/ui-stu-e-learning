import React, { useEffect, useState } from "react";
import { BACKEND_BASE_URL } from "../../constant";
import classNames from "classnames/bind";
import styles from "./Home.module.scss";
import Course from "../../components/Course";
import QuizInfo from "../../components/QuizInfo";
import PostSearch from "../../components/PostSearch";
export default function Home() {
  useEffect(() => {
    document.title = "STU E-Learning";
  }, []);
  const [hottestCourses, setHottestCourses] = useState([]);
  const [hottestQuizzes, setHottestQuizzes] = useState([]); // State cho các hot quizzes
  const [hottestPosts, setHottestPosts] = useState([]);

  const cx = classNames.bind(styles);
  useEffect(() => {
    const fetchHottestCourses = async () => {
      try {
        const response = await fetch(
          `${BACKEND_BASE_URL}/api/courses/hottest`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        if (data.code === 200) {
          setHottestCourses(data.body);
        }
      } catch (error) {
        console.error("Error fetching hottest courses:", error);
      }
    };
    const fetchHottestQuizzes = async () => {
      try {
        const response = await fetch(
          `${BACKEND_BASE_URL}/api/quizzes/hottest`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        if (data.code === 200) {
          setHottestQuizzes(data.body);
        }
      } catch (error) {
        console.error("Error fetching hottest quizzes:", error);
      }
    };
    const fetchHottestPosts = async () => {
      try {
        const response = await fetch(`${BACKEND_BASE_URL}/api/posts/hottest`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (data.code === 200) {
          setHottestPosts(data.body);
        }
      } catch (error) {
        console.error("Error fetching hottest posts:", error);
      }
    };

    fetchHottestPosts();
    fetchHottestQuizzes();
    fetchHottestCourses();
  }, []);
  return (
    <div className={cx("wrapper")}>
      <div className={cx("right")}>
        <div className={cx("hot-courses")}>
          <h2>Khóa học nổi bật nhất 🔥</h2>
          <div className={cx("courses-list")}>
            {hottestCourses.map((course) => (
              <Course hot course={course} key={course.id} />
            ))}
          </div>
        </div>
        <div className={cx("hot-posts")}>
          <h2>Bài viết nổi bật nhất 🔥</h2>
          <div className={cx("posts-list")}>
            {hottestPosts.map((post) => (
              <PostSearch hot post={post} key={post.id} />
            ))}
          </div>
        </div>
      </div>
      <div className={cx("left")}>
        <div className={cx("hot-quizzes")}>
          <h2>Trắc nghiệm nổi bật nhất 🔥</h2>
          <div className={cx("quizzes-list")}>
            {hottestQuizzes.map((quiz) => (
              <QuizInfo hot quiz={quiz} key={quiz.id} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
