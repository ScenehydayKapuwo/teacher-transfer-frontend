"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { login, register } from "@/api/auth/auth"; // You'll define both in your backend
import { LogIn, UserPlus } from "lucide-react";

const LoginPage = () => {
    const router = useRouter();

    const [isLogin, setIsLogin] = useState(true);
    const [form, setForm] = useState({
        username: "",
        password: "",
        role: "",
        tsno: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const roles = [
        "admin",
        "teacher",
        "headteacher",
        "debs",
        "ministry admin",
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            let data;
            if (isLogin) {
                data = await login(form.username, form.password, form.role);
                if (data.token) localStorage.setItem("token", data.token);

                const userRole = data.user?.role;
                router.push(
                    userRole === "admin" || userRole === "headteacher" || userRole === "debs" || userRole === "ministry admin"
                        ? "/home"
                        : userRole === "teacher" ? "home/teacher"
                            : "/transfer"
                );
            } else {
                data = await register(form);
                // if (data.response !== 201) {
                //     setError(data.message || "Something went wrong. Please try again.");
                // }
                if (data.token) localStorage.setItem("token", data.token);
                const userRole = data.role;
                router.push(
                    userRole === "admin" || userRole === "headteacher" || userRole === "debs" || userRole === "ministry admin"
                        ? "/home"
                        : userRole === "teacher" ? "home/teacher"
                            : "/transfer"
                );


            }
        } catch (err: any) {
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Left Side Image */}
            <div className="hidden md:flex w-2/3">
                <img
                    src="/premium_photo-1661963502826-a0ccb55196fd.avif"
                    alt="Teacher Transfer"
                    className="object-cover w-full h-full"
                />
            </div>

            {/* Right Side Form */}
            <div className="w-full md:w-1/3 flex items-center justify-center p-6">
                <div className="bg-white rounded-3xl shadow-xl p-10 w-full max-w-md">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800">
                            Teacher Transfer System
                        </h2>
                        <p className="mt-2 text-gray-600">
                            {isLogin
                                ? "Sign in to your account"
                                : "Create your account to get started"}
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {!isLogin && (
                            <>
                                {/* TSNo */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        TS Number
                                    </label>
                                    <input
                                        name="tsno"
                                        type="text"
                                        required
                                        value={form.tsno}
                                        onChange={handleChange}
                                        placeholder="Enter your TSNo"
                                        className="mt-2 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2 text-gray-800 focus:ring-indigo-500 outline-none transition"
                                    />
                                </div>
                            </>
                        )}

                        {/* Username */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Username
                            </label>
                            <input
                                name="username"
                                type="text"
                                required
                                value={form.username}
                                onChange={handleChange}
                                placeholder="Enter your username"
                                className="mt-2 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2 text-gray-800 focus:ring-indigo-500 outline-none transition"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                name="password"
                                type="password"
                                required
                                value={form.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="mt-2 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2 text-gray-800 focus:ring-indigo-500 outline-none transition"
                            />
                        </div>

                        {/* Role Selector */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Role
                            </label>
                            <select
                                name="role"
                                required
                                value={form.role}
                                onChange={handleChange}
                                className="mt-2 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2 text-gray-800 focus:ring-indigo-500 outline-none transition"
                            >
                                <option value="">Select role</option>
                                {roles.map((r) => (
                                    <option key={r} value={r}>
                                        {r.charAt(0).toUpperCase() + r.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Error message */}
                        {error && (
                            <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 text-center">
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-white font-semibold hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:opacity-50 transition"
                        >
                            {loading ? (
                                <>
                                    <svg
                                        className="h-5 w-5 animate-spin text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v4l3-3-3-3v4a12 12 0 00-12 12h4z"
                                        ></path>
                                    </svg>
                                    {isLogin ? "Signing in..." : "Registering..."}
                                </>
                            ) : (
                                <>
                                    {isLogin ? (
                                        <>
                                            <LogIn className="w-5 h-5" /> Sign In
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus className="w-5 h-5" /> Register
                                        </>
                                    )}
                                </>
                            )}
                        </button>
                    </form>

                    {/* Toggle */}
                    <p className="mt-6 text-center text-sm text-gray-500">
                        {isLogin ? (
                            <>
                                Don’t have an account?{" "}
                                <button
                                    type="button"
                                    className="text-indigo-600 font-semibold hover:underline"
                                    onClick={() => setIsLogin(false)}
                                >
                                    Register
                                </button>
                            </>
                        ) : (
                            <>
                                Already have an account?{" "}
                                <button
                                    type="button"
                                    className="text-indigo-600 font-semibold hover:underline"
                                    onClick={() => setIsLogin(true)}
                                >
                                    Login
                                </button>
                            </>
                        )}
                    </p>

                    <p className="mt-6 text-center text-sm text-gray-400">
                        &copy; 2025 Teacher Transfer System. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
