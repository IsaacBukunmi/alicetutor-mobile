import { getCourse, getCourseMaterials, getCourseProgress, getCourses } from "@/api/course"
import { CourseData, CourseProgress, CourseResponse } from "@/types"
import { useQuery } from "@tanstack/react-query"

export const useCourses = () => {
    return useQuery<CourseResponse>({
        queryKey: ['courses'],
        queryFn: async () => {
            const response = await getCourses()
            return response.data
        },
        staleTime: 1000 * 60 * 5,
    })
}

export const useCourse = (courseId: string) => {
    return useQuery<CourseData>({
        queryKey: ['course', courseId],
        queryFn: async () => {
            const { data } = await getCourse(courseId)
            return data.course
        },
        staleTime: 1000 * 60 * 5
    })
}

export const useCourseProgress = (courseId: string) => {
    return useQuery<CourseProgress>({
        queryKey: ['course-progress', courseId],
        queryFn: async () => {
            const { data } = await getCourseProgress(courseId)
            return data.progress
        },
        staleTime: 1000 * 60 * 5
    })
}

export const useCourseMaterials = (courseId: string) => {
    return useQuery({
        queryKey:['course-materials', courseId],
        queryFn: async () => {
            const { data } = await getCourseMaterials(courseId)
            return data.materials
        },
        staleTime: 1000 * 60 * 5
    })
}

