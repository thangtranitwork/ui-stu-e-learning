import React, { useEffect, useState } from "react";

export default function TimeDisplay({ time }) {
  const [displayTime, setDisplayTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const currentTime = new Date();
      const inputTime = new Date(time);
      const timeDiff = (currentTime - inputTime) / 1000; // Chênh lệch thời gian tính bằng giây

      if (timeDiff < 60) {
        setDisplayTime("Vừa mới");
      } else if (timeDiff < 3600) {
        const minutes = Math.floor(timeDiff / 60);
        setDisplayTime(`${minutes} phút trước`);
      } else {
        const formattedTime = inputTime.toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        });
        const formattedDate = inputTime.toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
        setDisplayTime(`${formattedTime} ${formattedDate}`);
      }
    };

    updateTime();

    // Cập nhật mỗi phút để tự động thay đổi hiển thị
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, [time]);

  return <em>{displayTime}</em>;
}
