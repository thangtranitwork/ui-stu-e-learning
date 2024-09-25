import React, { useState } from "react";
import classNames from "classnames/bind";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import styles from "./RichTextEditor.module.scss";

const cx = classNames.bind(styles);

export default function RichTextEditor({
  label,
  value = "",
  onChange,
  inpopup = false,
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(value !== "");

  return (
    <div
      className={cx("editor-wrapper", "b-shadow", {
        focused: isFocused || value,
        inpopup
      })}
    >
      <ReactQuill
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        modules={modules}
        formats={formats}
        {...props}
      />
      <label className={cx("label", { focused: isFocused || value })}>
        {label}
      </label>
    </div>
  );
}

const modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote", "code-block"],
    [{ align: [] }],
    [{ script: "sub" }, { script: "super" }],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image", "video", "formula"],
    ["clean"], // remove formatting button
  ],
  clipboard: {
    // Tùy chỉnh xử lý clipboard (cắt, dán, copy)
    matchVisual: false, // Cho phép paste vào trình soạn thảo mà không cần giữ lại style gốc
  },
};

const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "code-block",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "video",
  "formula",
  "align",
  "script", // thêm script để hỗ trợ sub và super
];
