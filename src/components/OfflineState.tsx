import { View, Text, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '@/constants'

type Props = {
  message?: string
}

export default function OfflineState({
  message = "You appear to be offline. You can still take quizzes and review flashcards for courses you've already visited.",
}: Props) {
  const router = useRouter()

  return (
    <View style={{
      flex: 1,
      backgroundColor: Colors.bgApp,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 32,
    }}>
      <View style={{
        width: 72,
        height: 72,
        borderRadius: 999,
        backgroundColor: Colors.amberSoft,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
      }}>
        <Ionicons name="cloud-offline-outline" size={34} color={Colors.amberText} />
      </View>

      <Text style={{
        fontFamily: 'PlusJakartaSans-ExtraBold',
        fontSize: 18,
        color: Colors.inkHeading,
        textAlign: 'center',
        marginBottom: 10,
      }}>
        You're offline
      </Text>

      <Text style={{
        fontFamily: 'PlusJakartaSans-Medium',
        fontSize: 14,
        color: Colors.inkSecondary,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 32,
      }}>
        {message}
      </Text>

      <Pressable
        onPress={() => router.push('/(main)/courses')}
        style={{
          backgroundColor: Colors.primary,
          borderRadius: 14,
          paddingVertical: 14,
          paddingHorizontal: 28,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          shadowColor: Colors.primary,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.28,
          shadowRadius: 16,
          elevation: 6,
        }}
      >
        <Ionicons name="book-outline" size={16} color="#fff" />
        <Text style={{
          fontFamily: 'PlusJakartaSans-Bold',
          fontSize: 14,
          color: '#fff',
        }}>
          Go to Courses
        </Text>
      </Pressable>
    </View>
  )
}