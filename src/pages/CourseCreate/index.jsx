import React, { useEffect, useState } from "react";
import styles from "./CourseCreate.module.scss";
import { BACKEND_BASE_URL } from "../../constant";
import { toast } from "react-toastify";
import Button from "../../components/Button";
import Input from "../../components/Input";
import RichTextEditor from "../../components/RichTextEditor";
import { useNavigate } from "react-router-dom";
import Course from "../../components/Course";

export default function CourseCreate() {
  // Sử dụng một state duy nhất để lưu trữ tất cả thông tin của khóa học
  const [courseData, setCourseData] = useState({
    name: "",
    price: "",
    description: "",
    introduction: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Tạo khóa học mới";
  }, []);

  // Hàm xử lý khi giá trị của các input thay đổi
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Hàm xử lý khi giá trị của RichTextEditor thay đổi
  const handleRichTextChange = (value) => {
    setCourseData((prevState) => ({
      ...prevState,
      introduction: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${BACKEND_BASE_URL}/api/courses/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: courseData.name,
          description: courseData.description,
          introduction: courseData.introduction,
          price: parseInt(courseData.price, 10),
        }),
      });
      console.warn(
        JSON.stringify({
          name: courseData.name,
          description: courseData.description,
          introduction: courseData.introduction,
          price: parseInt(courseData.price, 10),
        })
      );

      const data = await response.json();
      console.log(data);
      if (data.code === 200) {
        toast.success("Khóa học đã được tạo thành công!");
        navigate(`/courses/${data.body.id}`);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Đã có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  return (
    <div className={styles.card}>
      <h1 className={styles.title}>Tạo Khóa Học Mới</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          placeholder="Tên khóa học"
          name="name"
          value={courseData.name}
          onChange={handleChange}
        />
        <Input
          placeholder="Giá khóa học"
          name="price"
          value={courseData.price}
          onChange={handleChange}
          type="number"
        />
        <Input
          placeholder="Mô tả khóa học"
          name="description"
          value={courseData.description}
          onChange={handleChange}
        />
        <RichTextEditor
          value={courseData.introduction}
          className={styles.textarea}
          onChange={handleRichTextChange}
          label="Giới thiệu"
        />
        <Button primary large type="submit" className={styles.submitButton}>
          Tạo Khóa Học
        </Button>
      </form>
      <Course
        course={{ id: 1, ...courseData, star: 5.0, creator: { id: 0 } }}
      />
    </div>
  );
}
