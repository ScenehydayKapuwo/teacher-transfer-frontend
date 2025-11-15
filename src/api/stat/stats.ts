import { API_BASE_URL } from "../base/base";
import { apiClient } from "../../api/client/apiClient";

export interface TransferByMonth {
  month: string;
  Pending?: number;
  Approved?: number;
  Rejected?: number;
  pending?: number;
  approved?: number;
  rejected?: number;
}

export interface StatsResponse {
  totals: {
    totalTeachers: number;
    totalSchools: number;
    pendingTransfers: number;
  };
  transferByMonth: TransferByMonth[];
}

export const fetchStats = (token: string | null): Promise<StatsResponse> => {
  return apiClient<StatsResponse>(`${API_BASE_URL}/stats`, {}, token);
};
