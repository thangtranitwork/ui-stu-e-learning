import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faSquareCheck } from "@fortawesome/free-solid-svg-icons";

export default function LessonInfo({ lesson, index, courseId, disable, editing, onClick }) {
  const LessonContent = (
    <div onClick={onClick}
      className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 group cursor-pointer
        ${lesson.completed ? "bg-emerald-500/5 border-emerald-500/20" : "bg-white/5 border-white/5"}
        ${disable ? "opacity-50 pointer-events-none" : "hover:border-white/20 hover:bg-white/[0.08]"}
        ${editing ? "ring-2 ring-indigo-500/30 border-indigo-500/30" : ""}`}>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0
        ${lesson.completed ? "bg-emerald-500/20 text-emerald-400" : "bg-white/10 text-slate-400"}`}>
        {index}
      </div>
      <span className="flex-1 text-sm font-medium text-slate-300 group-hover:text-white transition-colors truncate">{lesson.name}</span>
      <div className="flex-shrink-0 text-sm">
        {editing ? (
          <FontAwesomeIcon icon={faPenToSquare} className="text-indigo-400" />
        ) : (
          lesson.completed && <FontAwesomeIcon icon={faSquareCheck} className="text-emerald-400" />
        )}
      </div>
    </div>
  );

  return disable || editing ? (
    LessonContent
  ) : (
    <Link to={`/courses/${courseId}/lessons/${lesson.id}`} className="no-underline block">
      {LessonContent}
    </Link>
  );
}
