import { View, Text, Pressable, Dimensions, Image } from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Colors } from '@/constants'

const { width } = Dimensions.get('window')

export default function WelcomeScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()

  return (
    <View style={{ flex: 1, backgroundColor: Colors.primary }}>
        {/* Decorative circles */}
        <View style={{
            position: 'absolute',
            width: width * 0.7,
            height: width * 0.7,
            borderRadius: width * 0.35,
            backgroundColor: 'rgba(255,255,255,0.08)',
            top: -width * 0.15,
            right: -width * 0.15,
        }} />
        <View style={{
            position: 'absolute',
            width: width * 0.55,
            height: width * 0.55,
            borderRadius: width * 0.275,
            backgroundColor: 'rgba(255,255,255,0.06)',
            bottom: width * 0.25,
            left: -width * 0.2,
        }} />

        {/* Hero content */}
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>

            {/* Avatar card */}
            <View style={{
                    width: 96,
                    height: 96,
                    borderRadius: 24,
                    backgroundColor: '#fff',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 28,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.15,
                    shadowRadius: 20,
                    elevation: 10,
                }}
            >
                <Image 
                    source={require('../../assets/images/alicetutor-icon-512.png')}
                    style={{
                        width: 90,
                        height: 90
                    }}
                    resizeMode='contain'
                />
            </View>
            <Text 
                style={{
                    fontFamily: 'PlusJakartaSans-ExtraBold',
                    fontSize: 32,
                    color: '#fff',
                    textAlign: 'center',
                    letterSpacing: -0.5,
                    marginBottom: 12,
                }}
            >
                AliceTutor
            </Text>
            <Text 
                style={{
                    fontFamily: 'PlusJakartaSans-Medium',
                    fontSize: 15,
                    color: 'rgba(255,255,255,0.75)',
                    textAlign: 'center',
                    lineHeight: 22,
                }}
            >
                Your AI study companion that learns {'\n'} how you learn.
            </Text>
        </View>
        {/* Bottom action sheet */}
        <View style={{
                // backgroundColor: '#fff',
                borderTopLeftRadius: 32,
                borderTopRightRadius: 32,
                paddingHorizontal: 24,
                paddingTop: 32,
                paddingBottom: insets.bottom + 24,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -4 },
                shadowOpacity: 0.06,
                shadowRadius: 12,
                elevation: 0,
            }}>
            <Pressable
            onPress={() => router.push('/(auth)/onboarding/name')}
            style={{
                backgroundColor: Colors.bgCard,
                borderRadius: 14,
                paddingVertical: 16,
                alignItems: 'center',
                marginBottom: 20,
                shadowColor: Colors.primaryLight,
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.28,
                shadowRadius: 22,
                elevation: 8,
            }}
            >
                <Text 
                    style={{ 
                        fontFamily: 'PlusJakartaSans-Bold', 
                        fontSize: 15, 
                        color: Colors.primary }}
                    >
                    Get Started
                </Text>
            </Pressable>

            <Pressable
            onPress={() => router.push('/(auth)/login')}
            style={{ alignItems: 'center' }}
            >
            <Text style={{ fontFamily: 'PlusJakartaSans-Medium', fontSize: 14, color: 'rgba(256, 256, 256, 0.9)' }}>
                Already have an account?{' '}
                <Text style={{ fontFamily: 'PlusJakartaSans-Bold', color: "#fff" }}>
                Sign In
                </Text>
            </Text>
            </Pressable>
        </View>
    </View>
  )
}