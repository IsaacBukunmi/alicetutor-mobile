import { useAuthStore } from "@/stores/authStore";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";

export default function ScreenLayout() {
    const router = useRouter()
    const { token } = useAuthStore()


    useEffect(() => {
        if(!token){
            router.replace('/(auth)/welcome')
        }
    }, [token])

    return <Stack screenOptions={{
        headerShown:false
    }} />
}