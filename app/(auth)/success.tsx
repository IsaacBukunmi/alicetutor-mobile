import { View, Text, Pressable, Dimensions } from 'react-native'
import { useRouter } from 'expo-router'
import { FontAwesome6, Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAuthStore } from '@/stores/authStore'
import { Colors } from '@/constants'
import { useOnboardingStore } from '@/stores/onboardingStore'

const { width, height } = Dimensions.get('window')

const CONFETTI = [
  { top: height * 0.12, left: width * 0.08, size: 18, radius: 4, color: Colors.amber },
  { top: height * 0.18, right: width * 0.12, size: 10, radius: 999, color: Colors.primary },
  { top: height * 0.22, right: width * 0.22, size: 14, radius: 4, color: Colors.purple },
  { top: height * 0.28, left: width * 0.18, size: 10, radius: 999, color: Colors.green },
]

export default function SuccessScreen() {
    const router = useRouter()
    const insets = useSafeAreaInsets()
    const { pendingStudent, pendingToken, reset } = useOnboardingStore()
    const { signIn } = useAuthStore()

    const handleProceed = async () => {
        if(pendingStudent && pendingToken){
            await signIn(pendingStudent, pendingToken)
            reset()
        }
        router.replace('/(main)/home')
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#F0F7F0' }}>

        {/* Confetti dots */}
        {CONFETTI.map((c, i) => (
            <View
                key={i}
                style={{
                    position: 'absolute',
                    top: c.top,
                    left: c.left,
                    right: c.right,
                    width: c.size,
                    height: c.size,
                    borderRadius: c.radius,
                    backgroundColor: c.color,
                }}
            />
        ))}

        {/* Hero */}
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>

            {/* Green checkmark circle */}
            <View 
                style={{
                    width: 96,
                    height: 96,
                    borderRadius: 999,
                    backgroundColor: Colors.green,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 28,
                    shadowColor: Colors.green,
                    shadowOffset: { width: 0, height: 10 },
                    shadowOpacity: 0.3,
                    shadowRadius: 20,
                    elevation: 8,
                }}
            >
                <FontAwesome6 name="check" size={48} color="#fff" />
            </View>

            <Text style={{
            fontFamily: 'PlusJakartaSans-ExtraBold',
            fontSize: 26,
            color: Colors.inkHeading,
            textAlign: 'center',
            letterSpacing: -0.4,
            marginBottom: 12,
            }}>
            You're all set, {pendingStudent?.firstName}!
            </Text>

            <Text style={{
            fontFamily: 'PlusJakartaSans-Medium',
            fontSize: 15,
            color: Colors.inkSecondary,
            textAlign: 'center',
            lineHeight: 24,
            }}>
            Upload your first lecture material and Alice will turn it into quizzes, flashcards and summaries.
            </Text>
        </View>

        {/* Actions */}
        <View style={{ paddingHorizontal: 24, paddingBottom: insets.bottom + 24, gap: 12 }}>
            <Pressable
                onPress={() => handleProceed()}
                style={{
                    backgroundColor: Colors.primary,
                    borderRadius: 14,
                    paddingVertical: 16,
                    alignItems: 'center',
                    shadowColor: Colors.primary,
                    shadowOffset: { width: 0, height: 10 },
                    shadowOpacity: 0.28,
                    shadowRadius: 22,
                    elevation: 8,
                }}
            >
            <Text style={{ fontFamily: 'PlusJakartaSans-Bold', fontSize: 15, color: '#fff' }}>
                Upload a Material
            </Text>
            </Pressable>

            <Pressable
                onPress={() => handleProceed()}
                style={{
                    backgroundColor: Colors.bgCard,
                    borderRadius: 14,
                    paddingVertical: 16,
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: Colors.borderCard,
                }}
            >
            <Text style={{ fontFamily: 'PlusJakartaSans-Bold', fontSize: 15, color: Colors.primary }}>
                Explore the App
            </Text>
            </Pressable>
        </View>

        </View>
    )
}