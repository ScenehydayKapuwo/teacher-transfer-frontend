import {API_BASE_URL, API_GET_SCHOOLS_URL, API_GET_VACANCY_URL} from "../base/base";

export interface School {
  id?: number;
  name: string;
  district: string;
  province: string;
  code?: string;
  school: string;
  subject: string;
  number_of_teachers: string;
}

const API_SCHOOLS = `${API_GET_SCHOOLS_URL}/schools`;
const API_Vacancy = `${API_GET_VACANCY_URL}/vacancy`;
export const getSchools = async (token: string): Promise<School[]> => {
  const res = await fetch(API_SCHOOLS, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    let errMessage = "Failed to fetch schools";
    try {
      const err = await res.json();
      errMessage = err.message || errMessage;
    } catch (_) {}
    throw new Error(errMessage);
  }

  return res.json();
};

export const getVacancies = async (token: string): Promise<School[]> => {
  const res = await fetch(API_Vacancy, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    let errMessage = "Failed to fetch schools";
    try {
      const err = await res.json();
      errMessage = err.message || errMessage;
    } catch (_) {}
    throw new Error(errMessage);
  }

  return res.json();
};

export const addVacancy = async (school: School, token: string): Promise<School> => {
  const res = await fetch(API_Vacancy, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(school),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to add school");
  }

  return res.json();
};
export const getSchool = async (id: number, token: string): Promise<School> => {
  const res = await fetch(`${API_SCHOOLS}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to fetch school");
  }

  return res.json();
};

export const addSchool = async (school: School, token: string): Promise<School> => {
  const res = await fetch(API_SCHOOLS, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(school),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to add school");
  }

  return res.json();
};

export const updateSchool = async (school: School, token: string): Promise<School> => {
  if (!school.id) throw new Error("School ID is required for update");

  const res = await fetch(`${API_SCHOOLS}/${school.id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(school),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to update school");
  }

  return res.json();
};

export const updateVacancy = async (school: School, token: string): Promise<School> => {
  if (!school.id) throw new Error("Vacancy ID is required for update");

  const res = await fetch(`${API_Vacancy}/${school.id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(school),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.log(err);
    throw new Error(err.message || "Failed to update vacancy");
  }

  return res.json();
};

export const deleteSchool = async (id: number, token: string): Promise<void> => {
  const res = await fetch(`${API_SCHOOLS}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to delete school");
  }
};

export const deleteVacancy = async (id: number, token: string): Promise<void> => {
  const res = await fetch(`${API_Vacancy}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to delete school");
  }
};
