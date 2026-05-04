import React, { memo } from "react";
import UserInfo from "../UserInfo";
import Button from "../Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import TimeDisplay from "../TimeDisplay";

const QuizHistory = ({ answerQuiz }) => {
  const isLow = answerQuiz.score <= answerQuiz.numberOfQuestions / 2;

  return (
    <Link to={`/quizzes/${answerQuiz.quiz.id}`} className="no-underline">
      <div className={`rounded-2xl border p-5 transition-all duration-300 group cursor-pointer
        ${answerQuiz.canContinue ? "bg-amber-500/5 border-amber-500/20" : ""}
        ${isLow ? "bg-red-500/5 border-red-500/20" : "bg-emerald-500/5 border-emerald-500/20"}
        hover:border-white/20 hover:bg-white/[0.08]`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors">{answerQuiz.quiz.name}</h3>
          <UserInfo user={answerQuiz.quiz.user} />
        </div>
        <p className="text-slate-400 text-sm mb-2 line-clamp-1">{answerQuiz.quiz.description}</p>
        <TimeDisplay time={answerQuiz.answerTime} className="text-xs text-slate-500" />
        <div className="flex items-center justify-between mt-3">
          <span className={`text-sm font-semibold ${isLow ? "text-red-400" : "text-emerald-400"}`}>
            {answerQuiz.score} / {answerQuiz.numberOfQuestions} điểm
          </span>
          <Button to={`/quizzes/${answerQuiz.quiz.id}`} primary small rightIcon={<FontAwesomeIcon icon={faPlay} />}>
            {answerQuiz.canContinue ? "Tiếp tục" : "Chơi lại"}
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default memo(QuizHistory);
