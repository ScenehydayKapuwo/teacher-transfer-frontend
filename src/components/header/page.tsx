"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { API_BASE_URL, IMAGE_BASE_URL } from "@/api/base/base";
import {getCurrentUser} from "@/api/base/jwt";

const HeaderPage = () => {
  const defaultImage = "/blank-male.jpg";

  const [profileImage, setProfileImage] = useState<string>(defaultImage);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setRole(currentUser?.role ?? null);
  }, []);
  useEffect(() => {
  const fetchProfilePicture = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE_URL}/teachers/me/profile-picture`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch profile picture");

      const data = await res.json();
      if (data.profilePicture) {
  
        const updatedUrl = data.profilePicture.includes("localhost")
          ? data.profilePicture.replace("http://localhost:4000", IMAGE_BASE_URL)
          : data.profilePicture;

        setProfileImage(updatedUrl);
      }
    } catch (err) {
      console.error(err);
    }
  };

  fetchProfilePicture();
}, []);


  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        // setOpen(false); // dropdown is currently not used
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex shadow-lg py-4 px-4 sm:px-10 bg-gray-900 min-h-[70px] tracking-wide relative z-50">
      <div className="flex items-center justify-between w-full">
        {/* Left Side: Logo + Title */}
        {(role === "teacher") && (
            <Link href="/home/teacher" className="flex items-center space-x-2">
              <img
                  className="h-12 w-auto object-contain rounded-md shadow-sm"
                  src="/logo.png"
                  alt="Company Logo"
              />
              <span className="ml-2 text-xl font-semibold text-white">Dashboard</span>
            </Link>
        )}

        {(role === "admin" || role === "headteacher" || role === "debs" || role === "ministry admin"  ) && (
            <Link href="/home" className="flex items-center space-x-2">
              <img
                  className="h-12 w-auto object-contain rounded-md shadow-sm"
                  src="/logo.png"
                  alt="Company Logo"
              />
              <span className="ml-2 text-xl font-semibold text-white">Dashboard</span>
            </Link>
        )}



        {/* Right Side */}
        <div className="flex items-center space-x-4 relative" ref={dropdownRef}>
          {/* Profile */}
          <Link href="/profile">
            <img
              src={profileImage}
              alt="Profile"
              className="w-10 h-10 rounded-full border-2 border-gray-600 shadow-sm cursor-pointer"
            />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default HeaderPage;
