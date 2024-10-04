import styles from "./Comment.module.scss";
import classNames from "classnames/bind";
import UserInfo from "../UserInfo";
import TimeDisplay from "../../components/TimeDisplay";
export default function Comment({ comment }) {
  const cx = classNames.bind(styles);
  console.log(comment);
  
  return (
    <div className={cx("comment", "b-shadow")}>
      <div>
        <UserInfo className={cx("creator")} user={comment.creator} />
      </div>
      <p className={cx("content")}>{comment.content}</p>
      <TimeDisplay className={cx("time")} time={comment.createdAt} />
    </div>
  );
}
