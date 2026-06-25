import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as SecureStore from 'expo-secure-store'
import { Student } from '@/types'

const TOKEN_KEY = 'alicetutor_token'
const STUDENT_KEY = 'alicetutor_student'


type AuthState = {
    student: Student | null
    token: string | null
    isLoading: boolean
    signIn: (student: Student, token: string) => Promise<void>
    signOut: () => Promise<void>
    loadSession: () => Promise<void>
    setTokenTemporary:(token:string) => void
}

export const useAuthStore = create<AuthState>(
    (set) => ({
        student: null,
        token: null,
        isLoading: true,

        signIn: async (student, token) => {
            await SecureStore.setItemAsync(TOKEN_KEY, token)
            await AsyncStorage.setItem(STUDENT_KEY, JSON.stringify(student))
            set({
                student,
                token
            })
        },

        signOut: async () => {
            await SecureStore.deleteItemAsync(TOKEN_KEY)
            await AsyncStorage.removeItem(STUDENT_KEY)
            set({ 
                student: null, 
                token: null
            })
        },

        loadSession: async () => {
            try {
                const token = await SecureStore.getItemAsync(TOKEN_KEY)
                const studentJson = await AsyncStorage.getItem(STUDENT_KEY)
                const student = studentJson ? JSON.parse(studentJson) : null
                if(token){
                    set({
                        token,
                        student, 
                        isLoading: false
                    })
                }else{
                    set({
                        isLoading: false
                    })
                }
            } catch (error) {
                set({
                    isLoading: false
                })
            }
        },

        setTokenTemporary: (token: string) => set({
            token
        })
    })
)