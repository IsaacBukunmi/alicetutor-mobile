import { Student } from "@/types";
import { apiClient } from "./client";

type RegisterPayload = {
    firstName: string
    lastName: string
    email: string
    password: string
    university: string
    program: string
    level: string
    courseOfStudy: string
}

type LoginPayload = {
    email: string
    password: string
}

type AuthResponse = {
    student: Student
    token: string
}

export const register = (payload: RegisterPayload) => {
    return apiClient.post<AuthResponse>('/api/auth/register', payload)
}

export const login = (payload: LoginPayload) => {
    return apiClient.post<AuthResponse>('/api/auth/login', payload)
}
