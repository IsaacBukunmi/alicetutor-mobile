import { View, Text, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Colors } from '@/constants'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import LoadingSpinner from './LoadingSpinner'

type Props = {
  step: number
  totalSteps?: number
  title: string
  subtitle: string
  canContinue: boolean
  onContinue: () => void
  isSubmittingForm?:boolean
  onSkip?:() => void
  children: React.ReactNode
}

export default function OnboardingLayout({
  step,
  totalSteps = 4,
  title,
  subtitle,
  canContinue,
  onContinue,
  isSubmittingForm,
  onSkip,
  children,
}: Props) {
    const insets = useSafeAreaInsets()
    const router = useRouter()

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: Colors.bgApp }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
        <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
        >
            <View style={{
                flex: 1,
                paddingHorizontal: 24,
                paddingTop: insets.top + 24,
                paddingBottom: insets.bottom + 24,
            }}>
 
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 35 }}>
                { 
                    // step !== 1 &&
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
                }
                {/* Progress bar */}
                <View style={{ flexDirection: 'row', gap: 6, flex: 1}}>
                    {
                        Array.from({ length: totalSteps }).map((_, i) => (
                        <View
                            key={i}
                            style={{
                                flex: 1,
                                height: 5,
                                borderRadius: 999,
                                backgroundColor: i < step ? Colors.primary : Colors.divider,
                            }}
                        />
                        ))
                    }
                </View>
            </View>
           
            {/* Header */}
            <View style={{ marginBottom: 25 }}>
                <View style={{
                            flexDirection: 'row', justifyContent:'space-between',
                            marginBottom: 6
                        }}
                    >
                    <Text style={{
                        fontFamily: 'PlusJakartaSans-Bold',
                        fontSize: 12.5,
                        color: Colors.inkMuted,
                        letterSpacing: 0.6,
                        textTransform: 'uppercase',
                    }}>
                        {`STEP ${step} OF ${totalSteps}`}
                    </Text>
                   { 
                        step === totalSteps &&
                        <Pressable
                            onPress={onSkip}
                            disabled={isSubmittingForm}
                        >
                            <View style={{flexDirection: 'row', gap:10}}>
                                {
                                    isSubmittingForm &&
                                    <LoadingSpinner color={Colors.primary} size="small" />
                                }
                                <Text 
                                    style={{
                                        fontFamily: 'PlusJakartaSans-Bold',
                                        fontSize: 12.5,
                                        color: Colors.primary,
                                    }}
                                >
                                    Skip for now
                                </Text>
                            </View>
                        </Pressable>
                    }
                </View>
                <Text style={{
                    fontFamily: 'PlusJakartaSans-ExtraBold',
                    fontSize: 26,
                    color: Colors.inkHeading,
                    letterSpacing: -0.4,
                    marginBottom: 6,
                }}>
                    {title}
                </Text>
                {
                    subtitle !== "" &&
                    <Text style={{
                        fontFamily: 'PlusJakartaSans-Medium',
                        fontSize: 15,
                        color: Colors.inkSecondary,
                        lineHeight: 22,
                    }}>
                        {subtitle}
                    </Text>
                }
            </View>

            {/* Screen-specific content */}
            {children}

            {/* Spacer */}
            <View style={{ flex: 1 }} />

            {/* Continue button */}
            <Pressable
                onPress={onContinue}
                disabled={!canContinue || isSubmittingForm}
                style={{
                backgroundColor: canContinue ? Colors.primary : Colors.divider,
                borderRadius: 14,
                paddingVertical: 16,
                alignItems: 'center',
                shadowColor: canContinue ? Colors.primary : 'transparent',
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: canContinue ? 0.28 : 0,
                shadowRadius: 22,
                elevation: canContinue ? 8 : 0,
                }}
            >
                <View style={{flexDirection: 'row', gap:10}}>
                    {
                        isSubmittingForm &&
                        <LoadingSpinner color="#fff" size="small" />
                    }
                    <Text 
                        style={{
                            fontFamily: 'PlusJakartaSans-Bold',
                            fontSize: 15,
                            color: canContinue ? '#fff' : Colors.inkMuted,
                        }}
                    >
                        {step === totalSteps ? "Finish Setup" : "Continue"}
                    </Text>
                </View>
            </Pressable>

            </View>
        </ScrollView>
        </KeyboardAvoidingView>
    )
}