import { cloneElement } from "react";
import classNames from "classnames/bind";
import styles from "./Table.module.scss";
export default function Table({ items, labels, buttons, onButtonsClick }) {
    const cx = classNames.bind(styles);
  return (
    <table border={1} className={cx("table")}>
      {/* Phần tiêu đề bảng */}
      <thead>
        <tr>
          {labels.map((label, index) => (
            <th key={index}>{label}</th>
          ))}
          {/* Cột cho các nút hành động */}
          <th>Hành động</th>
        </tr>
      </thead>

      {/* Phần nội dung bảng */}
      <tbody>
        {items.map((item, index) => (
          <tr key={index}>
            {/* Hiển thị các cột dữ liệu tương ứng với từng hàng */}
            {Object.values(item).map((value, i) => (
              <td key={i}>{value}</td>
            ))}

            {/* Hiển thị các nút hành động bên phải */}
            <td>
              {buttons.map((ButtonComponent, btnIndex) => (
                <span key={btnIndex}>
                  {cloneElement(ButtonComponent, {
                    onClick: () => onButtonsClick[btnIndex](item.id), // Gắn id vào sự kiện onClick
                  })}
                </span>
              ))}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
