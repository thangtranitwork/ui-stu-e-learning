// src/components/Quiz.js

import React, { memo } from "react";
import classNames from "classnames/bind";
import styles from "./QuizInfo.module.scss";
import UserInfo from "../UserInfo";
import Button from "../Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import TimeDisplay from "../TimeDisplay";

const cx = classNames.bind(styles);

const QuizInfo = ({ quiz, hot = false }) => {  
  return (
    <div className={cx("quiz", "b-shadow", { hot })}>
      <h2 className={cx("quiz-name")}>
        {quiz?.name}
        <UserInfo user={quiz?.user} />
      </h2>
      <TimeDisplay time={quiz?.createdTime} />
      <p className={cx("quiz-description")}>{quiz?.description}</p>
      <p>Số câu hỏi: {quiz?.numberOfQuestions}</p>
      <p className={cx("quiz-duration")}>Thời gian: {quiz?.duration} phút</p>
      <p className={cx("quiz-playedTimes")}>Lượt chơi: {quiz?.playedTimes}</p>

      <Button
        to={`${quiz?.id}`}
        primary
        rightIcon={<FontAwesomeIcon icon={faPlay} />}
      >
        Bắt đầu
      </Button>
    </div>
  );
};

export default memo(QuizInfo);
