import { UserAvartarOnly } from "../UserInfo";
import styles from "./Message.module.scss";
import classNames from "classnames/bind";

export default function Message({ message, sender, own, type = "TEXT"}) {
  const cx = classNames.bind(styles);
  
  return (
    <div className={cx("message-container", { own })}>
      {/* Nếu own là false, UserAvartarOnly sẽ nằm bên trái, nếu own là true thì nằm bên phải */}
      {!own && <UserAvartarOnly user={sender} className={cx("user-info")} />}

      {/* Tin nhắn */}
      {type === "IMAGE" ? (
        <img src={message} className={cx("message-image", { own })}></img>
      ) : (
        <div className={cx("message-text", { own })}>{message}</div>
      )}
      {/* Nếu own là true, UserAvartarOnly sẽ nằm bên phải */}
      {own && (
        <UserAvartarOnly user={sender} className={cx("user-info", { own })} />
      )}
    </div>
  );
}
