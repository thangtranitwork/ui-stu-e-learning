import React, { useEffect } from "react";
import UserAdminView from "../../components/UserAdminView";

export default function Home() {
  useEffect(() => {
    document.title = "STU E-Learning";
  }, []);
  return (
    <UserAdminView
      user={{ id: 1, lastname: "test", firstname: "test", scope: "USER" }}
    />
  );
}
