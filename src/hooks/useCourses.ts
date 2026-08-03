import { getCourse, getCourseMaterials, getCourseProgress, getCourses, getQuiz } from "@/api/course"
import { CourseData, CourseProgress, CourseResponse, Material, QuizQuestion } from "@/types"
import { offlineCache } from "@/utils/offlineCache"
import { useQuery } from "@tanstack/react-query"

const fetchCourses = async () => {
    try {   
        const { data } = await getCourses()
        const courses = data.courses

        // save to offline cache on success
        await offlineCache.set<CourseData[]>('courses', courses)
        return courses
    } catch (error) {
        // network failed - try cache
        const cached = await offlineCache.get<CourseData[]>('courses')
        if(cached){
            console.log('loaded courses from cache')
            return cached
        }
    }
}

const fetchCourse = (courseId: string) => async () =>{
    try {
        const { data } = await getCourse(courseId)
        const course = data.course

        // save to offline cache on success
        await offlineCache.set<CourseData>(`course_${courseId}`, course)
        return course
    } catch (error) {
        // network failed - try cache
        const cached = await offlineCache.get<CourseData>(`course_${courseId}`)
        if(cached){
            console.log('loaded course from cache')
            return cached
        }
    }
}

const fetchCourseProgress = (courseId:string) => async () => {
    try {
        const { data } = await getCourseProgress(courseId)
        const progress = data.progress

        // save to offline cache on success
        await offlineCache.set<CourseProgress>(`course-progress_${courseId}`, progress)
        return progress
    } catch (error) {
        // network failed - try cache
        const cached = await offlineCache.get<CourseProgress>(`course-progress_${courseId}`)
        if(cached){
            console.log('loaded course progress from cache')
            return cached
        }
    }
}

const fetchCourseMaterials = (courseId: string) => async () => {
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
}

const fetchQuiz = (courseId: string) => async () => {
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
}

export const useCourses = () => {
    return useQuery<CourseData[]>({
        queryKey: ['courses'],
        queryFn: fetchCourses,
        staleTime: 1000 * 60 * 5,
    })
}

export const useCourse = (courseId: string) => {
    return useQuery<CourseData>({
        queryKey: ['course', courseId],
        queryFn: fetchCourse(courseId),
        staleTime: 1000 * 60 * 5
    })
}

export const useCourseProgress = (courseId: string) => {
    return useQuery<CourseProgress>({
        queryKey: ['course-progress', courseId],
        queryFn: fetchCourseProgress(courseId),
        staleTime: 1000 * 60 * 5
    })
}

export const useCourseMaterials = (courseId: string) => {
    return useQuery({
        queryKey:['course-materials', courseId],
        queryFn: fetchCourseMaterials(courseId),
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
        queryFn: fetchQuiz(courseId),
        staleTime:0,
        retry:1
    })
}

export { fetchCourses, fetchCourse, fetchCourseProgress, fetchCourseMaterials, fetchQuiz }

