import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./UserDetail.module.scss";
import { BACKEND_BASE_URL, DEFAULT_AVATAR_URL } from "../../constant";
import Button from "../../components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faMessage,
  faUserGroup,
  faUserMinus,
  faUserPlus,
  faUserXmark,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UpdateEmail from "../../components/UpdateEmail";
import UpdatePassword from "../../components/UpdatePassword";
import Loader from "../../components/Loader";
import Course from "../../components/Course";
import QuizInfo from "../../components/QuizInfo";
import ViewMore from "../../components/ViewMore";
import QuizHistory from "../../components/QuizHistory";
import { getToken } from "../../App";

const cx = classNames.bind(styles);

export default function UserDetail() {
  const { id: paramId } = useParams();
  const location = useLocation();
  const currentUserId = localStorage.getItem("userId");

  const getId = () => {
    if (location.pathname === "/profile") {
      return currentUserId;
    } else {
      return paramId;
    }
  };

  const id = getId();

  const [user, setUser] = useState(null);
  const avatarImg = useRef();
  const [showUpdateEmail, setShowUpdateEmail] = useState(false);
  const [showUpdatePassword, setShowUpdatePassword] = useState(false);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = getToken();
        const headers = {
          "Content-Type": "application/json",
        };

        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }
        const response = await fetch(`${BACKEND_BASE_URL}/api/users/${id}`, {
          method: "GET",
          headers: headers,
        });

        const data = await response.json();
        console.log(data);

        if (data.code === 200) {
          setUser(data.body);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [id, location.pathname]);

  const handleAvatarChange = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("avatar", avatarImg.current.files[0]);

    fetch(`${BACKEND_BASE_URL}/api/users/update/avatar`, {
      method: "PUT",
      body: formData,
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200) {
          setUser({ ...user, avatar: data.body });
          toast.success("Avatar updated successfully!");
        } else {
          toast.error(data.message);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  const handleAddFriend = () => {
    fetch(`${BACKEND_BASE_URL}/api/friendship/${id}/add`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200) {
          setUser({ ...user, addFriendRequestSent: 1 });
          toast.success("Gửi lời mời kết bạn thành công!");
        } else {
          toast.error(data.message);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  const handleAcceptFriendRequest = () => {
    fetch(`${BACKEND_BASE_URL}/api/friendship/${id}/accept`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200) {
          setUser({ ...user, friend: true});
          toast.success("Đã trở thành bạn bè!");
        } else {
          toast.error(data.message);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  const handleCancelAddFriend = () => {
    fetch(`${BACKEND_BASE_URL}/api/friendship/${id}/cancel`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200) {
          setUser({ ...user, addFriendRequestSent: 0 });
          toast.success("Hủy lời mời kết bạn thành công!");
        } else {
          toast.error(data.message);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  const handleUnfriend = () => {
    fetch(`${BACKEND_BASE_URL}/api/friendship/${id}/unfriend`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200) {
          setUser({ ...user, friend: false });
          toast.success("Hủy kết bạn thành công!");
        } else {
          toast.error(data.message);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  function formatDate(dateString) {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  }

  const handleEditInfoClick = () => {
    window.location.href = "/profile/edit";
  };

  const handleEditEmailClick = () => {
    setShowUpdateEmail(true);
    setShowUpdatePassword(false);
  };

  const handleEditPasswordClick = () => {
    setShowUpdatePassword(true);
    setShowUpdateEmail(false);
  };

  const handleCancel = () => {
    setShowUpdateEmail(false);
    setShowUpdatePassword(false);
  };

  if (!user) {
    return <Loader />;
  }
  return (
    <section className={cx("wrapper")}>
      <div className={cx("user-detail-card")}>
        <div className={cx("avatar-section")}>
          <div className={cx("avatar-wrapper")}>
            <img
              className={cx("avatar")}
              src={user.avatar || DEFAULT_AVATAR_URL}
              alt={`${user.firstname} ${user.lastname}`}
            />
            {currentUserId === user.id && (
              <>
                <input
                  type="file"
                  name="avatar"
                  id="avatar"
                  ref={avatarImg}
                  onChange={handleAvatarChange}
                  className={cx("avatar-input")}
                />
                <label htmlFor="avatar" className={cx("camera-icon")}>
                  <FontAwesomeIcon icon={faCamera} />
                </label>
              </>
            )}
          </div>
          <div className={cx("info-section")}>
            <h1 className={cx("name")}>
              {user.lastname} {user.firstname}
            </h1>
            <em className={cx("bio")}>
              {user.bio || "Học viên STU E-Learning"}
            </em>
            {user.birthday && (
              <p className={cx("info")}>
                <strong>Ngày sinh:</strong> {formatDate(user.birthday)}
              </p>
            )}
            {user.address && (
              <p className={cx("info")}>
                <strong>Địa chỉ:</strong> {user.address}
              </p>
            )}
          </div>
        </div>
        {currentUserId && currentUserId === user.id && (
          <Button
            scaleHoverAnimation
            className={cx("friend-btn")}
            to={"/friends"}
          >
            <FontAwesomeIcon icon={faUserGroup} />
          </Button>
        )}
        {currentUserId && currentUserId === user.id ? (
          <div className={cx("update-section")}>
            <div className={cx("button-container")}>
              <Button
                primary
                onClick={handleEditInfoClick}
                className={cx("edit-button")}
              >
                Chỉnh sửa thông tin
              </Button>
              {!localStorage.getItem("scope").includes("OAUTH2") && (
                <>
                  <Button
                    primary
                    onClick={handleEditEmailClick}
                    className={cx("edit-button")}
                  >
                    Thay đổi email
                  </Button>
                  <Button
                    primary
                    onClick={handleEditPasswordClick}
                    className={cx("edit-button")}
                  >
                    Thay đổi mật khẩu
                  </Button>
                </>
              )}
            </div>
            {!localStorage.getItem("scope").includes("OAUTH2") &&
              showUpdateEmail && <UpdateEmail onCancel={handleCancel} />}
            {!localStorage.getItem("scope").includes("OAUTH2") &&
              showUpdatePassword && <UpdatePassword onCancel={handleCancel} />}
          </div>
        ) : (
          <div>
            {user.friend ? (
              <>
                <Button
                  primary
                  to={`/chat/${id}`}
                  rightIcon={<FontAwesomeIcon icon={faMessage} />}
                >
                  Nhắn tin
                </Button>
                <Button
                  secondary
                  onClick={handleUnfriend}
                  rightIcon={<FontAwesomeIcon icon={faUserXmark} />}
                >
                  Hủy kết bạn
                </Button>
              </>
            ) : user.addFriendRequestSent === 1 ? (
              <Button
                primary
                onClick={handleCancelAddFriend}
                leftIcon={<FontAwesomeIcon icon={faUserMinus} />}
              >
                Hủy lời mời kết bạn
              </Button>
            ) : user.addFriendRequestSent === 0 ? (
              <Button
                primary
                onClick={handleAddFriend}
                leftIcon={<FontAwesomeIcon icon={faUserPlus} />}
              >
                Kết bạn
              </Button>
            ) : user.addFriendRequestSent === -1 ? (
              <Button
                primary
                onClick={handleAcceptFriendRequest}
                leftIcon={<FontAwesomeIcon icon={faUserPlus} />}
              >
                Đồng ý kết bạn
              </Button>
            ) : null}
          </div>
        )}

        <div className={cx("activation-section")}>
          <h2>Khóa học đã tạo</h2>
          <ViewMore
            url={`${BACKEND_BASE_URL}/api/users/${id}/courses/created`}
            render={(course, index) => <Course key={index} course={course} />}
          />

          <h2>Khóa học đã học</h2>
          <ViewMore
            url={`${BACKEND_BASE_URL}/api/users/${id}/courses/learned`}
            render={(course, index) => <Course key={index} course={course} />}
          />

          <h2>Bài kiểm tra đã tạo</h2>
          <ViewMore
            url={`${BACKEND_BASE_URL}/api/users/${id}/quizzes/created`}
            render={(quiz, index) => <QuizInfo key={index} quiz={quiz.quiz} />}
          />

          <h2>Bài kiểm tra đã chơi</h2>
          <ViewMore
            url={`${BACKEND_BASE_URL}/api/users/${id}/quizzes/played`}
            render={(answerQuiz, index) => (
              <QuizHistory key={index} answerQuiz={answerQuiz} />
            )}
          />
        </div>
      </div>
    </section>
  );
}
