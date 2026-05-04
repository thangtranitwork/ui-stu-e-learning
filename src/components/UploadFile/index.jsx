import { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";

export default function UploadFile({ setFile, accept }) {
  const fileRef = useRef();
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = () => {
    const file = fileRef.current.files[0];
    setFile(file);
    setSelectedFile(file);
  };

  return (
    <span className="inline-flex">
      <input type="file" ref={fileRef} id="file" className="hidden" onChange={handleFileChange} accept={accept} />
      <label htmlFor="file" className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-300 cursor-pointer hover:bg-white/10 hover:border-white/20 transition-all">
        <FontAwesomeIcon icon={faUpload} className="text-indigo-400" />
        {selectedFile ? `Thay đổi: ${selectedFile.name}` : "Tải lên"}
      </label>
    </span>
  );
}
