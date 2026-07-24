import { getCourse, getCourseMaterials, getCourseProgress, getCourses, getQuiz } from "@/api/course"
import { CourseData, CourseProgress, CourseResponse, Material, QuizQuestion } from "@/types"
import { offlineCache } from "@/utils/offlineCache"
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
            try {
                const { data } = await getCourseMaterials(courseId)
                const materials = data.materials

                // save to offline cache on success
                await offlineCache.set<Material[]>(`materials_${courseId}`, materials)
                return materials
            } catch (error) {
                // network failed - try cache
                const cached = await offlineCache.get<Material[]>(`materials_${courseId}`)
                if(cached){
                    console.log('loaded materials from offline cache')
                    return cached
                }
                throw error
            }
        },
        staleTime: 1000 * 60 * 5,
        refetchInterval: (query) => {
            const materials = query.state.data
            if(!materials) return false
            const hasProcessing = materials.some((m: Material) => !m.isProcessed && m.processingError !== null)
            return hasProcessing ? 5000 : false
        }
    })
}

export const useQuiz = (courseId: string) => {
    return  useQuery({
        queryKey: ['quiz', courseId],
        queryFn: async () => {
            try {
                const { data } = await getQuiz(courseId)
                const quiz = data.quiz

                // save to offline cache on success
                await offlineCache.set(`quiz_${courseId}`, quiz)
                return quiz
            } catch (error) {
                // network failed - try cache
                const cached = await offlineCache.get<{questions: QuizQuestion[]; totalQuestions: number}>(`quiz_${courseId}`)
                if(cached){
                    console.log('loaded quiz from offline cache')
                    return cached
                }
                throw error
            }
        },
        staleTime:0,
        retry:1
    })
}

