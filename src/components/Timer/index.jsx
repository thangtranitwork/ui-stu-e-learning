import React, { useEffect, useState } from "react";
import styles from "./Timer.module.scss";

const Timer = ({ duration, remainingTime, onTimeout }) => {
  const [time, setTime] = useState(remainingTime || duration);

  useEffect(() => {
    // Nếu remainingTime được thay đổi, cập nhật lại time
    setTime(remainingTime || duration);
  }, [remainingTime, duration]);

  useEffect(() => {
    if (time === 0 && onTimeout) {
      onTimeout();
    }
  }, [time, onTimeout]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prevTime) => Math.max(prevTime - 1, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const percentage = (time / (duration * 60)) * 100;
  
  const gradientColor = percentage > 66 ? 'green' : (percentage > 33) ? 'orange': 'red';

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div
      className={styles.circle}
      style={{
        background: `conic-gradient(${gradientColor} ${percentage * 3.6}deg, #ffffff 0deg)`
      }}
    >
      <div className={styles.innerCircle}>
        <span className={styles.timeText}>{formatTime(time)}</span>
      </div>
    </div>
  );
};

export default Timer;
