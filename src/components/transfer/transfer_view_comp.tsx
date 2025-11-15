"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import { HiAcademicCap, HiLocationMarker, HiOutlineOfficeBuilding } from "react-icons/hi";
import { fetchTransferById, updateTransferStatus, TransferResponse } from "@/api/transfer/transfers";
import { IMAGE_BASE_URL } from "@/api/base/base";
import { requireToken } from "@/api/base/token";
import { getCurrentUser } from "@/api/base/jwt";
import Link from "next/link";

type TransferStatus = "pending" | "headteacher_approved" | "headteacher_rejected" | "debs_approved" | "debs_rejected" | "approved" | "rejected";

const TransferViewLayout: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const [transfer, setTransfer] = useState<TransferResponse | null>(null);
  const [status, setStatus] = useState<TransferStatus | "">("pending");
  const [reason, setReason] = useState("");
  const [role, setRole] = useState<string | null>(null);

  // Get current user role
  useEffect(() => {
    const currentUser = getCurrentUser();
    setRole(currentUser?.role ?? null);
  }, []);

  // Load transfer data
  useEffect(() => {
    const token = requireToken(router);
    if (!token || !id) return;

    const loadTransfer = async () => {
      try {
        const data = await fetchTransferById(id as string, token);
        // Parse experience if it's a string

        setTransfer(data);
        setStatus(data.status as TransferStatus);
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to load transfer data", "error");
      }
    };

    loadTransfer();
  }, [id]);

  // Determine allowed statuses based on role and current transfer status
  const availableStatuses: TransferStatus[] =
    role === "headteacher" && transfer?.status === "pending"
      ? ["headteacher_approved", "headteacher_rejected"]
      : role === "debs" && transfer?.status === "headteacher_approved"
      ? ["debs_approved", "debs_rejected"]
      : role === "ministry admin" && transfer?.status === "debs_approved"
      ? ["approved", "rejected"]
      : [];

  // Reset status if it's not allowed
  useEffect(() => {
    if (status && !availableStatuses.includes(status as TransferStatus)) {
      setStatus("");
    }
  }, [availableStatuses]);

  // Handle status update
  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transfer || !status) return;
    const token = requireToken(router);
    if (!token) return;

    try {
      await updateTransferStatus(transfer.id, status, reason, token);
      Swal.fire("Success", "Transfer status updated", "success");
      setTransfer({ ...transfer, status });
      setReason("");
    } catch (err: any) {
      Swal.fire("Error", err.message || "Failed to update status", "error");
    }
  };

  if (!transfer) return <div className="p-6 text-center">Loading...</div>;

  const { teacher, fromSchool, toSchool } = transfer;
  const canUpdateStatus = availableStatuses.length > 0;

  // Centralize profile image logic
  const profileImageUrl = teacher.profilePicture
    ? `${IMAGE_BASE_URL}/${teacher.profilePicture}`
    : "/blank-male.jpg";

  return (
    <section className="py-8 bg-white dark:bg-gray-900 min-h-screen w-full">
      <div className="max-w-full mx-auto px-4 space-y-6">
        {/* Profile + Schools */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full">
          {/* Profile */}
          <Link href={`/teachers/${teacher.id}`} className="md:col-span-1">
            <div className="p-6 bg-gray-50 dark:bg-gray-800 h-64 flex flex-col items-center justify-between rounded-lg shadow-sm hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex justify-center mb-2">
                <img
                  className="w-24 h-24 rounded-full object-cover"
                  src={profileImageUrl}
                  alt="Profile"
                />
              </div>
              <h5 className="mb-2 text-lg font-bold text-gray-900 dark:text-white text-center">
                {teacher.firstName} {teacher.lastName}
              </h5>
              <span
                className={`inline-block px-3 py-1 text-sm font-semibold rounded-full select-none 
                  ${
                    transfer.status === "pending"
                      ? "bg-blue-200 text-blue-800 dark:bg-blue-700 dark:text-blue-200"
                      : transfer.status === "headteacher_approved"
                      ? "bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-200"
                      : transfer.status === "headteacher_rejected"
                      ? "bg-red-200 text-red-800 dark:bg-red-700 dark:text-red-200"
                      : transfer.status === "approved"
                      ? "bg-green-300 text-green-900 dark:bg-green-700 dark:text-green-200"
                      : transfer.status === "rejected"
                      ? "bg-red-300 text-red-900 dark:bg-red-700 dark:text-red-200"
                      : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                  }
                  cursor-not-allowed
                `}
              >
                {transfer.status.replace(/_/g, " ").toUpperCase()}
              </span>
            </div>
          </Link>

          {/* Schools */}
          <div className="md:col-span-3 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm h-auto">
            <div className="flex flex-wrap gap-6">
              {/* From School */}
              <div className="flex-1 min-w-[300px] p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <h5 className="flex items-center text-xl font-bold text-gray-900 dark:text-white mb-4">
                  <HiAcademicCap className="mr-2 text-blue-500" /> From School
                </h5>
                {fromSchool || teacher.currentSchool ? (
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    <li className="py-3 flex justify-between items-center">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                          <HiOutlineOfficeBuilding className="mr-1 text-gray-400" />
                          {fromSchool?.name || teacher.currentSchool?.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                          <HiLocationMarker className="mr-1 text-gray-400" />
                          {fromSchool?.province || teacher.currentSchool?.province}
                        </p>
                      </div>
                      <span className="text-base font-semibold text-gray-900 dark:text-white flex items-center">
                        <HiLocationMarker className="mr-1 text-gray-400" />
                        {fromSchool?.district || teacher.currentSchool?.district}
                      </span>
                    </li>
                  </ul>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 flex items-center">
                    <HiOutlineOfficeBuilding className="mr-2" /> No From School
                  </p>
                )}
              </div>

              {/* To School */}
              <div className="flex-1 min-w-[300px] p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <h5 className="flex items-center text-xl font-bold text-gray-900 dark:text-white mb-4">
                  <HiAcademicCap className="mr-2 text-green-500" /> To School
                </h5>
                {toSchool ? (
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    <li className="py-3 flex justify-between items-center">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                          <HiOutlineOfficeBuilding className="mr-1 text-gray-400" />
                          {toSchool.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                          <HiLocationMarker className="mr-1 text-gray-400" />
                          {toSchool.province}
                        </p>
                      </div>
                      <span className="text-base font-semibold text-gray-900 dark:text-white flex items-center">
                        <HiLocationMarker className="mr-1 text-gray-400" />
                        {toSchool.district}
                      </span>
                    </li>
                  </ul>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 flex items-center">
                    <HiOutlineOfficeBuilding className="mr-2" /> No To School
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Status Form */}
        {canUpdateStatus && (
          <div className="w-full p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="w-full p-6 rounded-xl shadow-md flex flex-col">
              <h5 className="mb-6 text-xl font-semibold text-gray-700 dark:text-gray-300">
                Update Status
              </h5>
              <form onSubmit={handleStatusUpdate} className="flex flex-col gap-5 w-full">
                <div className="w-full">
                  <label className="block mb-1 text-gray-500 dark:text-gray-400 text-sm font-medium">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as TransferStatus)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="" disabled>Select</option>
                    {availableStatuses.map((s) => (
                      <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
                    ))}
                  </select>
                </div>

                <div className="w-full">
                  <label className="block mb-1 text-gray-500 dark:text-gray-400 text-sm font-medium">
                    Reason
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={4}
                    placeholder="Enter reason..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-2 text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 dark:bg-blue-500 dark:hover:bg-blue-600 font-medium rounded-lg text-sm px-4 py-2 w-full transition-all duration-200"
                >
                  Update Status
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default TransferViewLayout;
