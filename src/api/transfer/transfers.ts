import { apiClient } from "../../api/client/apiClient";
import {API_BASE_URL, API_GET_TEACHER_TRANSFER_URL, API_URL} from "../base/base";

export interface School {
  id: number;
  name: string;
  province: string;
  district: string;
}

export type TransferStatus =
  | "pending"
  | "headteacher_approved"
  | "headteacher_rejected"
  | "debs_approved"
  | "debs_rejected"
  | "approved"
  | "rejected";

export interface Teacher {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture: string;
  nrc: string;
  tsNo: string;
  address: string;
  maritalStatus: string;
  medicalCertificate: string;
  academicQualifications: string;
  professionalQualifications: string;
  currentSchoolType: string;
  currentSchoolName: string;
  currentSchool: School | null;
  currentPosition: string;
  subjectSpecialization: string;
  experience: { school: string; years: number }[];
  createdAt: string;
  updatedAt: string;
  currentSchoolId: number | null;
}

export interface TransferResponse {
  id: number;
  status: TransferStatus;
  createdAt: string;
  updatedAt: string;
  teacherId: number;
  fromSchoolId: number | null;
  toSchoolId: number | null;
  teacher: Teacher;
  fromSchool: School | null;
  toSchool: School | null;
}

// Use API_BASE_URL instead of hardcoded URL
export const getTransfers = (token: string | null): Promise<TransferResponse[]> =>
  apiClient<TransferResponse[]>(`${API_URL}/transfers`, {}, token).then((data) =>
    data.map((t) => ({
      ...t,
      teacher: {
        ...t.teacher,
        experience:
          Array.isArray(t.teacher.experience)
              ? t.teacher.experience
              : [],
      },
    }))
  );

// Use API_BASE_URL instead of hardcoded URL
export const getTeacherTransfers = (token: string | null, tsno: string): Promise<TransferResponse[]> =>
    apiClient<TransferResponse[]>(`${API_GET_TEACHER_TRANSFER_URL}/transfers/my/${tsno}`, {}, token).then((data) =>
        data.map((t) => ({
            ...t,
            teacher: {
                ...t.teacher,
                experience:
                    Array.isArray(t.teacher.experience)
                        ? t.teacher.experience
                        : [],
            },
        }))
    );

export const submitTransfer = (teacherId: number, toSchoolId: number, tsno: string, token: string | null) =>
  apiClient(`${API_URL}/transfers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teacherId, toSchoolId, tsno }),
    },
    token
  );

export const fetchTransferById = (id: string, token: string | null): Promise<TransferResponse> =>
  apiClient<TransferResponse>(`${API_URL}/transfers/${id}`, {}, token);

export const updateTransferStatus = (
  id: number,
  status: TransferStatus,
  reason: string = "",
  token: string | null = null
) =>
  apiClient(`${API_URL}/transfers/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, reason }),
    },
    token
  );
