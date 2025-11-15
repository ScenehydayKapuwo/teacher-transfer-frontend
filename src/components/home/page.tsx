"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import HomeCards from "./cards";
import HomeGraph from "./graph";
import { getCurrentUser } from "../../api/base/jwt";

const HomePage = () => {
  const [loggedInUserRole, setLoggedInUserRole] = useState<string | null>(null);

  useEffect(() => {
    const user = getCurrentUser();
    setLoggedInUserRole(user?.role ?? null);
  }, []);

  if (loggedInUserRole === null) {
    return null;
  }

  if (loggedInUserRole !== "admin" && loggedInUserRole !== "headteacher" && loggedInUserRole !== "debs" && loggedInUserRole !== "ministry admin") {
    Swal.fire({
      title: "Access Denied",
      text: "Only Admins and Headteachers can view this page.",
      icon: "error",
      confirmButtonColor: "#3085d6",
    });
    return null;
  }

  return (
    <div className="space-y-8 p-6">
      <HomeCards />
      <div className="w-full h-[500px]">
        <HomeGraph />
      </div>
    </div>
  );
};

export default HomePage;
