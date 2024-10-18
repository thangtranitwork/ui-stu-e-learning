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
  const [tab, setTab] = useState(0); //0: mới nhất, 1:của bạn, 2: đã học
  const userId = localStorage.getItem("userId");
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
          <Button rounded outline onClick={() => setTab(0)}>
            Khoá mới nhất
          </Button>
          {localStorage.getItem("scope") &&
            localStorage.getItem("scope").includes("CONTRIBUTOR") && (
              <Button rounded outline onClick={() => setTab(1)}>
                Khoá của bạn
              </Button>
            )}
          <Button rounded outline onClick={() => setTab(2)}>
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
        <div className={cx("right")}>
          <h2>Khóa học nổi bật nhất 🔥</h2>
          <div className={cx("courses-list")}>
            {hottestCourses.map((course) => (
              <Course hot course={course} key={course.id} />
            ))}
          </div>
        </div>
        {tab === 0 && (
          <div className={cx("left")}>
            <h2>Khoá học mới nhất</h2>
            <div className={cx("courses-list")}>
              <Pagination
                searchQuery={`name=${searchQuery}`}
                render={(course) => <Course course={course} key={course.id} />}
                url={`${BACKEND_BASE_URL}/api/courses/search`}
              />
            </div>
          </div>
        )}

        {tab === 1 && (
          <div className={cx("left")}>
            <h2>Khoá học của bạn</h2>
            <div className={cx("courses-list")}>
              <Pagination
                render={(course, index) => (
                  <Course key={index} course={course} />
                )}
                url={`${BACKEND_BASE_URL}/api/users/${userId}/courses/created`}
              />
            </div>
          </div>
        )}

        {tab === 2 && (
          <div className={cx("left")}>
            <h2>Khoá học đã học</h2>
            <div className={cx("courses-list")}>
              <Pagination
                render={(course, index) => (
                  <Course key={index} course={course} />
                )}
                url={`${BACKEND_BASE_URL}/api/users/${userId}/courses/learned`}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
