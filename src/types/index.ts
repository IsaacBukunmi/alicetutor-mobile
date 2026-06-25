export type Student = {
    id: string
    firstName: string
    lastName: string
    email: string
    university?: string
    program?: string
    level?: string
    courseOfStudy?:string
}

export type CourseData = {
    _id: string
    student: string
    courseName: string
    courseCode: string
    courseUnit: number
    description: string
    examDate: Date | null
    lecturerName: string
    createdAt: string
    updatedAt: string
}