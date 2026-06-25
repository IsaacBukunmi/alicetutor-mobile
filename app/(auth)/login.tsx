import { login } from '@/api/auth'
import LoadingSpinner from '@/components/LoadingSpinner'
import OnboardingInput from '@/components/OnboardingInput'
import { Colors } from '@/constants'
import { useAuthStore } from '@/stores/authStore'
import { Ionicons } from '@expo/vector-icons'
import { Color, useRouter } from 'expo-router'
import { useState } from 'react'
import { View, Text, Pressable, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const LoginScreen = () => {
    const router = useRouter()
    const insets = useSafeAreaInsets()
    const { signIn  } = useAuthStore()

    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ showPassword, setShowPassword ] = useState(false)
    const [ isLoading, setIsLoading ] = useState(false)
    const [ error, setError ] = useState("")

    const canSignIn = email.trim().length > 0 && password.length > 0

    const handleLogin = async () => {
        setIsLoading(true)
        try {
            const { data } = await login({
                email: email.trim(),
                password
            })
            await signIn(data.student, data.token)
            router.replace('/(main)/home')
        } catch (error:any) {
            setError(error.response?.data?.message ?? "Invalid email or password")
        }finally{
            setIsLoading(false)
        }
     
    }

    return (
        <KeyboardAvoidingView
            style={{ flex:1, backgroundColor: Colors.bgApp }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={{ flexGrow:1 }}
                keyboardShouldPersistTaps="handled"
            >
                <View
                    style={{
                        flex:1,
                        paddingHorizontal:24,
                        paddingTop: insets.top + 24,
                        paddingBottom: insets.bottom + 24
                    }}
                >
                    <View style={{
                        marginBottom:35,
                    }}>
                        <Pressable 
                            onPress={() => router.back()}
                            style={{
                                borderColor: Colors.borderInput,
                                backgroundColor: Colors.bgCard,
                                width:42,
                                height:42,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius:12,
                                shadowColor: "#000",
                                shadowOffset: { width:0, height:2 },
                                shadowOpacity:0.06,
                                shadowRadius:8,
                                elevation:2
                            }}
                        >
                            <Ionicons name='chevron-back' size={24} color={Colors.inkHeading}/>
                        </Pressable>
                    </View>
                    <View 
                        style={{
                            marginBottom:15,
                            shadowColor: "#000",
                            shadowOffset:{ width: 2, height:10},
                            shadowOpacity:0.13,
                            shadowRadius:5,
                            elevation:6
                        }}
                    >
                        <Image 
                            source={require('../../assets/images/alicetutor-icon-512.png')}
                            style={{
                                width: 70,
                                height: 70
                            }}
                            resizeMode='contain'
                        />
                    </View>
                    <View style={{ marginBottom: 30 }}>
                        <Text style={{
                            fontFamily: 'PlusJakartaSans-ExtraBold',
                            fontSize: 26,
                            color: Colors.inkHeading,
                            letterSpacing: -0.4,
                            marginBottom: 6,
                        }}>
                            Welcome back
                        </Text>
                        <Text style={{
                            fontFamily: 'PlusJakartaSans-Medium',
                            fontSize: 15,
                            color: Colors.inkSecondary,
                            lineHeight: 22,
                        }}>
                            Sign in to keep your streak going.
                        </Text>
                    </View>
                    <View 
                        style={{
                            gap:20
                        }}
                    >
                        {/* Email */}
                        <OnboardingInput
                            label='Email Address'
                            value={email}
                            onChangeText={setEmail}
                            placeholder="isaac@student.edu.ng"
                            keyboardType='email-address'
                            autoCapitalize='none'
                            autoComplete='email'
                        />

                        <View>
                            <Text style={labelStyle}>Password</Text>
                            <View style={{ position: 'relative' }}>
                                <OnboardingInput
                                    label=""
                                    value={password}
                                    onChangeText={setPassword}
                                    placeholder="Enter your password"
                                    secureTextEntry={!showPassword}
                                    autoCapitalize="none"
                                />
                                <Pressable
                                    onPress={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: 16,
                                        top: 0,
                                        bottom: 0,
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Ionicons
                                        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                        size={20}
                                        color={Colors.inkMuted}
                                    />
                                </Pressable>
                            </View>
                            <View style={{alignItems:'flex-end', marginTop:10}}>
                                <Pressable>
                                    <Text style={{
                                        fontFamily: 'PlusJakartaSans-Bold',
                                        color:Colors.primary
                                    }}>Forgot password?</Text>
                                </Pressable>
                            </View>

                            {/* Error */}
                            {error.length > 0 && (
                                <View style={{
                                    backgroundColor: Colors.redSoft,
                                    borderRadius: 10,
                                    padding: 12,
                                    marginTop:10,
                                    marginBottom: 10,
                                }}>
                                    <Text style={{
                                        fontFamily: 'PlusJakartaSans-Medium',
                                        fontSize: 13,
                                        color: Colors.redText,
                                        textAlign: 'center',
                                    }}>
                                        {error}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>
                    <View  style={{flex: 1}}/>
                    <View>
                        <Pressable
                            onPress={() => handleLogin()}
                            disabled={isLoading}
                            style={{
                                backgroundColor: canSignIn ? Colors.primary : Colors.divider,
                                borderRadius: 14,
                                paddingVertical: 16,
                                alignItems: 'center',
                                shadowColor: canSignIn ? Colors.primary : 'transparent',
                                shadowOffset: { width: 0, height: 10 },
                                shadowOpacity: canSignIn ? 0.28 : 0,
                                shadowRadius: 22,
                                elevation: canSignIn ? 8 : 0,
                                marginBottom: 15
                            }}
                        >
                            <View style={{flexDirection: 'row', gap:10}}>
                                {
                                    isLoading &&
                                    <LoadingSpinner color="#fff" size="small" />
                                }
                                <Text 
                                    style={{
                                        fontFamily: 'PlusJakartaSans-Bold',
                                        fontSize: 15,
                                        color: canSignIn ? '#fff' : Colors.inkMuted,
                                    }}
                                >
                                    Sign In
                                </Text>
                            </View>
                        </Pressable>
                        <Pressable
                            onPress={() => router.replace('/(auth)/onboarding/name')}
                            style={{ alignItems: 'center' }}
                        >
                            <Text style={{ fontFamily: 'PlusJakartaSans-Medium', fontSize: 14, color: Colors.inkSecondary }}>
                                New here?{' '}
                                <Text style={{ fontFamily: 'PlusJakartaSans-Bold', color: Colors.primary }}>
                                    Get started
                                </Text>
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

const labelStyle = {
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: 13,
    color: Colors.inkBody,
    marginBottom: 8,
}

export default LoginScreen