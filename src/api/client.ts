import { useAuthStore } from '@/stores/authStore'
import axios from 'axios'

const BASE_URL =  'https://alicetutor-backend-production.up.railway.app'

// https://alicetutor-backend-production.up.railway.app
// http://localhost:8080

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
        if(error.response?.status === 401){
            useAuthStore.getState().signOut()
        }
        return Promise.reject(error)
    }
)