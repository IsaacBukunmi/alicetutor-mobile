import { useAuthStore } from '@/stores/authStore'
import axios from 'axios'

const BASE_URL =  process.env.EXPO_PUBLIC_API_URL


export const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

apiClient.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token
    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // console.log(error.response)
        if(error.response?.status === 401){
            useAuthStore.getState().signOut()
        }
        return Promise.reject(error)
    }
)