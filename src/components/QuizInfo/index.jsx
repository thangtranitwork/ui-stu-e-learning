import React, { memo } from "react";
import UserInfo from "../UserInfo";
import Button from "../Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import TimeDisplay from "../TimeDisplay";

const QuizInfo = ({ quiz, hot = false }) => {
  return (
    <div className={`relative rounded-2xl border p-5 transition-all duration-300 group
      ${hot 
        ? "bg-gradient-to-br from-green-500/10 to-teal-500/10 border-green-500/20 hover:border-green-500/40 shadow-lg shadow-green-500/5" 
        : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/[0.08]"}`}>
      <h3 className="text-lg font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors line-clamp-1">
        {quiz?.name}
      </h3>
      <div className="mb-2"><UserInfo user={quiz?.user} /></div>
      <TimeDisplay time={quiz?.createdTime} className="text-xs text-slate-500" />
      <p className="text-slate-400 text-sm mt-2 mb-3 line-clamp-2">{quiz?.description}</p>
      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-4">
        <span className="px-2 py-1 bg-white/5 rounded-lg">{quiz?.numberOfQuestions} câu</span>
        <span className="px-2 py-1 bg-white/5 rounded-lg">{quiz?.duration} phút</span>
        <span className="px-2 py-1 bg-white/5 rounded-lg">{quiz?.playedTimes} lượt</span>
      </div>
      <Button to={`${quiz?.id}`} primary small rightIcon={<FontAwesomeIcon icon={faPlay} />}>
        Bắt đầu
      </Button>
    </div>
  );
};

export default memo(QuizInfo);
