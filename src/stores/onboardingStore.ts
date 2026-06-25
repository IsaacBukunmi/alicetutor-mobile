import { Student } from '@/types'
import { create } from 'zustand'

type OnboardingData = {
    firstName: string
    lastName: string
    university: string
    program: string
    level: string
    courseOfStudy: string
    email: string
    password: string
    courseName: string
    courseCode: string
    courseUnit: string
    courseLecturer: string
}

type OnboardingState = {
    onboardingData: Partial<OnboardingData>
    pendingStudent: Student | null
    pendingToken: string | null
    setOnboardingData: (fields: Partial<OnboardingData>) => void
    setPending: (student: Student, token: string) => void
    reset: () => void
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
    onboardingData: {},
    pendingStudent: null,
    pendingToken: null,
    setOnboardingData: (fields) => set((state) => ({
        onboardingData:{
            ...state. onboardingData,
            ...fields
        }
    })),
    setPending:(student, token) => set({
        pendingStudent: student,
        pendingToken: token
    }),
    reset: () => set({
        onboardingData: {},
        pendingStudent: null,
        pendingToken: null
    })
}))