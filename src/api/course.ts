import { CourseData, CourseResponse } from "@/types"
import { apiClient } from "./client"

type CoursePayload = {
    courseName: string
    courseCode: string
    courseUnit: number 
    description?: string 
    examDate?:  string
    lecturerName?: string
}

type CreateCourseResponse = {
    success: boolean
    course: CourseData
}

export const createRegistrationCourse = (payload: CoursePayload, token: string) => {
    return apiClient.post<CreateCourseResponse>('/api/courses', payload, {
        headers:{
            Authorization: `Bearer ${token}`
        }
    })
}

export const createCourse = (payload: CoursePayload) => {
    return apiClient.post<CreateCourseResponse>('/api/courses', payload)
}

export const getCourses = () => apiClient.get<CourseResponse>('/api/courses')

export const getCourse = (courseId: string) => apiClient.get(`/api/courses/${courseId}`)

export const getCourseProgress = (courseId: string) => apiClient.get(`/api/courses/${courseId}/quiz/progress`)

export const getCourseMaterials = (courseId: string) => apiClient.get(`/api/courses/${courseId}/materials`)

export const updateCourse = (courseId: string, payload: Partial<CoursePayload>) => apiClient.patch(`/api/courses/${courseId}`, payload)

export const deleteCourse = (courseId: string) => apiClient.delete(`/api/courses/${courseId}`)

export const uploadMaterial = (courseId: string, payload:{
    title: string
    file: {
        uri: string
        name: string
        type: string
    }
}) => {
    const formData = new FormData()
    formData.append('title', payload.title)
    formData.append('file', {
        uri: payload.file.uri,
        name: payload.file.name,
        type: payload.file.type
    } as any)

    return apiClient.post(`api/courses/${courseId}/materials`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    })
}

export const getQuiz = (courseId: string) => apiClient.get(`/api/courses/${courseId}/quiz`)

export const submitQuiz = (courseId: string, payload: {
    materialId: string
    answers:{
        questionId: string
        selectedAnswer: string
    }[]
})  => apiClient.post(`api/courses/${courseId}/quiz`, payload)
