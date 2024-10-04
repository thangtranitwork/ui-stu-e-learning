import React, { useState } from "react";
import "./NumberDisplay.scss"; // Import file CSS riêng cho style

// Hàm định dạng số theo các đơn vị (K, M, B)
const formatNumber = (number) => {
  if (number >= 1e9) {
    return (number / 1e9).toFixed(1).replace(/\.0$/, "") + "B";
  } else if (number >= 1e6) {
    return (number / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
  } else if (number >= 1e3) {
    return (number / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
  } else {
    return number.toString();
  }
};

// Hàm định dạng số với dấu cách giữa các nhóm ba chữ số
const formatFullNumber = (number) => {
  return number.toLocaleString("en-US").replace(/,/g, " ");
};

const NumberDisplay = ({ value }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Xử lý hover để hiện full number
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <span
      className="number-display"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {isHovered ? formatFullNumber(value) : formatNumber(value)}
    </span>
  );
};

export default NumberDisplay;
