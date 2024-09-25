import React from "react";
import classNames from "classnames/bind";
import styles from "./Answer.module.scss";

const cx = classNames.bind(styles);

const Answer = ({ answer, onAnswerSelect, isCorrect, isChosen, isDisabled, index }) => {
  const answerClass = cx({
    answer: true,
    "b-shadow": true,
    correct: isCorrect, // Hiển thị màu xanh cho đáp án đúng, bất kể có chọn hay không
    incorrect: !isCorrect && isChosen, // Đáp án sai và đã chọn
    neutral: !isChosen && !isCorrect && isDisabled, // Đáp án không chọn và không đúng
    disabled: isDisabled, // Vô hiệu hóa sau khi submit
    [`color-${index % 4 + 1}`]: true, // Chọn màu dựa trên index
  });

  return (
    <div
      className={answerClass}
      onClick={() => !isDisabled && onAnswerSelect(answer.id)}
    >
      <p className={cx("answer-content")}>{answer.text}</p>
    </div>
  );
};

export default Answer;
