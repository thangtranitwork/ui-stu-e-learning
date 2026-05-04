import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarOutline } from "@fortawesome/free-regular-svg-icons";
import { toast } from "react-toastify";
import { BACKEND_BASE_URL } from "../../constant";
import Button from "../Button";
import { getToken } from "../../App";

const ReviewInput = ({ courseId }) => {
  const [selectedStars, setSelectedStars] = useState(5);
  const [reviewText, setReviewText] = useState("");

  const handleStarClick = (index) => setSelectedStars(index);
  const handleReviewTextChange = (e) => { if (e.target.value.length <= 255) setReviewText(e.target.value); };

  const handleSubmitReview = async () => {
    const wordCount = reviewText.trim().split(/\s+/).length;
    if (reviewText.length < 3) { toast.error("Đánh giá phải có ít nhất 3 ký tự!"); return; }
    if (wordCount < 3) { toast.error("Đánh giá phải có ít nhất 3 từ!"); return; }

    try {
      const response = await fetch(`${BACKEND_BASE_URL}/api/courses/${courseId}/reviews/new`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ star: selectedStars, text: reviewText }),
      });
      const data = await response.json();
      if (data.code === 200) { toast.success("Đánh giá đã được gửi!"); } else { toast.error(data.message || "Có lỗi xảy ra!"); }
    } catch (error) { toast.error("Không thể gửi đánh giá. Vui lòng thử lại sau."); }
  };

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-5 space-y-4">
      <textarea
        placeholder="Đánh giá (tối thiểu 3 từ)"
        className="w-full h-24 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm resize-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-slate-600"
        value={reviewText}
        onChange={handleReviewTextChange}
      />
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star, index) => (
            <FontAwesomeIcon
              key={index}
              className="text-amber-400 text-lg cursor-pointer hover:scale-125 transition-transform"
              icon={index < selectedStars ? faStar : faStarOutline}
              onClick={() => handleStarClick(index + 1)}
            />
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-600">{reviewText.length}/255</span>
          <Button primary small onClick={handleSubmitReview} rightIcon={<FontAwesomeIcon icon={faComment} />}>
            Gửi đánh giá
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReviewInput;
