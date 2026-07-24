import "../global.css";
import { Stack } from "expo-router";
import { useFonts, PlusJakartaSans_400Regular, PlusJakartaSans_500Medium, PlusJakartaSans_600SemiBold, PlusJakartaSans_700Bold, PlusJakartaSans_800ExtraBold } from '@expo-google-fonts/plus-jakarta-sans'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuthStore } from "@/stores/authStore";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { View } from "react-native";
import OfflineBanner from "@/components/OfflineBanner";

SplashScreen.preventAutoHideAsync()

const queryClient = new QueryClient()

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'PlusJakartaSans-Regular': PlusJakartaSans_400Regular,
    'PlusJakartaSans-Medium': PlusJakartaSans_500Medium,
    'PlusJakartaSans-SemiBold': PlusJakartaSans_600SemiBold,
    'PlusJakartaSans-Bold': PlusJakartaSans_700Bold,
    'PlusJakartaSans-ExtraBold': PlusJakartaSans_800ExtraBold,
  })

  const { loadSession } = useAuthStore()
  const { isOnline } = useNetworkStatus()

  useEffect(() => {
    if(fontsLoaded || fontError){
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded, fontError])

  useEffect(() => {
    loadSession()
  }, [])

  if(!fontsLoaded && !fontError){
    return null
  }

  return (
    <QueryClientProvider client={queryClient}>
      <View style={{flex:1}}>
        <Stack screenOptions={{ headerShown: false }}/>
        {!isOnline && <OfflineBanner />}
      </View>
    </QueryClientProvider>
  )
}
