import classNames from "classnames/bind";
import styles from "./LessonCreate.module.scss";
import Input from "../../components/Input";
import RichTextEditor from "../../components/RichTextEditor";
import { useNavigate, useParams } from "react-router-dom";
import {useEffect, useState } from "react";
import Button from "../../components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { BACKEND_BASE_URL } from "../../constant";
import { getToken } from "../../App";
export default function Index() {
  const { courseId } = useParams();
  const [name, setName] = useState("");
  const [theory, setTheory] = useState("");
  const cx = classNames.bind(styles);
  const handleTheoryChange = (value) => setTheory(value);
  const navigate = useNavigate();
  useEffect(() => {document.title = "Thêm bài học"}, [navigate]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    validate();
    try {
      const response = await fetch(
        `${BACKEND_BASE_URL}/api/courses/${courseId}/lessons/new`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({
            name,
            theory,
          }),
        }
      );

      const data = await response.json();
      if (data.code === 200) {
        toast.success("Thêm bài học thành công!");
        navigate(`/courses/${courseId}/edit`);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching hottest posts:", error);
    }
  };
  const validate = () => {
    if (name === "") toast.error("Tên bài học không được để trống!");
    if (theory === "") toast.error("Nội dung bài học không được để trống!");
  };
  return (
    <form onSubmit={handleSubmit} className={cx("card")}>
      <Input
        placeholder={"Tên bài học"}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <RichTextEditor
        value={theory}
        label={"Nội dung bài học"}
        onChange={handleTheoryChange}
      />
      <Button
        primary
        type="submit"
        rightIcon={<FontAwesomeIcon icon={faPlus} />}
      >
        Thêm bài học
      </Button>
    </form>
  );
}
