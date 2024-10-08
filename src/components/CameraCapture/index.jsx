import React, { useRef, useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "../Button";
const CameraCapture = ({ onCapture }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        videoRef.current.srcObject = stream;
      } catch (error) {
        toast.error(`Error accessing camera: ${error}`);
      }
    };
    startCamera();
  }, []);

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      setImageSrc(URL.createObjectURL(blob)); // Hiển thị hình ảnh đã chụp
      // Tắt camera sau khi chụp
      const stream = video.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
    }, "image/png");
  };

  const retakeImage = () => {
    setImageSrc(null);
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        videoRef.current.srcObject = stream;
      } catch (error) {
        toast.error(`Error accessing camera: ${error}`);
      }
    };
    startCamera();
  };

  const handleOK = () => {
    const canvas = canvasRef.current;
    canvas.toBlob((blob) => {
      setImageSrc(URL.createObjectURL(blob)); // Hiển thị hình ảnh đã chụp
      if (onCapture) {
        onCapture(blob); // Truyền file Blob ra ngoài component để gửi
      }
    }, "image/png");
  };

  return (
    <div>
      <h2>Camera Capture</h2>
      {!imageSrc ? (
        <video
          ref={videoRef}
          autoPlay
          width="600"
          height="450"
          style={{ border: "1px solid black" }}
        ></video>
      ) : (
        <div>
          <h3>Captured Image:</h3>
          <img src={imageSrc} alt="Captured" />
        </div>
      )}

      <canvas
        ref={canvasRef}
        width="600"
        height="450"
        style={{ display: "none" }}
      ></canvas>

      <div>
        {!imageSrc ? (
          <Button onClick={captureImage}>Chụp</Button>
        ) : (
          <div>
            <Button secondary onClick={retakeImage}>
              Chụp lại
            </Button>
            <Button primary onClick={handleOK}>
              OK
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraCapture;
