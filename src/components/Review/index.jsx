import React from "react";
import UserInfo from "../UserInfo";
import Star from "../Star";
import TimeDisplay from "../TimeDisplay";

const Review = ({ review }) => {
  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all space-y-2">
      <div className="flex items-center justify-between">
        <UserInfo user={review.reviewer} />
        <TimeDisplay time={review.createdTime} className="text-xs text-slate-600" />
      </div>
      <p className="text-sm text-slate-300">{review.text}</p>
      <Star rating={review.star} />
    </div>
  );
};

export default Review;
