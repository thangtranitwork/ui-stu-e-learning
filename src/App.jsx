import React, { Fragment, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { publicRoutes } from "./routes";
import { DefaultLayout } from "./components/Layout";
import { toast, ToastContainer } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { BACKEND_BASE_URL } from "./constant";
import "react-quill/dist/quill.snow.css";

export function setToken(token) {
  try {
    const decodedToken = jwtDecode(token);
    const { exp, sub, scope } = decodedToken;

    // Lưu accessToken và thời gian hết hạn vào localStorage
    localStorage.setItem("accessToken", token);
    localStorage.setItem("tokenExpiry", exp);
    localStorage.setItem("userId", sub);
    localStorage.setItem("scope", scope);
  } catch (error) {
    console.error("Invalid token", error);
  }
}

export function getToken(){
  return localStorage.getItem("accessToken");
}

export default function App() {
  useEffect(() => {
    setTimeout(() => {
      const checkTokenExpiry = async () => {
        const token = getToken();
        const tokenExpiry = localStorage.getItem("tokenExpiry");
        const currentTime = Math.floor(Date.now() / 1000);
        const timeLeft = !token ? 0 : tokenExpiry - currentTime;
        if (timeLeft < 60) {
          try {
            const response = await fetch(
              `${BACKEND_BASE_URL}/api/auth/refresh`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                credentials: "include", 
              }
            );

            const data = await response.json();
            if (data.code === 200) {
              setToken(data.body.accessToken); // Lưu accessToken mới
            } else {
              if (token) {
                toast.error("Bạn cần đăng nhập lại");
              }
            }
          } catch (error) {
            if (token) {
              toast.error("Bạn cần đăng nhập lại");
            }
          }
        }
      };

      // Kiểm tra token khi app khởi chạy
      checkTokenExpiry();

      // Setup một interval để kiểm tra token thường xuyên
      const interval = setInterval(checkTokenExpiry, 60000); // Kiểm tra mỗi phút
      return () => clearInterval(interval);
    }, 100);
  }, []);

  return (
    <>
      <ToastContainer position="top-left" autoClose={3000} newestOnTop />
      <BrowserRouter>
        <Routes>
          {publicRoutes.map((route, index) => {
            const Page = route.component;
            const Layout = route.layout || Fragment;
            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <Layout>
                    <Page />
                  </Layout>
                }
              />
            );
          })}
        </Routes>
      </BrowserRouter>
    </>
  );
}
