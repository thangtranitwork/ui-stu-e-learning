import classNames from "classnames/bind";
import styles from "./Footer.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faGithub } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

const Footer = () => {
  const cx = classNames.bind(styles);
  return (
    <footer className={cx("footer")}>
      <div className={cx("column")}>
        <h3>STU E-Learning</h3>
        <p> Dự án đầu tiên của Trần Đoàn Xuân Thắng</p>
        <p>Bắt đầu vào tháng 6 năm 2024</p>
        <p>Hoàn thành vào tháng 10 năm 2024</p>
        <p>Dự án sử dụng ReactJS, Spring Boot, MySQL</p>
        <h4 className={cx("contact")}>
          Liên hệ{" "}
          <a href="https://www.facebook.com/thangtran0111">
            <FontAwesomeIcon icon={faFacebook} />
          </a>
          <a href="mailto:thangtran.it.work@gmail.com">
            <FontAwesomeIcon icon={faEnvelope} />
          </a>
          <a href="https://github.com/thangtranitwork">
            <FontAwesomeIcon icon={faGithub} />
          </a>
        </h4>
      </div>
      <div className={cx("column")}>
        <h2>Chăm sóc khác hàng</h2>
        <a href="#">Hướng dẫn thanh toán</a>
        <br />
        <a href="#">Điều kiện giao dịch chung</a>
        <br />
        <a href="#">Quy trình sử dụng dịch vụ</a>
        <br />
        <a href="#">Chính sách bảo hành</a>
        <br />
        <a href="#">Chính sách bảo mật</a>
        <br />
      </div>
      <div className={cx("column")}>
        <h2>Tính năng</h2>
        <a href="#">Học tập</a>
        <br />
        <a href="#">Luyện tập</a>
        <br />
        <a href="#">Đánh giá</a>
        <br />
        <a href="#">Thảo luận</a>
        <br />
        <a href="#">Chia sẻ</a>
        <br />
        <a href="#">Kết bạn</a>
        <br />
        <a href="#">Trò chuyện</a>
        <br />
      </div>
      <div className={cx("column")}>
        <h2>Thông tin</h2>
        <a href="#">Về chúng tôi</a>
        <br />
        <a href="#">Điều khoản sử dụng</a>
        <br />
      </div>
      <div className={cx("column")}>
        <h2>Trợ giúp</h2>
        <a href="#">Trợ giúp</a>
        <br />
        <a href="#">Liên hệ</a>
        <br />
      </div>
    </footer>
  );
};

export default Footer;
