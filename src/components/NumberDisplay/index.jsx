import React, { useState } from "react";

const formatNumber = (number) => {
  if (number >= 1e9) return (number / 1e9).toFixed(1).replace(/\.0$/, "") + "B";
  else if (number >= 1e6) return (number / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
  else if (number >= 1e3) return (number / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
  return number.toString();
};

const formatFullNumber = (number) => number.toLocaleString("en-US").replace(/,/g, " ");

const NumberDisplay = ({ value }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <span className="cursor-default hover:text-indigo-400 transition-colors"
      onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      {isHovered ? formatFullNumber(value) : formatNumber(value)}
    </span>
  );
};

export default NumberDisplay;
