import React from "react";
import styles from "./LessonInfo.module.scss";
import classNames from "classnames/bind";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faSquareCheck,
} from "@fortawesome/free-solid-svg-icons";

const cx = classNames.bind(styles);

export default function LessonInfo({
  lesson,
  index,
  courseId,
  disable,
  editing,
  onClick,
}) {
  const LessonContent = (
    <div
      onClick={onClick}
      className={cx("lesson-info", {
        completed: lesson.completed,
        disable,
        editing,
      })}
    >
      <div className={cx("lesson-index")}>{index}</div>
      <div className={cx("lesson-name")}>{lesson.name}</div>
      <div className={cx("lesson-icon")}>
        {editing ? (
          <FontAwesomeIcon icon={faPenToSquare} />
        ) : (
          lesson.completed && <FontAwesomeIcon icon={faSquareCheck} />
        )}
      </div>
    </div>
  );
  return disable || editing ? (
    LessonContent
  ) : (
    <Link
      to={`/courses/${courseId}/lessons/${lesson.id}`}
      className={cx("lesson-link")}
    >
      {LessonContent}
    </Link>
  );
}
