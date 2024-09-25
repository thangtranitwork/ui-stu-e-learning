import React from "react";
import classNames from "classnames/bind";
import styles from "./Review.module.scss";
import UserInfo from "../UserInfo";
import Star from "../Star";
import TimeDisplay from "../TimeDisplay";

const cx = classNames.bind(styles);

const Review = ({ review }) => {

  return (
    <div className={cx("review")}>
      <UserInfo user={review.reviewer} />
      <TimeDisplay time={review.createdTime}/>
      <p className={cx("content")}>{review.text}</p>
      <Star rating={review.star} />
    </div>
  );
};

export default Review;
