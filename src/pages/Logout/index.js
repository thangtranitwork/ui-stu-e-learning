import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_BASE_URL } from "../../constant";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      fetch(`${BACKEND_BASE_URL}/api/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        credentials: "include", // Đảm bảo gửi cookie cùng với request
      })
        .then(() => {
          localStorage.clear();
          navigate("/");
        })
        .catch((err) => {
          console.log(err.message);
        });
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return null;
}
