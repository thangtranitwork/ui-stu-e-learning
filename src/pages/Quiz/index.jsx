import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Question from "../../components/Question";
import Timer from "../../components/Timer";
import styles from "./Quiz.module.scss";
import { BACKEND_BASE_URL } from "../../constant";
import { toast } from "react-toastify";
import Button from "../../components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import Popup from "../../components/Popup";
const Quiz = () => {
  const { quizId } = useParams();
  const [quizName, setQuizName] = useState("");
  const [score, setScore] = useState();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [quizResults, setQuizResults] = useState(null);
  const [duration, setDuration] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  useEffect(() => {
    document.title = `Quiz ${quizName}`;
  }, [quizName]);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch(
          `${BACKEND_BASE_URL}/api/quizzes/${quizId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // Đính kèm accessToken
            },
          }
        );
        const data = await response.json();
        if (data.code === 200) {
          const { questions, remainingTime, duration, name } = data.body;
          setQuestions(questions);
          setRemainingTime(remainingTime);
          setDuration(duration);
          setQuizName(name);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchQuiz();
  }, [quizId]);

  const handleAnswerSelect = (answerId) => {
    if (isQuizSubmitted) return; // Không cho phép chọn nếu đã submit

    setQuestions((prevQuestions) => {
      const updatedQuestions = prevQuestions.map((q, index) =>
        index === currentQuestionIndex ? { ...q, selectedAnswer: answerId } : q
      );

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setTimeout(() => {
          submitQuiz(updatedQuestions);
        }, 0);
      }

      return updatedQuestions;
    });
  };

  const submitQuiz = async (updatedQuestions) => {
    try {
      const response = await fetch(
        `${BACKEND_BASE_URL}/api/quizzes/${quizId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({
            answers: updatedQuestions.map((q) => ({
              questionId: q.id,
              answerId: q.selectedAnswer,
            })),
          }),
        }
      );

      const data = await response.json();

      if (data.code === 200) {
        setScore(data.body.score);
        setIsQuizSubmitted(true);
        setIsPopupOpen(true);
        setQuizResults(data.body.questionResultResponses);
        console.log(data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const startQuiz = () => {
    let countdownTimer = 3;
    const interval = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
      countdownTimer--;

      if (countdownTimer === 0) {
        clearInterval(interval);
        setIsQuizStarted(true);
      }
    }, 1000);
  };

  return (
    <div className={styles.quizContainer}>
      <h2 className={styles.quizInfo}>
        {quizName} {duration} phút
        {score >= 0 && (
          <strong className={styles.score}>
            Điểm số: {score}/{questions.length}
          </strong>
        )}
      </h2>
      {!isQuizStarted ? (
        <div>
          {/* Chỉ ẩn nút Start, không ẩn Countdown */}
          {countdown === 3 && (
            <Button
              primary
              className={styles.startButton}
              onClick={startQuiz}
              rightIcon={<FontAwesomeIcon icon={faPlay} />}
              large
            >
              Bắt đầu Quiz
            </Button>
          )}
          {countdown < 3 && countdown > 0 && (
            <div className={styles.countdown}>{countdown}</div>
          )}
        </div>
      ) : (
        <>
          {!isQuizSubmitted ? (
            <>
              <div className={styles.topBar}>
                <Timer
                  remainingTime={remainingTime}
                  duration={duration}
                  onTimeout={submitQuiz}
                />
                <div className={styles.questionCounter}>
                  {currentQuestionIndex + 1}/{questions.length}
                </div>
              </div>
              {questions.length > 0 && (
                <Question
                  question={questions[currentQuestionIndex]}
                  onAnswerSelect={handleAnswerSelect}
                  quizResults={quizResults}
                  isQuizSubmitted={isQuizSubmitted}
                />
              )}
            </>
          ) : (
            questions.length > 0 && (
              <div>
                <Popup
                  isOpen={isPopupOpen}
                  title={quizName}
                  onClose={() => setIsPopupOpen(false)}
                >
                  <p>
                    Điểm số của bạn là: {score} / {questions.length}
                  </p>

                  <Button secondary to={"/quizzes"}>
                    Trắc nghiệm khác
                  </Button>
                  <Button primary onClick={() => window.location.reload(false)}>
                    Chơi lại
                  </Button>
                </Popup>
                {questions.map((question) => (
                  <Question
                    key={question.id}
                    onAnswerSelect={handleAnswerSelect}
                    question={question}
                    quizResults={quizResults}
                    isQuizSubmitted={isQuizSubmitted}
                  />
                ))}
              </div>
            )
          )}
        </>
      )}
    </div>
  );
};

export default Quiz;
