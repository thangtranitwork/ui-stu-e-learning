import React from "react";
import classNames from "classnames/bind";
import styles from "./Course.module.scss";
import UserInfo from "../UserInfo";
import Star from "../Star";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins, faRankingStar } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const cx = classNames.bind(styles);

const Course = ({ course, hot = false, reviewMode = false }) => {
  const CourseContent = (
    <div className={cx("course", "b-shadow", { hot, reviewMode })}>
      <h2 className={cx("course-name")}>
        {course.name}
        <UserInfo user={course.creator} />
      </h2>
      <p>{course.description}</p>
      <p className={cx("course-price")}>
        <span className={cx("icon")}>
          <FontAwesomeIcon icon={faCoins} />
        </span>{" "}
        {course.price} VND
      </p>
      <p className={cx("course-star")}>
        <span className={cx("icon")}>
          <FontAwesomeIcon icon={faRankingStar} />
        </span>{" "}
        <Star rating={course.star} />
      </p>
    </div>
  );

  return reviewMode ? (
    CourseContent
  ) : (
    <Link to={`/courses/${course.id}`}>{CourseContent}</Link>
  );
};

export default Course;
