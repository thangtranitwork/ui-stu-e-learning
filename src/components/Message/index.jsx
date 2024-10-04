import { useRef, useState } from "react";
import TimeDisplay from "../TimeDisplay";
import { UserAvartarOnly } from "../UserInfo";
import styles from "./Message.module.scss";
import classNames from "classnames/bind";
import Popup from "../Popup";
import { faFileArrowDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Message({ message, own }) {
  const cx = classNames.bind(styles);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const downloadRef = useRef();
  const handleDownload = () => {
    downloadRef.current.click();
  };
  return (
    <div className={cx("message-container", { own })}>
      <Popup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        title={
          <FontAwesomeIcon
            icon={faFileArrowDown}
            onClick={handleDownload}
          ></FontAwesomeIcon>
        }
      >
          <a href={message.content} download ref={downloadRef}></a>
        <img src={message.content} className={cx("popup-image", { own })}></img>
      </Popup>
      {/* Nếu own là false, UserAvartarOnly sẽ nằm bên trái, nếu own là true thì nằm bên phải */}
      {!own && (
        <UserAvartarOnly user={message.sender} className={cx("user-info")} />
      )}

      {/* Tin nhắn */}
      {own && <TimeDisplay className={cx("time")} time={message.createdAt} />}
      {message.type === "IMAGE" ? (
        <img
          onClick={() => setIsPopupOpen(true)}
          src={message.content}
          className={cx("message-image", { own })}
        ></img>
      ) : (
        <div className={cx("message-text", { own })}>{message.content}</div>
      )}
      {!own && <TimeDisplay className={cx("time")} time={message.createdAt} />}

      {/* Nếu own là true, UserAvartarOnly sẽ nằm bên phải */}
      {own && (
        <UserAvartarOnly
          user={message.sender}
          className={cx("user-info", { own })}
        />
      )}
    </div>
  );
}
