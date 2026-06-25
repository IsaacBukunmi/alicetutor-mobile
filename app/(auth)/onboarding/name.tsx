import OnboardingInput from '@/components/OnboardingInput'
import OnboardingLayout from '@/components/OnboardingLayout'
import { useOnboardingStore } from '@/stores/onboardingStore'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { View } from 'react-native'

export default function OnboardingNameScreen() {
    const router = useRouter()
    const { onboardingData, setOnboardingData } = useOnboardingStore()

    const [firstName, setFirstName] = useState(onboardingData.firstName ?? '')
    const [lastName, setLastName] = useState(onboardingData.lastName ?? '')

    const canContinue = firstName.trim().length > 0 && lastName.trim().length > 0

    const handleContinue = () => {
        setOnboardingData({ firstName: firstName.trim(), lastName: lastName.trim() })
        router.push('/(auth)/onboarding/academics')
    }

    return (
        <OnboardingLayout
            step={1}
            title="What's your name?"
            subtitle='Alice will use this to personlize your experience'
            canContinue={canContinue}
            onContinue={handleContinue}
        >
            {/* Inputs */}
            <View style={{ gap: 16 }}>
                <View>
                    <OnboardingInput
                        label="First Name"
                        value={firstName}
                        onChangeText={setFirstName}
                        placeholder="e.g. Isaac"
                        autoCapitalize="words"
                        autoFocus
                    />
                </View>
                <View>
                    <OnboardingInput
                        label="Last Name"
                        value={lastName}
                        onChangeText={setLastName}
                        placeholder="e.g. Adewale"
                        autoCapitalize="words"
                    />
                </View>
            </View>
        </OnboardingLayout>  
    )
}