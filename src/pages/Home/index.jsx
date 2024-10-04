import React, { useEffect } from "react";
import CameraCapture from "../../components/CameraCapture";
export default function Home() {
  useEffect(() => {
    document.title = "STU E-Learning";
  }, []);
  return (
    <div>
      <CameraCapture/>
    </div>
  );
}
