import { useRef, useState } from "react";
import TimeDisplay from "../TimeDisplay";
import { UserAvartarOnly } from "../UserInfo";
import Popup from "../Popup";
import { faFileArrowDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Message({ message, own }) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const downloadRef = useRef();
  const handleDownload = () => { downloadRef.current.click(); };

  return (
    <div className={`flex items-end gap-2 mb-3 ${own ? "flex-row-reverse" : ""}`}>
      <Popup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)}
        title={<FontAwesomeIcon icon={faFileArrowDown} onClick={handleDownload} className="cursor-pointer" />}>
        <a href={message.content} download ref={downloadRef} className="hidden"></a>
        <img src={message.content} className="max-w-full max-h-80 rounded-xl" alt="preview" />
      </Popup>

      {!own && <UserAvartarOnly user={message.sender} />}

      <div className={`flex flex-col gap-1 max-w-[70%] ${own ? "items-end" : "items-start"}`}>
        {message.type === "IMAGE" ? (
          <img onClick={() => setIsPopupOpen(true)} src={message.content}
            className="max-w-[280px] rounded-2xl cursor-pointer hover:opacity-90 transition-opacity border border-white/10" alt="img" />
        ) : (
          <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words
            ${own 
              ? "bg-indigo-600 text-white rounded-br-md" 
              : "bg-white/10 text-slate-200 rounded-bl-md"}`}>
            {message.content}
          </div>
        )}
        <TimeDisplay className="text-[10px] text-slate-600 px-1" time={message.createdAt} />
      </div>

      {own && <UserAvartarOnly user={message.sender} />}
    </div>
  );
}
