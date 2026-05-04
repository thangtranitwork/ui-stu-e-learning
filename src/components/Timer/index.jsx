import React, { useEffect, useState } from "react";

const Timer = ({ duration, remainingTime, onTimeout }) => {
  const [time, setTime] = useState(remainingTime || duration);

  useEffect(() => { setTime(remainingTime || duration); }, [remainingTime, duration]);
  useEffect(() => { if (time === 0 && onTimeout) onTimeout(); }, [time, onTimeout]);
  useEffect(() => {
    const interval = setInterval(() => setTime(prev => Math.max(prev - 1, 0)), 1000);
    return () => clearInterval(interval);
  }, []);

  const percentage = (time / (duration * 60)) * 100;
  const color = percentage > 66 ? "#22c55e" : percentage > 33 ? "#f59e0b" : "#ef4444";
  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className="relative w-20 h-20 rounded-full flex items-center justify-center"
      style={{ background: `conic-gradient(${color} ${percentage * 3.6}deg, rgba(255,255,255,0.1) 0deg)` }}>
      <div className="w-16 h-16 rounded-full bg-[#0a0a0a] flex items-center justify-center">
        <span className="text-sm font-bold text-white">{formatTime(time)}</span>
      </div>
    </div>
  );
};

export default Timer;
