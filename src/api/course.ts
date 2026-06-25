import { CourseData } from "@/types"
import { apiClient } from "./client"

type CoursePayload = {
    courseName: string
    courseCode: string
    courseUnit: number 
    description?: string 
    examDate?:  Date
    lecturerName?: string
}

type CourseResponse = {
    success: boolean
    course: CourseData
}

export const createRegistrationCourse = (payload: CoursePayload, token: string) => {
    return apiClient.post<CourseResponse>('/api/courses', payload, {
        headers:{
            Authorization: `Bearer ${token}`
        }
    })
}

export const createCourse = (payload: CoursePayload) => {
    return apiClient.post<CourseResponse>('/api/courses', payload)
}