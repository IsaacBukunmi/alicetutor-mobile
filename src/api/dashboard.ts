import { DashboardResponse } from "@/types";
import { apiClient } from "./client";

export const getDashboardData = () => apiClient.get<DashboardResponse>('/api/student/dashboard')