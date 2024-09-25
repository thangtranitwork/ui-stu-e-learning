import React from "react";
import Answer from "./Answer";
import styles from "./Question.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const Question = ({ question, onAnswerSelect, quizResults, isQuizSubmitted }) => {
  const result = quizResults?.find((res) => res.id === question.id);

  const cardClass = cx({
    "question-card": true,
    "b-shadow": true,
  });

  return (
    <div className={cardClass}>
      <h3 className={cx("question-title")}>{question.text}</h3>
      <div className={cx("answers-container", {
        "two-answers": question.answers.length === 2,
        "three-answers": question.answers.length === 3,
      })}>
        {question.answers.map((answer, index) => {
          const isCorrect = answer.id === result?.correctId;
          const isChosen = answer.id === result?.chosenId;

          return (
            <Answer
              key={answer.id}
              answer={answer}
              isCorrect={isCorrect}
              isChosen={isChosen}
              onAnswerSelect={onAnswerSelect}
              isDisabled={isQuizSubmitted}
              index={index} // Truyền index vào Answer
            />
          );
        })}
      </div>
    </div>
  );
};

export default Question;
