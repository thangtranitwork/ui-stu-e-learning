import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarOutline } from "@fortawesome/free-regular-svg-icons";
import classNames from "classnames/bind";
import styles from "./ReviewInput.module.scss";
import { toast } from "react-toastify";
import { BACKEND_BASE_URL } from "../../constant";
import Button from "../Button";

const cx = classNames.bind(styles);

const ReviewInput = ({ courseId }) => {
  const [selectedStars, setSelectedStars] = useState(5);
  const [reviewText, setReviewText] = useState("");

  const handleStarClick = (index) => {
    setSelectedStars(index);
  };

  const handleReviewTextChange = (e) => {
    const value = e.target.value;
    if (value.length <= 255) {
      setReviewText(value);
    }
  };

  const handleSubmitReview = async () => {
    const wordCount = reviewText.trim().split(/\s+/).length;

    if (reviewText.length < 3) {
      toast.error("Đánh giá phải có ít nhất 3 ký tự!");
      return;
    }

    if (wordCount < 3) {
      toast.error("Đánh giá phải có ít nhất 3 từ!");
      return;
    }

    try {
      const response = await fetch(
        `${BACKEND_BASE_URL}/api/courses/${courseId}/reviews/new`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({
            star: selectedStars,
            text: reviewText,
          }),
        }
      );

      const data = await response.json();
      if (data.code === 200) {
        toast.success("Đánh giá đã được gửi!");
      } else {
        toast.error(data.message || "Có lỗi xảy ra!");
      }
    } catch (error) {
      toast.error("Không thể gửi đánh giá. Vui lòng thử lại sau.");
    }
  };

  return (
    <div className={cx("review-input-container")}>
      <div className={cx("review-box")}>
        <textarea
          placeholder="Đánh giá (tối thiểu 3 từ)"
          className={cx("input")}
          value={reviewText}
          onChange={handleReviewTextChange}
        />
        <div className={cx("overlay-content")}>
          <div className={cx("stars")}>
            {[1, 2, 3, 4, 5].map((star, index) => (
              <FontAwesomeIcon
                key={index}
                className={cx("star")}
                icon={index < selectedStars ? faStar : faStarOutline}
                onClick={() => handleStarClick(index + 1)}
              />
            ))}
          </div>
          <div className={cx("submit-area")}>
            <div className={cx("char-count")}>{reviewText.length}/255</div>
            <Button
              primary
              onClick={handleSubmitReview}
              className={cx("submit-button")}
              rightIcon={<FontAwesomeIcon icon={faComment} />}
            >
              Gửi đánh giá
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewInput;
