import {API_BASE_URL, API_URL, IMAGE_BASE_URL} from "../base/base";
import { apiClient } from "../../api/client/apiClient";

export interface Teacher {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  phone?: string;
  maritalStatus?: string;
  bio?: string;
  professionalQualifications?: string;
  academicQualifications?: string;
  medicalCertificate?: string;
  subjectSpecialization?: string;
  currentSchoolName?: string;
  currentSchoolType?: string;
  currentPosition?: string;
  nrc?: string;
  tsNo?: string;
  experience?: string; 
  profilePicture?: string | null;
  currentSchool?: {
    id: number;
    name: string;
    code: string;
    district: string;
    province: string;
  };
}

export const getTeachers = (token: string | null): Promise<Teacher[]> => {
  return apiClient<Teacher[]>(`${API_URL}/teachers`, {}, token);
};


export const addTeacher = async (formData: FormData, token?: string | null): Promise<Teacher> => {
  return apiClient<Teacher>(
    `${API_URL}/auth/register`,
    {
      method: "POST",
      body: formData,
    },
    token
  );
};
export const addProfile = async (formData: FormData, token?: string | null): Promise<Teacher> => {
  return apiClient<Teacher>(
    `${API_URL}/auth/addProfile`,
    {
      method: "POST",
      body: formData,
    },
    token
  );
};


export const getTeacherById = (id: string, token: string | null): Promise<Teacher> => {
  return apiClient<Teacher>(`${API_URL}/teachers/${id}`, {}, token);
};


export const getTeacher = (id: number, token: string | null): Promise<Teacher> => {
  return apiClient<Teacher>(`${API_BASE_URL}/teachers/${id}`, {}, token);
};


export const updateTeacher = (id: number, data: FormData, token: string | null): Promise<Teacher> => {
  return apiClient<Teacher>(
    `${API_BASE_URL}/teachers/${id}`,
    {
      method: "PUT",
      body: data,
    },
    token
  );
};

export const getProfilePictureUrl = (path: string | null | undefined) => {
  if (!path) return "/blank-male.jpg";
  return `${IMAGE_BASE_URL}/${path}`;
};
