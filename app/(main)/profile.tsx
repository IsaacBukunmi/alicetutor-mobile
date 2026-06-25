import { View, Text, Pressable } from 'react-native'
import { useAuthStore } from '@/stores/authStore'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'

const Profile = () => {
    const { signOut } = useAuthStore()
    const router = useRouter()
    const insets = useSafeAreaInsets()
    const handleLogout = async () => {
        await signOut()
        router.push('/(auth)/welcome')
    }

    return (
        <View
            style={{
                paddingHorizontal: 24,
                paddingTop: insets.top + 24,
                paddingBottom: insets.bottom + 24
            }}
        >
            <Pressable
                onPress={() => handleLogout()}
            >
                <Text>Logout</Text>
            </Pressable>
        </View>
    )
}

export default Profile