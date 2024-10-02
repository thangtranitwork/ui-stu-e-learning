import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./Profile.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faCalendar,
  faHome,
  faInfoCircle,
  faImage,
} from "@fortawesome/free-solid-svg-icons";

import Input from "../../components/Input";
import Button from "../../components/Button";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BACKEND_BASE_URL } from "../../constant";
import { getToken } from "../../App";

const cx = classNames.bind(styles);

export default function EditProfile() {
  const [user, setUser] = useState({
    firstname: "",
    lastname: "",
    birthday: "",
    address: "",
    bio: "",
  });
  const [avatar, setAvatar] = useState();
  const [originalUser, setOriginalUser] = useState(null);
  const avatarImg = useRef();
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Chỉnh sửa thông tin";
  }, []);
  useEffect(() => {
    fetch(`${BACKEND_BASE_URL}/api/users/${localStorage.getItem("userId")}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200) {
          setUser({
            firstname: data.body.firstname || "",
            lastname: data.body.lastname || "",
            birthday: data.body.birthday || "",
            address: data.body.address || "",
            bio: data.body.bio || "",
          });
          setOriginalUser({
            firstname: data.body.firstname || "",
            lastname: data.body.lastname || "",
            birthday: data.body.birthday || "",
            address: data.body.address || "",
            bio: data.body.bio || "",
          });
          setAvatar(data.body.avatar);
        } else {
          toast.error(data.message);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  }, []);

  const handleSave = (e) => {
    e.preventDefault();

    fetch(`${BACKEND_BASE_URL}/api/users/update/profile`, {
      method: "PUT",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200) {
          toast.success("Cập nhật thông tin thành công!");
            navigate(`/users/${localStorage.getItem("userId")}`);
        } else {
          toast.error(data.message);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

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
          setAvatar(data.body);
          toast.success("Avatar updated successfully!");
        } else {
          toast.error(data.message);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const isSaveDisabled = JSON.stringify(user) === JSON.stringify(originalUser);

  return (
    <form className={cx("wrapper")} onSubmit={handleSave}>
      <div className={cx("left")}>
        <Input
          type="text"
          placeholder="First Name"
          icon={<FontAwesomeIcon icon={faUser} />}
          name="firstname"
          value={user.firstname}
          onChange={handleChange}
        />
        <Input
          type="text"
          placeholder="Last Name"
          icon={<FontAwesomeIcon icon={faUser} />}
          name="lastname"
          value={user.lastname}
          onChange={handleChange}
        />
        <Input
          type="date"
          placeholder="Birthday"
          icon={<FontAwesomeIcon icon={faCalendar} />}
          name="birthday"
          value={user.birthday}
          onChange={handleChange}
        />
        <Input
          type="text"
          placeholder="Address"
          icon={<FontAwesomeIcon icon={faHome} />}
          name="address"
          value={user.address}
          onChange={handleChange}
        />
        <Input
          type="text"
          placeholder="Bio"
          icon={<FontAwesomeIcon icon={faInfoCircle} />}
          name="bio"
          value={user.bio}
          onChange={handleChange}
        />
      </div>
      <div className={cx("right")}>
        <div className={cx("avatar-section")}>
          <img src={avatar} alt="Avatar" className={cx("avatar")} />
          <input
            type="file"
            name="avatar"
            id="avatar"
            ref={avatarImg}
            onChange={handleAvatarChange}
            className={cx("avatar-input")}
          />
          <label htmlFor="avatar" className={cx("avatar-label")}>
            <FontAwesomeIcon icon={faImage} />
            &nbsp; Change Avatar
          </label>
        </div>
        <Button
          type="submit"
          className={cx("save-btn")}
          primary
          large
          disable={isSaveDisabled}
        >
          Save
        </Button>
        <Button
          className={cx("cancel-btn")}
          secondary
          large
          onClick={handleCancel}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
