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
    examDate: string | null
    lecturerName: string
    createdAt: string
    updatedAt: string
}

export type CourseResponse = {
    success: boolean
    count: number
    courses: CourseData[]
}

export type CourseProgress = {
    course:{
        id: string
        courseName: string
        courseCode: string
    }
    overallAccuracy: number
    totalAttempts: number
    progressByMaterial:{
        materialId: string
        title: string
        attempts: number
        bestAccuracy: number
        latestAccuracy: number
        status: 'mastered' | 'developing' | 'struggling' | 'not_started'
    }[]
}

export type StudyData = {
    _id: string           
    materialName: string
    courseName: string
    courseCode: string
    masteryPercent: number  
    lastStudied: string     
    courseId: string
    status: string
}

export type UpcomingExamsData = {
    _id: string           
    courseName: string
    courseCode: string    
    examDate: string      
    daysRemaining: number 
}

export type DashboardResponse = {
    success: boolean
    student: {
      _id: string           
      firstName: string
      lastName: string
      streak: number      
    }
    stats: {
      totalCourses: number
      totalQuizzes: number 
      averageAccuracy: number  
    }
    upcomingExams: UpcomingExamsData[]
    continueStudying: StudyData[]
    aliceTip: {
      message: string
      courseCode: string | null  
      courseId: string | null  
    }
}

export type QuizQuestion = {
    _id: string
    question: string
    options: string[]
    correctAnswer: string
    difficulty: 'recall' | 'application' | 'analysis'
    materialId: string
}
  
export type Flashcard = {
    _id: string
    front: string
    back: string
}
  
export type Material = {
    _id: string
    student: string
    course: {
      _id: string
      courseName: string
      courseCode: string
    }
    title: string
    fileType: 'pdf' | 'docx' | 'pptx' | 'txt'
    summary: string
    isProcessed: boolean
    processingError: string | null
    questions: QuizQuestion[]
    flashcards: Flashcard[]
    createdAt: string
    updatedAt: string
}

export type QuizSubmitResult = {
    _id:string
    student: string
    course: string
    material: string
    totalQuestions: number
    correctCount: number
    accuracy: number
    difficultyBreakdown: {
        recall: { total:number; correct: number }
        application: { total: number; correct: number }
        analysis: { total: number; correct: number }
    }
    answers: {
        questionId: string
        selectedAnswer: string
        correctAnswer: string
        isCorrect: boolean
        difficulty: 'recall' | 'application' | 'analysis'
        _id:string
    }[]
}

export type ChatMessage = {
    _id: string
    role: 'user' | 'assistant'
    content: string
    createdAt: string
    updatedAt: string
}
  
  export type ChatSession = {
    _id: string
    student: string
    course: {
      _id: string
      courseName: string
      courseCode: string
    } | null
    type: 'general' | 'course_specific'
    title: string
    isTitleGenerated: boolean
    messages: ChatMessage[]
    createdAt: string
    updatedAt: string
}