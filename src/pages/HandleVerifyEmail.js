import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BACKEND_BASE_URL } from "../constant";
import { setToken } from "../App";
import { toast } from "react-toastify";
export default function HandleVerifyEmail() {
  const { code } = useParams();
  const navigate = useNavigate(); // Sử dụng để chuyển hướng người dùng

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch(
          `${BACKEND_BASE_URL}/api/auth/register/verify?code=${code}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();
        console.log(data);

        if (data.code === 200) {
          setToken(data.body.accessToken);
          navigate("/profile/edit");
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.error("Error verifying email:", error);
        alert("Đã xảy ra lỗi trong quá trình xác thực. Vui lòng thử lại!");
      }
    };

    verifyEmail();
  }, [code, navigate]);

  return <></>; // Component không cần render gì
}
