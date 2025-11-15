"use client";

import {
  FaTachometerAlt,
  FaChalkboardTeacher,
  FaExchangeAlt,
  FaSchool,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import { useRouter } from "next/router";
import { getCurrentUser } from "@/api/base/jwt";
import { useEffect, useState } from "react";

const Sidebar = () => {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setRole(currentUser?.role ?? null);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <nav className="bg-gray-900 h-screen fixed top-0 left-0 min-w-[250px] py-6 px-4">
      {/* Logo */}
      {(role === "admin" || role === "headteacher") && (
          <div className="relative">
            <a href="/">
              <img
                  src="https://readymadeui.com/readymadeui.svg"
                  alt="logo"
                  className="w-[150px]"
              />
            </a>
          </div>
      )}

      {(role === "teacher") && (
          <div className="relative">
            <a href="/home/teacher">
              <img
                  src="https://readymadeui.com/readymadeui.svg"
                  alt="logo"
                  className="w-[150px]"
              />
            </a>
          </div>
      )}

      {/* Menu */}
      <div className="overflow-auto py-6 h-full mt-4">
        <ul className="space-y-2">
          {/* Dashboard - Admin + Headteacher */}
          {(role === "admin" || role === "headteacher" || role === "debs" || role === "ministry admin") && (
            <li>
              <a
                href="/home"
                className="text-white font-medium hover:text-white hover:bg-indigo-500 text-[15px] flex items-center gap-3 rounded px-4 py-2 transition-all"
              >
                <FaTachometerAlt />
                <span>Dashboard</span>
              </a>
            </li>
          )}
          {(role === "headteacher" || role === "debs" || role === "ministry admin") && (
              <>
                <li>
                  <a
                      href="/transfer"
                      className="text-white font-medium hover:text-white hover:bg-indigo-500 text-[15px] flex items-center gap-3 rounded px-4 py-2 transition-all"
                  >
                    <FaExchangeAlt/>
                    <span>Transfers</span>
                  </a>
                </li>
              </>
          )}

          {/* Teachers + Schools - Admin + Headteacher */}
          {(role === "admin" || role === "headteacher" || role === "debs" || role === "ministry admin") && (
            <>
              <li>
                <a
                  href="/teachers"
                  className="text-white font-medium hover:text-white hover:bg-indigo-500 text-[15px] flex items-center gap-3 rounded px-4 py-2 transition-all"
                >
                  <FaChalkboardTeacher />
                  <span>Teachers</span>
                </a>
              </li>
              <li>
                <a
                  href="/schools"
                  className="text-white font-medium hover:text-white hover:bg-indigo-500 text-[15px] flex items-center gap-3 rounded px-4 py-2 transition-all"
                >
                  <FaSchool />
                  <span>Schools</span>
                </a>
              </li>
            </>
          )}

          {/* Teachers + Schools - Admin + Headteacher */}
          {(role === "teacher") && (
              <>
                <li>
                  <a
                      href="/transfer/my"
                      className="text-white font-medium hover:text-white hover:bg-indigo-500 text-[15px] flex items-center gap-3 rounded px-4 py-2 transition-all"
                  >
                    <FaExchangeAlt/>
                    <span>Transfers</span>
                  </a>
                </li>
              </>
          )}

          {/* Transfers - Everyone */}


          {/* Profile - Everyone */}
          <li>
            <a
                href="/profile"
                className="text-white font-medium hover:text-white hover:bg-indigo-500 text-[15px] flex items-center gap-3 rounded px-4 py-2 transition-all"
            >
              <FaUser />
              <span>Profile</span>
            </a>
          </li>

          {/* Logout */}
          <li>
            <button
              onClick={handleLogout}
              className="w-full text-left text-white font-medium hover:text-white hover:bg-indigo-500 text-[15px] flex items-center gap-3 rounded px-4 py-2 transition-all"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;
