import classNames from "classnames/bind";
import styles from "./UploadFile.module.scss";
import { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";

export default function UploadFile({ setFile, accept }) {
  const cx = classNames.bind(styles);
  const fileRef = useRef();
  const [selectedFile, setSelectedFile] = useState(null); // Dùng state để lưu file đã chọn

  const handleFileChange = () => {
    const file = fileRef.current.files[0];
    setFile(file);
    setSelectedFile(file); 
  };

  return (
    <span className={cx("wrapper")}>
      <input
        type="file"
        ref={fileRef}
        id="file"
        className={cx("input")}
        onChange={handleFileChange}
        accept={accept}
      />
      <label htmlFor="file" className={cx("label")}>
        <FontAwesomeIcon className={cx("icon")} icon={faUpload} />
        {/* Kiểm tra nếu có file đã chọn thì hiển thị tên, nếu chưa thì hiện "Tải lên" */}
        {selectedFile ? `Thay đổi: ${selectedFile.name}` : "Tải lên"}
      </label>
    </span>
  );
}
