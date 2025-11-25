"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getTeacherById, Teacher, getProfilePictureUrl } from "@/api/teachers/teachers";
import {API_DOCUMENTS_URL, IMAGE_BASE_URL} from "@/api/base/base";

interface TeacherViewProps {
  teacherId?: string;
}

type FileItem = {
  file: string | null | undefined;
  label: string;
};

const TeacherViewLayout: React.FC<TeacherViewProps> = ({ teacherId }) => {
  const router = useRouter();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalImage, setModalImage] = useState<string | null>(null);

  const isImage = (filename: string) => /\.(jpg|jpeg|png|gif|webp)$/i.test(filename);

  useEffect(() => {
    const id = teacherId || (router.query.id as string);
    if (!id) return;

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    const safeParse = (value: any) => {
      if (!value) return [];

      if (Array.isArray(value)) return value;

      try {
        return JSON.parse(value);
      } catch (e) {
        console.warn("Failed to parse experience:", value);
        return [];
      }
    };

    const loadTeacher = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getTeacherById(id, token);
        if (!data) setError("Teacher not found");
        else {
          setTeacher({
            ...data,
            experience: safeParse(data.experience)
          });
        }
      } catch (err) {
        console.error(err);
        setError(`Failed to load teacher data. ${err}`);
      } finally {
        setLoading(false);
      }
    };

    loadTeacher();
  }, [teacherId, router.query.id]);

  if (!teacherId && !router.query.id) return <div className="text-center py-10">No teacher ID provided</div>;
  if (loading) return <p className="text-center py-10">Loading teacher data...</p>;
  if (error) return <p className="text-center py-10 text-red-500">{error}</p>;
  if (!teacher) return <p className="text-center py-10">Teacher not found.</p>;

  const files: FileItem[] = [
    { file: teacher.medicalCertificate, label: "Medical" },
    { file: teacher.academicQualifications, label: "Academic" },
    { file: teacher.professionalQualifications, label: "Professional" },
  ];

  return (
    <section className="py-8 bg-gray-100 dark:bg-gray-900 min-h-screen w-full transition-colors">
      <div className="max-w-6xl mx-auto px-4 space-y-8">

        {/* Profile Section */}
        <div className="flex flex-col md:flex-row items-center md:items-start bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg gap-6">
          <img
            src={getProfilePictureUrl(teacher.profilePicture)}
            alt={`${teacher.firstName} ${teacher.lastName}`}
            className="w-32 h-32 rounded-full object-cover shadow-md"
          />
          <div className="flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{teacher.firstName} {teacher.lastName}</h2>
            <p className="text-gray-500 dark:text-gray-300 mt-2">{teacher.currentPosition || "Position N/A"}</p>
            <p className="text-gray-500 dark:text-gray-300">{teacher.currentSchool?.name || "School N/A"}</p>
          </div>
        </div>

        {/* Personal & Contact Info Section */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Personal Info</h3>
            <ul className="divide-y divide-gray-200 dark:divide-gray-600">
              {["First Name", "Last Name", "Address", "Marital Status", "NRC", "TS Number"].map((label, i) => {
                const keyMap: Record<string, string> = {
                  "First Name": "firstName",
                  "Last Name": "lastName",
                  "Address": "address",
                  "Marital Status": "maritalStatus",
                  "NRC": "nrc",
                  "TS Number": "tsNo",
                };
                const key = keyMap[label];
                const rawValue = (teacher as any)[key];
                let displayValue: string = "N/A";
                if (rawValue !== undefined && rawValue !== null) {
                  if (typeof rawValue === "object") {
                    // Prefer a .name if present (for nested objects like school), otherwise stringify
                    displayValue = (rawValue && (rawValue as any).name) ? String((rawValue as any).name) : JSON.stringify(rawValue);
                  } else {
                    displayValue = String(rawValue);
                  }
                }
                return (
                  <li key={i} className="py-2 flex justify-between">
                    <span className="text-gray-500 dark:text-gray-300">{label}:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {displayValue}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="flex-1 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Contact Info</h3>
            <ul className="divide-y divide-gray-200 dark:divide-gray-600">
              {["Email"].map((label, i) => {
                const key = label.replace(" ", "").toLowerCase() as keyof Teacher;
                const rawValue = (teacher as any)[key];
                let displayValue: string = "N/A";
                if (rawValue !== undefined && rawValue !== null) {
                  if (typeof rawValue === "object") {
                    displayValue = (rawValue && (rawValue as any).name) ? String((rawValue as any).name) : JSON.stringify(rawValue);
                  } else {
                    displayValue = String(rawValue);
                  }
                }
                return (
                    <li key={i} className="py-2 flex justify-between">
                      <span className="text-gray-500 dark:text-gray-300">{label}:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                      {displayValue}
                    </span>
                    </li>
                );
              })}
              <li className="py-2 flex justify-between">
                <span className="text-gray-500 dark:text-gray-300">Specialization:</span>
                <span
                    className="font-medium text-gray-900 dark:text-white">{teacher.subjectSpecialization || "N/A"}</span>
              </li>
              <li className="py-2 flex justify-between">
                <span className="text-gray-500 dark:text-gray-300">School Name:</span>
                <span
                    className="font-medium text-gray-900 dark:text-white">{teacher.currentSchool?.name || "N/A"}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Files Section */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Files</h3>
          <div className="flex flex-wrap gap-4">
            {files.map((item, idx) => {
              if (!item.file) return null;
              const fileUrl = `${API_DOCUMENTS_URL}${item.file}`;
          
              return (
                <div key={idx} className="flex flex-col items-center w-32">
                  {isImage(item.file) ? (
                    <img
                      src={fileUrl}
                      alt={item.label}
                      className="w-32 h-32 object-cover rounded-lg shadow-sm cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => setModalImage(fileUrl)}
                    />
                  ) : (
                    <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-sm text-center">{item.label}</a>
                  )}
                  <span className="mt-1 text-sm text-gray-500 dark:text-gray-400">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Modal for Images */}
      {modalImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm cursor-pointer"
          onClick={() => setModalImage(null)}
        >
          <img src={modalImage} className="max-h-[90vh] max-w-[90vw] rounded-xl shadow-lg"  alt=''/>
        </div>
      )}
    </section>
  );
};

export default TeacherViewLayout;
