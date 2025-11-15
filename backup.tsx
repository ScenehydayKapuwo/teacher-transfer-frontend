// import { useState, useEffect } from "react";
// import Swal from "sweetalert2";
// import { getTeacher, updateTeacher, getProfilePictureUrl, Teacher } from "../../api/teachers/teachers";

// export default function ProfileComp() {
//   const [teacher, setTeacher] = useState<Teacher | null>(null);
//   const [formData, setFormData] = useState<Partial<Pick<Teacher, "email" | "address" | "maritalStatus">>>({});
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     getTeacher(8)
//       .then((data) => {
//         setTeacher(data);
//         setFormData({
//           email: data.email,
//           address: data.address,
//           maritalStatus: data.maritalStatus,
//         });
//       })
//       .catch((err) => {
//         console.error("Failed to fetch teacher:", err);
//         Swal.fire("Error", "Failed to load teacher profile", "error");
//       });
//   }, []);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files?.[0]) setSelectedFile(e.target.files[0]);
//   };

//   const handleSave = async () => {
//     if (!teacher || teacher.id === undefined) return;
//     try {
//       setLoading(true);

//       const form = new FormData();
//       form.append("email", formData.email || "");
//       form.append("address", formData.address || "");
//       form.append("maritalStatus", formData.maritalStatus || "");
//       if (selectedFile) form.append("profilePicture", selectedFile);

//       const updated = await updateTeacher(teacher.id, form);
//       setTeacher(updated);
//       setFormData({
//         email: updated.email,
//         address: updated.address,
//         maritalStatus: updated.maritalStatus,
//       });
//       setSelectedFile(null);
//       setIsEditing(false);
//       Swal.fire("Success", "Profile updated successfully", "success");
//     } catch (err: any) {
//       console.error("Update failed:", err);
//       Swal.fire("Error", err.message || "Something went wrong", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!teacher) return <p className="text-center py-10">Loading teacher profile...</p>;

//   const editableFields = [
//     { label: "Email", name: "email", type: "email", value: formData.email || "" },
//     { label: "Address", name: "address", type: "textarea", value: formData.address || "" },
//     { label: "Marital Status", name: "maritalStatus", type: "select", value: formData.maritalStatus || "", options: ["Single", "Married", "Divorced", "Widowed"] },
//   ];

//   const readonlyFields = [
//     { label: "NRC", value: teacher.nrc || "-" },
//     { label: "TS No", value: teacher.tsNo || "-" },
//     { label: "Professional Qualifications", value: teacher.professionalQualifications || "-" },
//     { label: "Current School Name", value: teacher.currentSchoolName || "-" },
//     { label: "Current Position", value: teacher.currentPosition || "-" },
//     { label: "Subject Specialization", value: teacher.subjectSpecialization || "-" },
//     { label: "Experience", value: teacher.experience || "-" },
//   ];

//   return (
//     <section className="py-10 bg-gray-50 dark:bg-gray-900 antialiased">
//       <div className="max-w-6xl mx-auto px-4">
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

//           {/* Profile Image: 4/12 width */}
//           <div className="col-span-1 lg:col-span-4 flex justify-center lg:justify-start">
//             <div className="relative">
//               <img
//                 className="w-64 h-64 object-cover rounded-full shadow-xl dark:shadow-gray-800"
//                 src={getProfilePictureUrl(teacher.profilePicture ?? null)}
//                 alt={`${teacher.firstName} ${teacher.lastName}`}
//               />
//               {isEditing && (
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={handleFileChange}
//                   className="mt-3 block w-full text-sm text-gray-500 dark:text-gray-400"
//                 />
//               )}
//             </div>
//           </div>

//           {/* Info Section: 8/12 width */}
//           <div className="col-span-1 lg:col-span-8">
//             <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
//               {teacher.firstName} {teacher.lastName}
//             </h1>
//             <p className="text-lg text-primary-700 dark:text-primary-400 mt-1">
//               {teacher.currentPosition || "-"}
//             </p>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
//               {editableFields.map((field) => (
//                 <div key={field.name} className="flex flex-col">
//                   <label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{field.label}</label>
//                   {isEditing ? (
//                     field.type === "textarea" ? (
//                       <textarea
//                         name={field.name}
//                         value={field.value}
//                         onChange={handleChange}
//                         className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       />
//                     ) : field.type === "select" ? (
//                       <select
//                         name={field.name}
//                         value={field.value}
//                         onChange={handleChange}
//                         className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       >
//                         {field.options?.map((opt) => (
//                           <option key={opt} value={opt}>{opt}</option>
//                         ))}
//                       </select>
//                     ) : (
//                       <input
//                         type={field.type}
//                         name={field.name}
//                         value={field.value}
//                         onChange={handleChange}
//                         className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       />
//                     )
//                   ) : (
//                     <p className="text-gray-900 dark:text-white font-medium">{field.value}</p>
//                   )}
//                 </div>
//               ))}

//               {readonlyFields.map((field) => (
//                 <div key={field.label} className="flex flex-col">
//                   <label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{field.label}</label>
//                   <p className="text-gray-900 dark:text-white font-medium">{field.value}</p>
//                 </div>
//               ))}
//             </div>

//             {/* Buttons */}
//             <div className="mt-6 flex flex-wrap gap-4">
//               {isEditing ? (
//                 <>
//                   <button
//                     onClick={handleSave}
//                     disabled={loading}
//                     className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
//                   >
//                     {loading ? "Saving..." : "Save"}
//                   </button>
//                   <button
//                     onClick={() => setIsEditing(false)}
//                     disabled={loading}
//                     className="px-5 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 disabled:opacity-50"
//                   >
//                     Cancel
//                   </button>
//                 </>
//               ) : (
//                 <button
//                   onClick={() => setIsEditing(true)}
//                   className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                 >
//                   Edit Profile
//                 </button>
//               )}
//             </div>
//           </div>

//         </div>
//       </div>
//     </section>
//   );
// }
