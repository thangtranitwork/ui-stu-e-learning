import React from "react";
import UserInfo from "../UserInfo";
import Star from "../Star";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins, faRankingStar } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import NumberDisplay from "../NumberDisplay";

const Course = ({ course, hot = false, reviewMode = false }) => {
  const CourseContent = (
    <div className={`group relative rounded-2xl border transition-all duration-300 p-5 cursor-pointer
      ${hot 
        ? "bg-gradient-to-br from-orange-500/10 to-pink-500/10 border-orange-500/20 hover:border-orange-500/40 shadow-lg shadow-orange-500/5" 
        : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/[0.08]"}`}>
      <h3 className="text-lg font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors line-clamp-1">
        {course.name}
      </h3>
      <div className="mb-3">
        <UserInfo user={course.creator} />
      </div>
      <p className="text-slate-400 text-sm mb-4 line-clamp-2">{course.description}</p>
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-amber-400 text-sm font-semibold">
          <FontAwesomeIcon icon={faCoins} className="text-xs" />
          <NumberDisplay value={course.price} /> VND
        </span>
        <span className="flex items-center gap-1.5 text-sm">
          <FontAwesomeIcon icon={faRankingStar} className="text-indigo-400 text-xs" />
          <Star rating={course.star} />
        </span>
      </div>
    </div>
  );

  return reviewMode ? (
    CourseContent
  ) : (
    <Link to={`/courses/${course.id}`} className="no-underline">{CourseContent}</Link>
  );
};

export default Course;
