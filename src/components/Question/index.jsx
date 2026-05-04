import React from "react";
import Answer from "./Answer";

const Question = ({ question, onAnswerSelect, quizResults, isQuizSubmitted }) => {
  const result = quizResults?.find((res) => res.id === question.id);

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
      <h3 className="text-lg font-bold text-white">{question.text}</h3>
      <div className={`grid gap-3 ${question.answers.length === 2 ? "grid-cols-2" : "grid-cols-2"}`}>
        {question.answers.map((answer, index) => {
          const isCorrect = answer.id === result?.correctId;
          const isChosen = answer.id === result?.chosenId;
          return (
            <Answer key={answer.id} answer={answer} isCorrect={isCorrect} isChosen={isChosen}
              onAnswerSelect={onAnswerSelect} isDisabled={isQuizSubmitted} index={index} />
          );
        })}
      </div>
    </div>
  );
};

export default Question;
