import React, { useState, useEffect } from "react";
import {

  updateSchool,
  deleteVacancy,
  School, getVacancies, addVacancy, updateVacancy,
} from "@/api/school/schools";
import { requireToken } from "@/api/base/token";
import { getCurrentUser } from "@/api/base/jwt";
import router from "next/router";
import { Search, PlusCircle, XCircle } from "lucide-react";

const provinces = {
  Lusaka: ["Lusaka", "Chilanga", "Kafue"],
  "North-Western": ["Mwinilunga", "Solwezi", "Kabompo"],
  Northern: ["Kasama", "Mbala", "Mporokoso"],
  Copperbelt: ["Kitwe", "Ndola", "Chingola", "Mufulira"],
};

interface vacancy  {
  name: string,
  number_of_schools: number,
  district: string,
  province: string,
}

const VacancyTable = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [newSchool, setNewSchool] = useState<School>({
    id: 0, number_of_teachers: "",
    subject:"",
    school: "",
    name: "",
    code: "",
    district: "",
    province: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  const [role, setRole] = useState<string | null>(null);

  const itemsPerPage = 10;

  useEffect(() => {
    const currentUser = getCurrentUser();
    setRole(currentUser?.role ?? null);
  }, []);

  const fetchSchools = async () => {
    const token = requireToken(router);
    if (!token) return;

    setLoading(true);
    setError("");
    try {
      const data = await getVacancies(token);
      setSchools(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to fetch schools");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  const handleAddSchool = async () => {
    const token = requireToken(router);
    if (!token) return;
      console.log(newSchool);
    if (!newSchool.school || !newSchool.district || !newSchool.province || !newSchool.number_of_teachers) return;

    setLoading(true);
    setError("");
    try {
      if (editingSchool) {
        const updated = await updateVacancy({ ...newSchool, id: editingSchool.id }, token);
        setSchools(schools.map((s) => (s.id === updated.id ? updated : s)));
      } else {
        const added = await addVacancy(newSchool, token);
        setSchools([...schools, added]);
      }
      setNewSchool({id: 0, number_of_teachers: "", subject:"", school: "", name: "", code: "", district: "", province: "" });
      setShowModal(false);
      setEditingSchool(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to save vacancy");
    } finally {
      setLoading(false);
    }
  };

  const handleEditSchool = (school: School) => {
    setEditingSchool(school);
    setNewSchool({
      id: 0,
      number_of_teachers: school.number_of_teachers,
      subject: school.subject,
      school:  school.school ,
      name: school.name,
      code: school.code || "",
      district: school.district,
      province: school.province
    });
    setShowModal(true);
  };

  const handleDeleteSchool = async (id: number) => {
    const token = requireToken(router);
    if (!token) return;

    setLoading(true);
    setError("");
    try {
      await deleteVacancy(id, token);
      setSchools(schools.filter((s) => s.id !== id));
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to delete school");
    } finally {
      setLoading(false);
    }
  };

  const filteredSchools = schools.filter((school) =>
    Object.values(school).join(" ").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentSchools = filteredSchools.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredSchools.length / itemsPerPage);

  const searchOptions = Array.from(
    new Set(
      schools.flatMap((school) => [school.name, school.code, school.district, school.province])
    )
  );

  return (
    <div className="bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-6 transition-all">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        {(role === "admin" || role === "debs" || role === "ministry admin") && (
          <button
            onClick={() => {
              setShowModal(true);
              setEditingSchool(null);
              setNewSchool({id: 0, number_of_teachers: "", subject:"", school: "", name: "", code: "", district: "", province: "" });
            }}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm transition"
          >
            <PlusCircle className="w-4 h-4" />
            Add Vacancy
          </button>
        )}

        {/* Search input */}
        <div className="relative w-full sm:w-1/3">
          <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search schools..."
            list="schoolSearch"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Error message */}
      {error && <div className="text-red-500 font-medium mb-4">{error}</div>}

      {/* Loading */}
      {loading ? (
        <div className="text-center py-10 text-gray-500 dark:text-gray-300">Loading vacancies...</div>
      ) : currentSchools.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-gray-400">
          <XCircle className="w-10 h-10 mb-2 text-gray-500" />
          <p>No vacancies found</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="w-full text-sm text-left text-gray-600 dark:text-gray-300">
            <thead className="text-xs uppercase bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
            <tr>
              <th className="px-6 py-3">School</th>
              <th className="px-6 py-3">Subject</th>
              <th className="px-6 py-3">No of Teachers</th>
              <th className="px-6 py-3">District</th>
              <th className="px-6 py-3">Province</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
            </thead>
            <tbody>
              {currentSchools.map((school, index) => (
                  <tr
                      key={index}
                      className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-800 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    <td className="px-6 py-3 font-medium">{school.school}</td>
                    <td className="px-6 py-3">{school.subject}</td>
                    <td className="px-6 py-3">{school.number_of_teachers}</td>
                    <td className="px-6 py-3">{school.district}</td>
                    <td className="px-6 py-3">{school.province}</td>
                    {(role === "admin" || role === "debs" || role === "ministry admin") && (
                        <td className="px-6 py-3 flex gap-2">
                          <button
                              className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 transition"
                              onClick={() => handleEditSchool(school)}
                          >
                            Edit
                          </button>
                          <button
                              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                              onClick={() => school.id && handleDeleteSchool(school.id)}
                          >
                            Delete
                          </button>
                        </td>
                    )}

                    {(role === "teacher") && (
                        <td className="px-6 py-3 flex gap-2">
                          <button
                              className="px-3 py-1 bg-green-400 text-white rounded hover:bg-yellow-500 transition"
                              onClick={() => router.push("/transfer")}
                          >
                            Apply
                          </button>

                        </td>
                    )}
                  </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Page {currentPage} of {totalPages}
        </span>
        <div className="flex gap-2">
          <button
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Prev
          </button>
          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-gray-900 text-white rounded-2xl shadow-2xl p-6 w-full max-w-md border border-gray-700">
            <h2 className="text-lg font-semibold mb-4">
              {editingSchool ? "Edit Vacancy" : "Add New Vacancy"}
            </h2>

            <div className="space-y-3">
              <input
                  type="text"
                  placeholder="School Name"
                  value={newSchool.school}
                  onChange={(e) => setNewSchool({...newSchool, school: e.target.value})}
                  className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <input
                  type="number"
                  placeholder="Number Of Teachers"
                  value={newSchool.number_of_teachers}
                  onChange={(e) => setNewSchool({...newSchool, number_of_teachers: e.target.value})}
                  className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <div>

                <select
                    value={newSchool.subject || ""}
                    onChange={(e) =>
                        setNewSchool({
                          ...newSchool,
                         subject: e.target.value
                        })
                    }
                    className="w-full px-3 py-2 border border-gray-700 rounded bg-gray-800 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Subject</option>
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

              <input
                  list="provinces"
                  placeholder="Select Province"
                  value={newSchool.province}
                  onChange={(e) =>
                      setNewSchool({...newSchool, province: e.target.value, district: ""})
                  }
                  className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <datalist id="provinces">
                {Object.keys(provinces).map((prov, idx) => (
                    <option key={idx} value={prov}/>
                ))}
              </datalist>

              <input
                  list="districts"
                  placeholder="Select District"
                  value={newSchool.district}
                  onChange={(e) => setNewSchool({...newSchool, district: e.target.value})}
                  className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <datalist id="districts">
                {newSchool.province &&
                    provinces[newSchool.province as keyof typeof provinces]?.map(
                        (dist: string, idx: number) => <option key={idx} value={dist}/>
                    )}
              </datalist>
            </div>

            <div className="flex justify-end gap-2 mt-5">
              <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingSchool(null);
                  }}
                  className="px-4 py-2 bg-gray-700 text-gray-200 rounded hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                  onClick={handleAddSchool}
                  disabled={loading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
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

export default VacancyTable;
