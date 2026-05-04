import React, { useRef, useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "../Button";

const CameraCapture = ({ onCapture }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const startCamera = async () => {
    setIsLoading(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraOn(true);
      } else {
        stream.getTracks().forEach((track) => track.stop());
        toast.error("Video element chưa sẵn sàng");
      }
    } catch (error) {
      toast.error(`Lỗi khi truy cập camera: ${error.message}`);
      setIsCameraOn(false);
    } finally {
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      if (videoRef.current) videoRef.current.srcObject = null;
    }
    setIsCameraOn(false);
  };

  const toggleCamera = () => { isCameraOn ? stopCamera() : startCamera(); };

  useEffect(() => {
    const timer = setTimeout(() => { startCamera(); }, 100);
    return () => { clearTimeout(timer); stopCamera(); };
  }, []);

  const captureImage = () => {
    if (!isCameraOn) { toast.error("Camera chưa được bật!"); return; }
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) { toast.error("Video hoặc canvas chưa sẵn sàng!"); return; }
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (blob) { setImageSrc(URL.createObjectURL(blob)); stopCamera(); }
      else { toast.error("Không thể tạo hình ảnh!"); }
    }, "image/png");
  };

  const retakeImage = () => { setImageSrc(null); startCamera(); };

  const handleOK = () => {
    const canvas = canvasRef.current;
    if (!canvas) { toast.error("Canvas chưa sẵn sàng!"); return; }
    canvas.toBlob((blob) => { if (onCapture && blob) onCapture(blob); }, "image/png");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button onClick={toggleCamera} disabled={isLoading} primary={!isCameraOn} secondary={isCameraOn} small>
          {isLoading ? "Đang tải..." : isCameraOn ? "Tắt Camera" : "Bật Camera"}
        </Button>
        <span className="text-xs text-slate-500">
          {isCameraOn ? "✅ Đang bật" : "❌ Đã tắt"}
        </span>
      </div>

      {!imageSrc ? (
        isCameraOn ? (
          <video ref={videoRef} autoPlay playsInline muted className="w-full max-w-[480px] rounded-xl border border-white/10" />
        ) : (
          <div className="w-full max-w-[480px] aspect-[4/3] rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-sm text-slate-600">
            Camera đã tắt
          </div>
        )
      ) : (
        <div className="space-y-2">
          <p className="text-sm text-slate-400">Hình ảnh đã chụp:</p>
          <img src={imageSrc} alt="Captured" className="max-w-[480px] rounded-xl border border-white/10" />
        </div>
      )}

      <canvas ref={canvasRef} width="600" height="450" className="hidden" />

      <div className="flex items-center gap-3">
        {!imageSrc ? (
          <Button onClick={captureImage} disabled={!isCameraOn} primary small>Chụp</Button>
        ) : (
          <>
            <Button secondary small onClick={retakeImage}>Chụp lại</Button>
            <Button primary small onClick={handleOK}>Xác nhận</Button>
          </>
        )}
      </div>
    </div>
  );
};

export default CameraCapture;