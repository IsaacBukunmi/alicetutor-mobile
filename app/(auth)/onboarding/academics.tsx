import OnboardingInput from '@/components/OnboardingInput'
import OnboardingLayout from '@/components/OnboardingLayout'
import { Colors } from '@/constants'
import { useOnboardingStore } from '@/stores/onboardingStore'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Pressable, Text, View } from 'react-native'

const PROGRAMS = ['Undergraduate', 'Postgraduate']
const LEVELS = {
   undergraduate: ['100', '200', '300', '400', '500'],
   postgraduate: ['Masters', 'PhD']
}

export default function OnboardingAcademicScreen() {
    const router = useRouter()
    const { onboardingData, setOnboardingData } = useOnboardingStore()

    const [university, setUniversity] = useState(onboardingData.university ?? "")
    const [courseOfStudy, setCourseOfStudy] = useState(onboardingData?.courseOfStudy ?? "")
    const [program, setProgram] = useState(onboardingData.program ?? '')
    const [level, setLevel] = useState(onboardingData.level ?? '')

    const canContinue = 
        university.trim().length > 1 &&
        courseOfStudy.trim().length > 0 &&
        program.length > 0 &&
        level.length > 0

    const handleContinue = () => {
        setOnboardingData({
            university: university.trim(),
            courseOfStudy: courseOfStudy.trim(),
            program,
            level
        })
        router.push('/(auth)/onboarding/account')
    }

    return (
        <OnboardingLayout
            step={2}
            title="Where do you study?"
            subtitle=""
            canContinue={canContinue}
            onContinue={handleContinue}
        >
            <View style={{gap:20}}>
                {/* University */}
                <OnboardingInput 
                    label="University"
                    value={university}
                    onChangeText={setUniversity}
                    placeholder="e.g University of Lagos"
                    autoFocus
                />

                {/* Course of Study */}
                <OnboardingInput
                    label="Course of study"
                    value={courseOfStudy}
                    onChangeText={setCourseOfStudy}
                    placeholder="e.g. Computer Science"
                    autoCapitalize="words"
                />

                {/* Program toggle */}
                <View>
                    <Text style={labelStyle}>Program</Text>
                    <View style={{ flexDirection: 'row', gap: 10 }}>
                        {
                            PROGRAMS.map((p) => {
                            const selected = program === p
                            return (
                                <Pressable
                                    key={p}
                                    onPress={() => setProgram(p)}
                                    style={{
                                        flex: 1,
                                        paddingVertical: 14,
                                        borderRadius: 12,
                                        alignItems: 'center',
                                        backgroundColor: selected ? Colors.primary : Colors.bgCard,
                                        borderWidth: selected ? 0 : 1,
                                        borderColor: Colors.borderInput,
                                        shadowColor: selected ? Colors.primary : '#000',
                                        shadowOffset: { width: 0, height: selected ? 6 : 2 },
                                        shadowOpacity: selected ? 0.22 : 0.04,
                                        shadowRadius: selected ? 12 : 6,
                                        elevation: selected ? 6 : 1,
                                    }}
                                >
                                    <Text 
                                        style={{
                                            fontFamily: 'PlusJakartaSans-Bold',
                                            fontSize: 14,
                                            color: selected ? '#fff' : Colors.inkSecondary,
                                        }}
                                    >
                                        {p}
                                    </Text>
                                </Pressable>
                            )
                            })
                        }
                    </View>
                </View>
                 {/* Level chips */}
                {
                    program &&
                    <View>
                    <Text style={labelStyle}>Level</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                        {
                            LEVELS[program.toLowerCase() === 'undergraduate' ? 'undergraduate' : 'postgraduate'].map((l) => {
                            const selected = level === l
                            return (
                                <Pressable
                                key={l}
                                onPress={() => setLevel(l)}
                                style={{
                                    paddingVertical: 12,
                                    paddingHorizontal: 20,
                                    borderRadius: 12,
                                    backgroundColor: selected ? Colors.primary : Colors.bgCard,
                                    borderWidth: selected ? 0 : 1,
                                    borderColor: Colors.borderInput,
                                    shadowColor: selected ? Colors.primary : '#000',
                                    shadowOffset: { width: 0, height: selected ? 6 : 2 },
                                    shadowOpacity: selected ? 0.22 : 0.04,
                                    shadowRadius: selected ? 12 : 6,
                                    elevation: selected ? 6 : 1,
                                }}
                                >
                                <Text style={{
                                    fontFamily: 'PlusJakartaSans-Bold',
                                    fontSize: 14,
                                    color: selected ? '#fff' : Colors.inkSecondary,
                                }}>
                                    {l}
                                </Text>
                                </Pressable>
                            )
                            })
                        }
                    </View>
                    </View>
                }
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

