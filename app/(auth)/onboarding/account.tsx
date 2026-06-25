import OnboardingInput from '@/components/OnboardingInput'
import OnboardingLayout from '@/components/OnboardingLayout'
import { Colors } from '@/constants'
import { useOnboardingStore } from '@/stores/onboardingStore'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Pressable, Text, View } from 'react-native'

const OnboardingAccountScreen = () => {
    const router = useRouter()
    const { onboardingData, setOnboardingData } = useOnboardingStore()
    const [ email, setEmail ] = useState(onboardingData.email ?? "")
    const [ password, setPassword ] = useState(onboardingData?.password ?? "")
    const [ confirmPassword, setConfirmPassword ] = useState("")
    const [ showPassword, setShowPassword ] = useState(false)
    const [ showConfirm, setShowConfirm ] = useState(false)

    const passwordsMatch = password === confirmPassword
    const passwordStrong = password.length >= 8   

    const canContinue = email.trim().length > 0 && passwordStrong && passwordsMatch && confirmPassword.length > 0

    const handleContinue = () => {
        setOnboardingData({
            email: email.trim(),
            password
        })
        router.push('/(auth)/onboarding/course')
    }

    return (
        <OnboardingLayout
            step={3}
            title='Create your account'
            subtitle='This keeps your progress synced.'
            canContinue={canContinue}
            onContinue={handleContinue}
        >
            <View style={{gap:20}}>
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
                {/* Password */}
                <View>
                    <Text style={labelStyle}>Password</Text>
                    <View style={{ position: 'relative' }}>
                        <OnboardingInput
                            label=""
                            value={password}
                            onChangeText={setPassword}
                            placeholder="At least 8 characters"
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
                    {
                        password.length > 0 && !passwordStrong && (
                            <Text style={{
                                fontFamily: 'PlusJakartaSans-Medium',
                                fontSize: 12.5,
                                color: Colors.red,
                                marginTop: 6,
                                }}
                            >
                                Password must be at least 8 characters
                            </Text>
                        )
                    }
                </View>
                {/* Confirm password */}
                <View>
                    <Text style={labelStyle}>Confirm Password</Text>
                    <View style={{ position: 'relative' }}>
                        <OnboardingInput
                            label=""
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            placeholder="Re-enter your password"
                            secureTextEntry={!showConfirm}
                            autoCapitalize="none"
                        />
                        <Pressable
                            onPress={() => setShowConfirm(!showConfirm)}
                            style={{
                                position: 'absolute',
                                right: 16,
                                top: 0,
                                bottom: 0,
                                justifyContent: 'center',
                            }}
                        >
                        <Ionicons
                            name={showConfirm ? 'eye-off-outline' : 'eye-outline'}
                            size={20}
                            color={Colors.inkMuted}
                        />
                        </Pressable>
                    </View>
                    {
                        confirmPassword.length > 0 && !passwordsMatch && (
                        <Text style={{
                            fontFamily: 'PlusJakartaSans-Medium',
                            fontSize: 12.5,
                            color: Colors.red,
                            marginTop: 6,
                            }}
                        >
                            Passwords do not match
                        </Text>
                    )}
                </View>
            </View>
        </OnboardingLayout>
    )
}

const labelStyle = {
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: 13,
    color: Colors.inkBody,
    marginBottom: 8,
}

export default OnboardingAccountScreen