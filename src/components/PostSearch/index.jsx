import { Link } from "react-router-dom";
import styles from "./PostSearch.module.scss";
import classNames from "classnames/bind";
import UserInfo from "../UserInfo";
import TimeDisplay from "../../components/TimeDisplay";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faHeart } from "@fortawesome/free-solid-svg-icons";
import Tag from "../Tag";
export default function PostSearch({ post, hot }) {
  const cx = classNames.bind(styles);
  console.log(post);

  return (
    <Link to={`/posts/${post.id}`}>
      <div className={cx("post", "b-shadow", { hot })}>
        <h4 className={cx("post-name")}>
          {post.title}
          <UserInfo className={cx("creator")} user={post.creator} />
        </h4>
        <TimeDisplay time={post.createdAt} />
        <div>
          <em>
            <FontAwesomeIcon className={cx("icon", "red")} icon={faHeart} />
            {post.likeCount}
            <FontAwesomeIcon className={cx("icon")} icon={faEye} />
            {post.viewCount}
          </em>
        </div>
        {post.tags.map(t => <Tag key={t.id} tag={t}/>)}
      </div>
    </Link>
  );
}
