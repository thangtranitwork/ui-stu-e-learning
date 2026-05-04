import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalfAlt } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarOutline } from "@fortawesome/free-regular-svg-icons";

const Star = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<FontAwesomeIcon key={i} icon={faStar} className="text-amber-400 text-xs" />);
    } else if (!Number.isInteger(rating) && i === Math.ceil(rating)) {
      stars.push(<FontAwesomeIcon key={i} icon={faStarHalfAlt} className="text-amber-400 text-xs" />);
    } else {
      stars.push(<FontAwesomeIcon key={i} icon={faStarOutline} className="text-amber-400/30 text-xs" />);
    }
  }
  return (
    <span className="inline-flex items-center gap-0.5">
      {stars}
      <span className="text-xs text-slate-500 ml-1">({rating?.toFixed(2)})</span>
    </span>
  );
};

export default Star;
