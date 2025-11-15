"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { addTeacher, getTeachers, Teacher } from "../../api/teachers/teachers";
import { getSchools } from "../../api/school/schools";
import router from "next/router";
import { getCurrentUser } from "@/api/base/jwt";
import { Search } from "lucide-react";

const formatNRCInput = (value: string) => {
  const digits = value.replace(/\D/g, "");
  let part1 = digits.slice(0, 6);
  let part2 = digits.slice(6, 8);
  let part3 = digits.slice(8, 9);
  let formatted = part1;
  if (part2) formatted += "/" + part2;
  if (part3) formatted += "/" + part3;
  return formatted;
};

const TeachersTable = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [schools, setSchools] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  const [newTeacher, setNewTeacher] = useState<any>({
    role: "teacher",
    teacherData: {
      firstName: "",
      lastName: "",
      email: "",
      nrc: "",
      tsNo: "",
      address: "",
      maritalStatus: "",
      currentSchoolType: "",
      currentSchoolId: "",
      currentPosition: "",
      subjectSpecialization: "",
    },
    medicalCertificate: null,
    academicQualifications: null,
    professionalQualifications: null,
  });

  const itemsPerPage = 10;

  useEffect(() => {
    const currentUser = getCurrentUser();
    setRole(currentUser?.role ?? null);

    const token = localStorage.getItem("token");
    if (!token) router.push("/");

    const fetchData = async () => {
      try {
        const [teachersData, schoolsData] = await Promise.all([
          getTeachers(token!),
          getSchools(token!),
        ]);
        setTeachers(teachersData);
        setSchools(schoolsData);
      } catch (err: any) {
        Swal.fire("Error", "Failed to fetch data.", "error");
      }
    };
    fetchData();
  }, []);

  const handleFileChange = (field: string, file: File | null) => {
    setNewTeacher({ ...newTeacher, [field]: file });
  };

  const handleAddTeacher = async () => {
    setLoading(true);
    try {
      const formData = new FormData();

      const roleMap: Record<string, string> = {
        Teacher: "teacher",
        "Head Teacher": "headteacher",
      };

      const mappedRole = roleMap[newTeacher.teacherData.currentPosition] || "teacher";
      formData.append("role", mappedRole);

      // Add files
      ["medicalCertificate", "academicQualifications", "professionalQualifications"].forEach(
        (key) => {
          if (newTeacher[key]) formData.append(key, newTeacher[key]);
        }
      );

      // Add teacher data
      Object.entries(newTeacher.teacherData).forEach(([k, v]) => {
        if (v) formData.append(`teacherData[${k}]`, String(v));
      });

      const token = localStorage.getItem("token");
      await addTeacher(formData, token);
      Swal.fire("Success", "Teacher added successfully!", "success");
      setIsModalOpen(false);
    } catch (err: any) {
      Swal.fire("Error", err.message || "Failed to add teacher", "error");
    } finally {
      setLoading(false);
    }
  };

  // Filter teachers
  const filteredTeachers = teachers.filter((teacher: any) =>
    [
      `${teacher.firstName} ${teacher.lastName}`,
      teacher.nrc,
      teacher.tsNo,
      teacher.currentSchool?.name,
      teacher.currentPosition,
      teacher.subjectSpecialization,
    ]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);
  const currentTeachers = filteredTeachers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
        {(role === "admin") && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-md transition-all"
          >
            + Add Teacher
          </button>
        )}
        <div className="relative w-full sm:w-1/3">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search teachers..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg">
        <table className="w-full text-sm text-left text-gray-600 dark:text-gray-300">
          <thead className="text-xs uppercase bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
            <tr>
              {[
                "No",
                "Name",
                "NRC No.",
                "TS No.",
                "Current School",
                "Position",
                "Subject",
                "Action",
              ].map((header) => (
                <th key={header} className="px-6 py-3 font-semibold">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentTeachers.length > 0 ? (
              currentTeachers.map((teacher: any, index: number) => (
                <tr
                  key={teacher.id}
                  className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="px-6 py-3 font-medium">{index + 1}</td>
                  <td className="px-6 py-3 font-medium">
                    {teacher.firstName} {teacher.lastName}
                  </td>
                  <td className="px-6 py-3">{teacher.nrc}</td>
                  <td className="px-6 py-3">{teacher.tsNo}</td>
                  <td className="px-6 py-3">{teacher.currentSchool?.name || "-"}</td>
                  <td className="px-6 py-3">{teacher.currentPosition}</td>
                  <td className="px-6 py-3">{teacher.subjectSpecialization}</td>
                  <td className="px-6 py-3">
                    <Link
                      href={`/teachers/${teacher.id}`}
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 backdrop-blur-sm">
          <div className="bg-gray-900 text-white rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-6">Add New Teacher</h2>

            {/* Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {["firstName", "lastName", "email", "nrc", "tsNo", "address"].map((f) => (
                <div key={f}>
                  <label className="block mb-1 text-gray-300">
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </label>
                  <input
                    type="text"
                    value={newTeacher.teacherData[f]}
                    onChange={(e) => {
                      const val = f === "nrc" ? formatNRCInput(e.target.value) : e.target.value;
                      setNewTeacher({
                        ...newTeacher,
                        teacherData: { ...newTeacher.teacherData, [f]: val },
                      });
                    }}
                    maxLength={f === "nrc" ? 11 : undefined}
                    className="w-full px-3 py-2 border border-gray-700 rounded bg-gray-800 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              ))}

              {/* Dropdowns */}
              {[
                { field: "maritalStatus", options: ["Single", "Married", "Divorced", "Widowed"] },
                { field: "currentPosition", options: ["Teacher", "Head Teacher"] },
                { field: "currentSchoolType", options: ["Community", "Primary", "Secondary"] },
              ].map(({ field, options }) => (
                <div key={field}>
                  <label className="block mb-1 text-gray-300">
                    {field.replace(/([A-Z])/g, " $1")}
                  </label>
                  <select
                    value={newTeacher.teacherData[field] || ""}
                    onChange={(e) =>
                      setNewTeacher({
                        ...newTeacher,
                        teacherData: { ...newTeacher.teacherData, [field]: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-700 rounded bg-gray-800 focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select {field}</option>
                    {options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              ))}

              {/* Current School */}
              <div>
                <label className="block mb-1 text-gray-300">Current School</label>
                <select
                  value={newTeacher.teacherData.currentSchoolId || ""}
                  onChange={(e) =>
                    setNewTeacher({
                      ...newTeacher,
                      teacherData: {
                        ...newTeacher.teacherData,
                        currentSchoolId: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-700 rounded bg-gray-800 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select School</option>
                  {schools.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subject */}
              <div>
                <label className="block mb-1 text-gray-300">Subject Specialization</label>
                <select
                  value={newTeacher.teacherData.subjectSpecialization || ""}
                  onChange={(e) =>
                    setNewTeacher({
                      ...newTeacher,
                      teacherData: {
                        ...newTeacher.teacherData,
                        subjectSpecialization: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-700 rounded bg-gray-800 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select Subject</option>
                  {[
                    "Mathematics",
                    "English",
                    "Science",
                    "History",
                    "Geography",
                    "Physical Education",
                    "Biology",
                    "Chemistry",
                    "Physics",
                    "Computer Studies",
                  ].map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Files */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { field: "medicalCertificate", label: "Medical Certificate" },
                { field: "academicQualifications", label: "Academic Qualifications" },
                { field: "professionalQualifications", label: "Professional Qualifications" },
              ].map(({ field, label }) => (
                <div key={field}>
                  <label className="block mb-1 text-gray-300">{label}</label>
                  <input
                    type="file"
                    onChange={(e) =>
                      handleFileChange(field, e.target.files?.[0] ?? null)
                    }
                    className="w-full px-3 py-2 border border-gray-700 rounded bg-gray-800 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTeacher}
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded transition-all"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeachersTable;
