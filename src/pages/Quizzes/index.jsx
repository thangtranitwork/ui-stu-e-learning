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
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { toast } from "react-toastify";
import QuizHistory from "../../components/QuizHistory";

const cx = classNames.bind(styles);

export default function Quizzes() {
  const [hottestQuizzes, setHottestQuizzes] = useState([]); // State cho các hot quizzes
  const [searchQuery, setSearchQuery] = useState("");
  const [quizzes, setQuizzes] = useState([]);
  const [tab, setTab] = useState(0); //0: mới nhất, 1:của bạn, 2: đã làm
  const userId = localStorage.getItem("userId");
  useEffect(() => {
    document.title = "Trắc nghiệm";
    const socket = new SockJS(`${BACKEND_BASE_URL}/ws`);
    const client = Stomp.over(socket);

    client.connect(
      {},
      () => {
        client.subscribe(`/quiz`, (q) => {
          setQuizzes((prevQuizzes) => [...prevQuizzes, JSON.parse(q.body)]);
        });
      },
      () => {
        toast.error("Có lỗi xảy ra khi kết nối WebSocket!");
      }
    );
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
          <Button rounded outline onClick={() => setTab(0)}>
            Bài mới nhất
          </Button>
          {userId && (
            <>
              <Button rounded outline onClick={() => setTab(1)}>
                Bài của bạn
              </Button>
              <Button rounded outline onClick={() => setTab(2)}>
                Bài đã làm
              </Button>
            </>
          )}
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
        <div className={cx("right")}>
          <h2>Trắc nghiệm nổi bật nhất 🔥</h2>
          <div className={cx("quizzes-list")}>
            {hottestQuizzes.map((quiz) => (
              <QuizInfo hot quiz={quiz} key={quiz.id} />
            ))}
          </div>
        </div>
        {tab === 0 && (
          <div className={cx("left")}>
            <h2>Trắc nghiệm mới nhất</h2>
            <div className={cx("quizzes-list")}>
              {quizzes?.map((quiz) => (
                <QuizInfo quiz={quiz} key={quiz.id} />
              ))}
              <Pagination
                searchQuery={`name=${searchQuery}`}
                url={`${BACKEND_BASE_URL}/api/quizzes/search`}
                render={(quiz) => <QuizInfo quiz={quiz} key={quiz.id} />}
              />
            </div>
          </div>
        )}

        {tab === 1 && (
          <div className={cx("left")}>
            <h2>Trắc nghiệm của bạn</h2>
            <div className={cx("quizzes-list")}>
              {quizzes?.map((quiz) => (
                <QuizInfo quiz={quiz} key={quiz.id} />
              ))}
              <Pagination
                url={`${BACKEND_BASE_URL}/api/users/${userId}/quizzes/created`}
                render={(quiz) => <QuizInfo quiz={quiz} key={quiz.id} />}
              />
            </div>
          </div>
        )}

        {tab === 2 && (
          <div className={cx("left")}>
            <h2>Trắc nghiệm đã làm</h2>
            <div className={cx("quizzes-list")}>
              {quizzes?.map((quiz) => (
                <QuizInfo quiz={quiz} key={quiz.id} />
              ))}
              <Pagination
                url={`${BACKEND_BASE_URL}/api/users/${userId}/quizzes/played`}
                render={(answerQuiz, index) => (
                  <QuizHistory key={index} answerQuiz={answerQuiz} />
                )}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
