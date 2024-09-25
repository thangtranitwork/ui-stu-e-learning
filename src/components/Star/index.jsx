// components/Star.js
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalfAlt } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarOutline } from "@fortawesome/free-regular-svg-icons";
import classNames from "classnames/bind";
import styles from "./Star.module.scss";

const cx = classNames.bind(styles);

const Star = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(
        <FontAwesomeIcon key={i} icon={faStar} className={cx("star")} />
      );
    } else if (!Number.isInteger(rating) && i === Math.ceil(rating)) {
      stars.push(
        <FontAwesomeIcon key={i} icon={faStarHalfAlt} className={cx("star")} />
      );
    } else {
      stars.push(
        <FontAwesomeIcon key={i} icon={faStarOutline} className={cx("star")} />
      );
    }
  }
  return (
    <span className={cx("star-rating")}>
      {stars}({rating.toFixed(2)})
    </span>
  );
};

export default Star;
