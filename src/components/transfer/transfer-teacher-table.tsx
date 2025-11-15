import { useState, useEffect } from "react";
import {getTeacherTransfers, getTransfers, submitTransfer, TransferResponse} from "../../api/transfer/transfers";
import Link from "next/link";
import Swal from "sweetalert2";
import { getSchools } from "@/api/school/schools";
import { requireToken } from "@/api/base/token";
import router from "next/router";
import { getCurrentUser } from "@/api/base/jwt";
import { Search } from "lucide-react"; // ✅ icon import

interface ActionData {
    status: string;
    reason: string;
}

interface School {
    id?: number;
    name: string;
    district: string;
    province: string;
    code?: string;
}

const TransferTable = () => {
    const [teachers, setTeachers] = useState<TransferResponse[]>([]);
    const [schools, setSchools] = useState<School[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState<TransferResponse | null>(null);
    const [actionData, setActionData] = useState<ActionData>({ status: "Approved", reason: "" });
    const [searchQuery, setSearchQuery] = useState("");
    const [submittingRequest, setSubmittingRequest] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const currentUser = getCurrentUser();
    const teacherId = currentUser?.teacherProfileId ?? 0;
    const tsno = currentUser?.tsno ?? "" ;
    const loggedInUserRole = currentUser?.role

    const [transferRequest, setTransferRequest] = useState({
        teacherId: teacherId,
        toSchoolId: 0,
        tsno: tsno,
        reason: "",
    });

    useEffect(() => {
        const token = requireToken(router);
        if (!token) return;

        const fetchTransfers = async () => {
            try {
                const data = await getTeacherTransfers(token, tsno);
                setTeachers(data);
            } catch (err: any) {
                setError(err.message || "Failed to load transfers");
            } finally {
                setLoading(false);
            }
        };
        fetchTransfers();
    }, []);

    useEffect(() => {
        const fetchSchools = async () => {
            const token = requireToken(router);
            if (!token) return;
            try {
                const data = await getSchools(token);
                setSchools(data);
            } catch (err: any) {
                console.error("Failed to fetch schools:", err.message);
                Swal.fire("Error", err.message || "Failed to fetch schools", "error");
            }
        };
        fetchSchools();
    }, []);

    const handleRequestTransfer = async () => {
        const token = requireToken(router);
        if (!token) return;
        if (!transferRequest.toSchoolId) {
            Swal.fire("Error", "Please select a new school", "error");
            return;
        }

        setSubmittingRequest(true);
        Swal.fire({ title: "Submitting...", didOpen: () => Swal.showLoading() });

        try {
            await submitTransfer(transferRequest.teacherId, transferRequest.toSchoolId,transferRequest.tsno, token);
            const data = await getTeacherTransfers(token,transferRequest.tsno);
            setTeachers(data);
            setShowRequestModal(false);
            setTransferRequest({ teacherId, toSchoolId: 0, tsno: tsno,reason: "" });
            Swal.fire("Success", "Transfer request submitted successfully!", "success");
        } catch (err: any) {
            Swal.fire("Error", err.message || "Failed to submit transfer request", "error");
        } finally {
            setSubmittingRequest(false);
        }
    };

    // Filter and paginate
    const filteredTeachers = teachers.filter((t) =>
        [t.teacher.firstName, t.teacher.lastName, t.teacher.nrc, t.teacher.currentSchoolName]
            .join(" ")
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);
    const paginatedTeachers = filteredTeachers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    if (loading) return <p className="text-center py-4">Loading transfers...</p>;
    if (error) return <p className="text-center py-4 text-red-500">{error}</p>;

    return (
        <div className="bg-gray-50 dark:bg-gray-900 relative overflow-x-auto shadow-lg rounded-lg p-6">
            {/* Top Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
    <div className="relative w-full sm:w-1/3">
    <Search className="absolute left-3 top-3 text-gray-400" size={18} />
    <input
    type="text"
    placeholder="Search teacher..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
        />
        </div>
    {loggedInUserRole === "teacher" && (
        <button
            onClick={() => setShowRequestModal(true)}
        className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-md transition-all"
            >
            + Request Transfer
    </button>
    )}
    </div>

    {/* Table */}
    <div className="overflow-hidden rounded-lg">
    <table className="w-full text-sm text-left text-gray-600 dark:text-gray-300">
    <thead className="text-xs uppercase bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
        <tr>
            {["No", "Name", "NRC", "Current School", "New School", "Status", "Date", "Action"].map((h) => (
        <th key={h} className="px-6 py-3 font-semibold">
        {h}
        </th>
))}
    </tr>
    </thead>
    <tbody>
    {paginatedTeachers.length > 0 ? (
                paginatedTeachers.map((t, i) => (
                    <tr
                        key={t.id}
            className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-800 border-b dark:border-gray-700"
            >
            <td className="px-6 py-3 font-medium">{i + 1}</td>
                <td className="px-6 py-3 font-medium">{t.teacher.firstName} {t.teacher.lastName}</td>
    <td className="px-6 py-3">{t.teacher.nrc}</td>
        <td className="px-6 py-3">{t.teacher.currentSchool?.name || "-"}</td>
        <td className="px-6 py-3">{t.toSchool?.name || "-"}</td>
        <td className="px-6 py-3">
    <span
        className={`px-2 py-1 rounded-md text-xs font-semibold ${t.status === "approved"
        ? "bg-green-100 text-green-700"
        : t.status === "rejected"
            ? "bg-red-100 text-red-700"
            : t.status === "headteacher_approved"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-700"
    }`}
>
    {t.status.replace(/_/g, " ").toUpperCase()}
    </span>
    </td>
    <td className="px-6 py-3">{new Date(t.createdAt).toLocaleDateString()}</td>
        <td className="px-6 py-3">
    <Link
        href={`/transfer-view/${t.id}`}
    className="text-indigo-600 hover:text-indigo-800 font-semibold"
        >
        View
        </Link>
        </td>
        </tr>
))
) : (
        <tr>
            <td colSpan={8} className="text-center py-6 text-gray-500">
        No teachers found
    </td>
    </tr>
)}
    </tbody>
    </table>
    </div>

    {/* Pagination */}
    <div className="flex justify-between items-center mt-6">
    <span className="text-sm text-gray-600 dark:text-gray-400">
        Page {currentPage} of {totalPages}
    </span>
    <div className="flex gap-2">
    <button
        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-40"
    disabled={currentPage === 1}
    onClick={() => setCurrentPage((p) => p - 1)}
>
    Prev
    </button>
    <button
    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-40"
    disabled={currentPage === totalPages}
    onClick={() => setCurrentPage((p) => p + 1)}
>
    Next
    </button>
    </div>
    </div>

    {/* Request Modal */}
    {showRequestModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 backdrop-blur-sm">
        <div className="bg-gray-900 text-white rounded-lg shadow-xl p-6 w-full max-w-lg">
        <h2 className="text-lg font-bold mb-4">Request Transfer</h2>
    <div className="grid gap-4">
    <select
        value={transferRequest.toSchoolId}
        onChange={(e) =>
        setTransferRequest({ ...transferRequest, toSchoolId: Number(e.target.value) })
    }
        className="px-3 py-2 border border-gray-700 rounded bg-gray-800 focus:ring-2 focus:ring-indigo-500"
        >
        <option value={0}>Select School</option>
        {schools.map((s) => (
            <option key={s.id} value={s.id}>
            {s.name} ({s.code})
            </option>
        ))}
        </select>

        <textarea
        placeholder="Reason for Transfer"
        value={transferRequest.reason}
        onChange={(e) =>
        setTransferRequest({ ...transferRequest, reason: e.target.value })
    }
        className="px-3 py-2 border border-gray-700 rounded bg-gray-800 focus:ring-2 focus:ring-indigo-500"
            />
            </div>

            <div className="flex justify-end gap-3 mt-5">
    <button
        onClick={() => setShowRequestModal(false)}
        disabled={submittingRequest}
        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
            >
            Cancel
            </button>
            <button
        onClick={handleRequestTransfer}
        disabled={submittingRequest}
        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded"
            >
            {submittingRequest ? "Submitting..." : "Submit"}
            </button>
            </div>
            </div>
            </div>
    )}
    </div>
);
};

export default TransferTable;
