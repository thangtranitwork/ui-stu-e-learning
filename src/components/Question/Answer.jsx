import React from "react";

const colors = [
  "from-indigo-500/20 to-indigo-600/20 border-indigo-500/30 hover:border-indigo-400",
  "from-pink-500/20 to-pink-600/20 border-pink-500/30 hover:border-pink-400",
  "from-amber-500/20 to-amber-600/20 border-amber-500/30 hover:border-amber-400",
  "from-emerald-500/20 to-emerald-600/20 border-emerald-500/30 hover:border-emerald-400",
];

const Answer = ({ answer, onAnswerSelect, isCorrect, isChosen, isDisabled, index }) => {
  let stateClass = "";
  if (isDisabled) {
    if (isCorrect) stateClass = "!bg-emerald-500/20 !border-emerald-500 ring-2 ring-emerald-500/30";
    else if (isChosen && !isCorrect) stateClass = "!bg-red-500/20 !border-red-500 ring-2 ring-red-500/30";
    else stateClass = "opacity-50";
  }

  return (
    <div
      className={`bg-gradient-to-br ${colors[index % 4]} border rounded-xl p-4 cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
        ${isDisabled ? "pointer-events-none" : ""} ${stateClass}`}
      onClick={() => !isDisabled && onAnswerSelect(answer.id)}
    >
      <p className="text-sm font-medium text-white text-center">{answer.text}</p>
    </div>
  );
};

export default Answer;
