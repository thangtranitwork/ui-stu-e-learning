import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function RichTextEditor({ label, value = "", onChange, inpopup = false, ...props }) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`relative rounded-2xl border transition-all duration-200 overflow-hidden
      ${isFocused || value ? "border-indigo-500 ring-2 ring-indigo-500/20" : "border-white/10"}
      ${inpopup ? "max-h-[300px]" : ""}`}>
      <ReactQuill value={value} onChange={onChange} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(value !== "")}
        modules={modules} formats={formats} {...props} />
      <label className={`absolute left-4 transition-all duration-200 pointer-events-none z-10
        ${isFocused || value ? "-top-3 text-xs text-indigo-400 bg-[#0a0a0a] px-2" : "top-3 text-sm text-slate-500"}`}>
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
    [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
    ["link", "image", "video", "formula"],
    ["clean"],
  ],
  clipboard: { matchVisual: false },
};

const formats = [
  "header", "font", "size", "bold", "italic", "underline", "strike",
  "blockquote", "code-block", "list", "bullet", "indent", "link",
  "image", "video", "formula", "align", "script",
];
