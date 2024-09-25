import React, { useEffect, useState } from "react";
import QuizInfo from "../../components/QuizInfo";
import styles from "./Quizzes.module.scss";
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

export default function Quizzes() {
  const [hottestQuizzes, setHottestQuizzes] = useState([]); // State cho các hot quizzes
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    document.title = "Trắc nghiệm";
  }, []);

  // Fetch hottest quizzes
  useEffect(() => {
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

    fetchHottestQuizzes();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className={cx("quizzes-container")}>
      <div className={cx("header")}>
        <div className={cx("left-buttons")}>
          <Button rounded outline>
            Bài của bạn
          </Button>
          <Button rounded outline>
            Bài đã làm
          </Button>
        </div>
        <div className={cx("right-buttons")}>
          <form onSubmit={handleSearchChange} className={cx("search-form")}>
            <Input
              small
              type="search"
              placeholder="Tìm kiếm"
              value={searchQuery}
              onChange={handleSearchChange}
              actionIcon={<FontAwesomeIcon icon={faMagnifyingGlass} />}
              onActionIconClick={handleSearchChange}
            />
          </form>
          <Button noBackground noHoverAnimation scaleHoverAnimation to={"new"}>
            <FontAwesomeIcon icon={faPenToSquare} />
          </Button>
        </div>
      </div>
      <div className={cx("content")}>
        <div className={cx("hottest-quizzes")}>
          <h2>Trắc nghiệm nổi bật nhất 🔥</h2>
          <div className={cx("quizzes-list")}>
            {hottestQuizzes.map((quiz) => (
              <QuizInfo hot quiz={quiz} key={quiz.id} />
            ))}
          </div>
        </div>
        <div className={cx("normal-quizzes")}>
          <h2>Trắc nghiệm mới nhất</h2>
          <div className={cx("quizzes-list")}>
            <Pagination
              searchQuery={`name=${searchQuery}`}
              url={`${BACKEND_BASE_URL}/api/quizzes/search`}
              render={(quiz) => <QuizInfo quiz={quiz} key={quiz.id} />}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
