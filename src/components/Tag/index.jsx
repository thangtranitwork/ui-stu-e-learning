import classNames from "classnames/bind";
import { memo } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Tag.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
function Tag({ tag, createMode = false, onRemove }) {
  const navigate = useNavigate();
  const cx = classNames.bind(styles);
  return (
    <span className={cx("wrapper")}>
      {createMode ? (
        <p>
          {tag.name}
          <FontAwesomeIcon className={cx("icon")} icon={faXmark} onClick={onRemove}/>
        </p>
      ) : (
        <span onClick={() => navigate(`/posts/tag/${tag.name}`)}>
          {tag.name}
        </span>
      )}
    </span>
  );
}
export default memo(Tag);
