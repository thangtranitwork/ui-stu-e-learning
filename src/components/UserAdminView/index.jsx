import classNames from "classnames/bind";
import { DEFAULT_AVATAR_URL, BACKEND_BASE_URL } from "../../constant";
import styles from "./UserAdminView.module.scss";
import { toast } from "react-toastify";
import Button from "../Button";

export default function UserAdminView({ user }) {
  const cx = classNames.bind(styles);

  // Mảng cố định các vai trò có thể cấp hoặc thu hồi
  const availableRoles = ["CONTRIBUTOR", "ADMIN"];

  // Phân tích các vai trò hiện tại của người dùng (từ API)
  const userRoles = user?.roles ? user.roles.split(" ") : [];

  // Hàm xử lý khi checkbox thay đổi
  const handleRoleChange = async (e, role) => {
    const isChecked = e.target.checked;
    const url = `${BACKEND_BASE_URL}/api/admin/users/${
      isChecked ? "grant" : "revoke"
    }`;
    const userId = user?.id;

    try {
      // Gửi request đến API tương ứng (grant hoặc revoke)
      const response = await fetch(`${url}?id=${userId}&role=${role}`, {
        method: "PATCH", // Phương thức POST để grant/revoke
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // Token từ localStorage
        },
      });

      const data = await response.json();
      if (data.code === 200) {
        toast.success(
          `${isChecked ? "Thêm" : "Xóa"} quyền ${role} của người dùng ${userId}`
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error when granting/revoking role:", error);
    }
  };

  return (
    <div className={cx("user-info")}>
      <img
        className={cx("user-info-avatar")}
        src={user?.avatar || DEFAULT_AVATAR_URL}
        alt={`${user?.lastname} ${user?.firstname}`}
      />
      <span className={cx("user-info-name")}>
        {localStorage.getItem("userId") === String(user?.id)
          ? "Bạn"
          : `${user?.lastname} ${user?.firstname}`}
      </span>
      <em className={cx("user-info-id")}>{user.id}</em>
      {/* Hiển thị checkbox cho các vai trò trong mảng cố định */}
      <div className={cx("user-info-roles")}>
        {availableRoles.map((role, index) => (
          <label key={index} className={cx("user-info-role")}>
            <input
              type="checkbox"
              defaultChecked={userRoles.includes(role)} // Kiểm tra nếu người dùng đã có vai trò này
              onChange={(e) => handleRoleChange(e, role)} // Gọi hàm xử lý khi checkbox thay đổi
            />
            {role}
          </label>
        ))}
      </div>
      <Button primary>DELETE</Button>
    </div>
  );
}
