import React, { useEffect, useState } from "react";
import Course from "../../components/Course";
import styles from "./Courses.module.scss";
import classNames from "classnames/bind";
import { BACKEND_BASE_URL } from "../../constant";
import Input from "../../components/Input";
import Button from "../../components/Button";
import {
  faMagnifyingGlass,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Pagination from "../../components/Pagination";

const cx = classNames.bind(styles);

export default function Courses() {
  const [hottestCourses, setHottestCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    document.title = "Khoá học";
  }, []);

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

    fetchHottestCourses();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className={cx("courses-container")}>
      <div className={cx("header")}>
        <div className={cx("left-buttons")}>
          {localStorage.getItem("scope") &&
            localStorage.getItem("scope").includes("CONTRIBUTOR") && (
              <Button rounded outline>
                Khoá của bạn
              </Button>
            )}
          <Button rounded outline>
            Khoá đã học
          </Button>
        </div>
        <div className={cx("right-buttons")}>
          <form onSubmit={handleSearchSubmit} className={cx("search-form")}>
            <Input
              type="search"
              placeholder="Tìm kiếm"
              value={searchQuery}
              onChange={handleSearchChange}
              actionIcon={<FontAwesomeIcon icon={faMagnifyingGlass} />}
              onActionIconClick={handleSearchSubmit}
            />
          </form>
          {localStorage.getItem("scope") &&
            localStorage.getItem("scope").includes("CONTRIBUTOR") && (
              <Button
                to="new"
                noBackground
                noHoverAnimation
                scaleHoverAnimation
              >
                <FontAwesomeIcon icon={faPenToSquare} />
              </Button>
            )}
        </div>
      </div>
      <div className={cx("content")}>
        <div className={cx("hottest-courses")}>
          <h2>Khóa học nổi bật nhất 🔥</h2>
          <div className={cx("courses-list")}>
            {hottestCourses.map((course) => (
              <Course hot course={course} key={course.id} />
            ))}
          </div>
        </div>
        <div className={cx("normal-courses")}>
          <h2>Khoá học mới nhất</h2>
          <div className={cx("courses-list")}>
            <Pagination
              searchQuery={`name=${searchQuery}`}
              render={(course) => <Course course={course} key={course.id} />}
              url={`${BACKEND_BASE_URL}/api/courses/search`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
