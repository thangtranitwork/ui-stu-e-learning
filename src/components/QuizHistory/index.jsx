// src/components/Quiz.js

import React, { memo } from "react";
import classNames from "classnames/bind";
import styles from "./QuizHistory.module.scss";
import UserInfo from "../UserInfo";
import Button from "../Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import TimeDisplay from "../TimeDisplay";

const cx = classNames.bind(styles);

const QuizHistory = ({ answerQuiz }) => {
  return (
    <Link to={`/quizzes/${answerQuiz.quiz.id}`} className={cx("quiz-link")}>
      <div
        className={cx("quiz", "b-shadow", {
          "can-continue": answerQuiz.canContinue,
          low: answerQuiz.score <= answerQuiz.numberOfQuestions / 2,
          high: answerQuiz.score > answerQuiz.numberOfQuestions / 2
        })}
      >
        <h2 className={cx("quiz-name")}>
          {answerQuiz.quiz.name}
          <UserInfo user={answerQuiz.quiz.user} />
        </h2>
        <p>{answerQuiz.quiz.description}</p>
        <TimeDisplay time={answerQuiz.answerTime}/>
        <p>
          Số điểm: {answerQuiz.score} / {answerQuiz.numberOfQuestions}
        </p>
        <Button
          to={`/quizzes/${answerQuiz.quiz.id}`}
          className={cx("quiz-link")}
          primary
          rightIcon={<FontAwesomeIcon icon={faPlay} />}
        >
          {answerQuiz.canContinue ? "Tiếp tục" : "Chơi lại"}{" "}
        </Button>
      </div>
    </Link>
  );
};

export default memo(QuizHistory);
