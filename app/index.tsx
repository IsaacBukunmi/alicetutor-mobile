import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";



export default function Index() {
  const router = useRouter()
  const {isLoading, token} = useAuthStore()

  useEffect(() => {
    if(isLoading) return
    if(token){
      router.replace('/(main)/home')
    }else{
      router.replace('/(auth)/welcome')
    }
  }, [isLoading, token])

  return  <View className="flex-1 bg-surface-bg" />;
}

