import classNames from "classnames/bind";
import styles from "./Post.module.scss";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { BACKEND_BASE_URL } from "../../constant";
import UserInfo from "../../components/UserInfo";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import TimeDisplay from "../../components/TimeDisplay";
import { getToken } from "../../App";
export default function Post() {
  const cx = classNames.bind(styles);
  const { postId } = useParams();
  const [post, setPost] = useState();
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = getToken();
        const headers = {
          "Content-Type": "application/json",
        };

        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(
          `${BACKEND_BASE_URL}/api/posts/${postId}`,
          {
            method: "GET",
            headers: headers,
          }
        );
        const data = await response.json();

        if (data.code === 200) {
        setPost(data.body);
          console.log(data);

          document.title = data.body.tittle;
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchCourse();
  }, [postId]);

  return (
    <div className={cx("wrapper")}>
      <h2>
        {post?.title} <UserInfo user={post?.creator}></UserInfo>
      </h2>
      <div dangerouslySetInnerHTML={{ __html: post?.content }}></div>
      <TimeDisplay time={post?.createAt} />
      <div>
        <Button noBackground scaleHoverAnimation leftIcon={<FontAwesomeIcon icon={faHeart} />}>{post?.likeCount}</Button>
      </div>
      <div>
        <Input placeholder={"Bình luận"}/>
      </div>
    </div>
  );
}
