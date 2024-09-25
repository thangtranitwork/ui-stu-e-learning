
import classNames from "classnames/bind";
import styles from "./Loader.module.scss";
import { LOADING_GIF_URL } from "../../constant";
const cx = classNames.bind(styles);

export default function Loader() {
  
  return (
    <div className={cx("loader")}>
        <img src={LOADING_GIF_URL} width="100%" className={cx("img")} alt="loader">
    </img>
    </div>
    
  );
}
