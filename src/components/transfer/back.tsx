// import { API_BASE_URL, IMAGE_BASE_URL } from "../base/base";

// // Teacher interface
// export interface Teacher {
//   id?: number;
//   firstName: string;
//   lastName: string;
//   email: string;
//   address: string;
//   phone?: string;
//   maritalStatus?: string;
//   bio?: string;
//   professionalQualifications?: string;
//   academicQualifications?: string;
//   medicalCertificate?: string;
//   subjectSpecialization?: string;
//   currentSchoolName?: string;
//   currentSchoolType?: string;
//   currentPosition?: string;
//   nrc?: string;
//   tsNo?: string;
//   experience?: string; 
//   profilePicture?: string | null;
//   currentSchool?: {
//     id: number;
//     name: string;
//     code: string;
//     district: string;
//     province: string;
//   };
// }

// // Fetch all teachers
// export const getTeachers = async (): Promise<Teacher[]> => {
//   const res = await fetch(`${API_BASE_URL}/teachers`);
//   if (!res.ok) throw new Error("Failed to fetch teachers");
//   return res.json();
// };

// // Add/register teacher
// export const addTeacher = async (teacher: Teacher | FormData): Promise<Teacher> => {
//   const isFormData = teacher instanceof FormData;
//   const res = await fetch(`${API_BASE_URL}/auth/register`, {
//     method: "POST",
//     headers: isFormData ? {} : { "Content-Type": "application/json" },
//     body: isFormData ? teacher : JSON.stringify(teacher),
//   });
//   if (!res.ok) {
//     const err = await res.json().catch(() => ({}));
//     throw new Error(err.message || "Failed to add teacher");
//   }
//   return res.json();
// };

// // Get a teacher by ID
// export const getTeacherById = async (id: string | number): Promise<Teacher> => {
//   const res = await fetch(`${API_BASE_URL}/teachers/${id}`);
//   if (!res.ok) throw new Error(`Error fetching teacher with ID ${id}: ${res.statusText}`);
//   return res.json();
// };

// // Update a teacher (FormData)
// export const updateTeacher = async (id: number, data: FormData): Promise<Teacher> => {
//   const res = await fetch(`${API_BASE_URL}/teachers/${id}`, {
//     method: "PUT",
//     body: data,
//   });
//   if (!res.ok) {
//     const error = await res.json().catch(() => ({}));
//     throw new Error(error.message || "Update failed");
//   }
//   return res.json();
// };

// // Get full profile picture URL
// export const getProfilePictureUrl = (path: string | null | undefined) => {
//   if (!path) return "/blank-male.jpg";
//   return `${IMAGE_BASE_URL}${path}`;
// };
