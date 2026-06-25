import { register } from '@/api/auth'
import { createRegistrationCourse } from '@/api/course'
import OnboardingInput from '@/components/OnboardingInput'
import OnboardingLayout from '@/components/OnboardingLayout'
import { Colors } from '@/constants'
import { useOnboardingStore } from '@/stores/onboardingStore'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { View, Text } from 'react-native'

const OnboardingCourseScreen = () => {
    const router = useRouter()
    const { onboardingData, setPending } = useOnboardingStore()

    const [ courseName, setCourseName ] = useState(onboardingData.courseName ?? "")
    const [ courseCode, setCourseCode ] = useState(onboardingData?.courseCode ?? "")
    const [ courseUnit, setCourseUnit ] = useState(onboardingData.courseUnit ?? "")
    const [ courseLecturer, setCourseLecturer ] = useState(onboardingData?.courseLecturer)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const canContinue = courseName.trim().length > 0 && courseCode.trim().length > 0 && courseUnit.trim().length > 0

    const handleFinish = async () => {
        setIsLoading(true)
        setError('')
        try {
            const response = await register({
                firstName: onboardingData.firstName!,
                lastName: onboardingData.lastName!,
                email: onboardingData.email!,
                password: onboardingData.password!,
                university: onboardingData.university!,
                program: onboardingData.program?.toLowerCase()!,
                level: onboardingData.level?.toLowerCase()!,
                courseOfStudy: onboardingData.courseOfStudy!,
            })
            if(courseName && courseCode && courseUnit){
                await createRegistrationCourse({
                    courseName,
                    courseCode,
                    courseUnit: Number(courseUnit.trim())
                }, response.data.token)
            }
            setPending(response.data.student, response.data.token)
            router.replace('/(auth)/success')
        } catch (error: any) {
            setError(error.response?.data?.message ?? "Something went wrong. Please try again.")
        } finally{
            setIsLoading(false)
        }
    }

    const handleSkip = async () => {
        setIsLoading(true)
        setError('')
        try {
            const response = await register({
                firstName: onboardingData.firstName!,
                lastName: onboardingData.lastName!,
                email: onboardingData.email!,
                password: onboardingData.password!,
                university: onboardingData.university!,
                program: onboardingData.program!,
                level: onboardingData.level!,
                courseOfStudy: onboardingData.courseOfStudy!,
            })
            setPending(response.data.student, response.data.token)
            router.replace('/(auth)/success')
        } catch (error: any) {
            setError(error.response?.data?.message ?? "Something went wrong. Please try again.")
        } finally{
            setIsLoading(false)
        }
    }


    return (
        <OnboardingLayout
            step={4}
            title='Add your first course'
            subtitle=''
            canContinue={canContinue}
            onContinue={handleFinish}
            isSubmittingForm={isLoading}
            onSkip={handleSkip}
        >
            <View style={{ gap: 20 }}>
                <OnboardingInput 
                    label="Course name"
                    value={courseName}
                    onChangeText={setCourseName}
                    placeholder="Data Structures & Algorithms"
                    autoCapitalize='words'
                />
                <View style={{
                    flexDirection:'row',
                    gap:12
                }}>
                    <View style={{flex: 1.2}}>
                        <OnboardingInput 
                            label="Course code"
                            value={courseCode}
                            onChangeText={setCourseCode}
                            placeholder="CSC301"
                            autoCapitalize='characters'
                        />
                    </View>
                    <View  style={{flex: 0.8}}>  
                        <OnboardingInput 
                            label="Units"
                            value={courseUnit}
                            onChangeText={setCourseUnit}
                            placeholder="3"
                            keyboardType='numeric'
                        />
                    </View>
                </View>
                <View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                        <Text style={{
                            fontFamily: 'PlusJakartaSans-SemiBold',
                            fontSize: 13,
                            color: Colors.inkBody,
                        }}>
                            Lecturer
                        </Text>
                        <Text style={{
                            fontFamily: 'PlusJakartaSans-Medium',
                            fontSize: 13,
                            color: Colors.inkMuted,
                            }}
                        >
                        (optional)
                        </Text>
                    </View>
                    <OnboardingInput 
                        label=""
                        value={courseLecturer}
                        onChangeText={setCourseLecturer}
                        placeholder="Dr. A. Okafor"
                        autoCapitalize='words'
                    />
                </View>
                {error.length > 0 && (
                    <Text style={{
                        fontFamily: 'PlusJakartaSans-Medium',
                        fontSize: 13,
                        color: Colors.red,
                        textAlign: 'center',
                    }}>
                        {error}
                    </Text>
                )}
            </View>
        </OnboardingLayout>
    )
}

export default OnboardingCourseScreen