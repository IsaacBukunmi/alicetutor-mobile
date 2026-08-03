import { getQuiz, submitQuiz } from "@/api/course"
import ScreenLoader from "@/components/ScreenLoader"
import { Colors } from "@/constants"
import { useQuiz } from "@/hooks/useCourses"
import { QuizQuestion, QuizSubmitResult } from "@/types"
import { Ionicons } from "@expo/vector-icons"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useState } from "react"
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

// helpers
const LETTERS = ['A', 'B', 'C', 'D']

const getDifficultyStyle = (difficulty: string) => {
    switch(difficulty){
        case 'recall': return { bg: Colors.purpleSoft, color: Colors.purple, label: 'Recall' }
        case 'application': return { bg: Colors.amberSoft, color: Colors.amberText, label: 'Application' }
        case 'analysis': return { bg: Colors.blueSoft, color: Colors.blue, label: 'Analysis' }
        default: return { bg: Colors.divider, color: Colors.inkSecondary, label: difficulty }
    }
}

const getPerformanceMessage = (accuracy: number) => {
    if (accuracy >= 90) return 'Excellent work!'
    if (accuracy >= 70) return 'Great work!'
    if (accuracy >= 50) return 'Good effort!'
    return 'Keep practising!'
}

const getScoreColor = (accuracy: number) => {
    if (accuracy >= 70) return Colors.green
    if (accuracy >= 50) return Colors.amber
    return Colors.red
}

// subcomponents

function OptionRow({letter, text, state, onPress}:{letter: string; text: string; state: string; onPress:() => void}){
    const bgColor = {
        default: Colors.bgCard,
        selected: Colors.bgCard,
        correct: Colors.greenSoft,
        wrong: Colors.redSoft,
        disabled: Colors.bgCard
    }[state]

    const borderColor = {
        default: Colors.borderInput,
        selected: Colors.primary,
        correct: Colors.green,
        wrong: Colors.red,
        disabled: Colors.divider
    }

    const badgeBg = {
        default: Colors.bgBoard,
        selected: Colors.primary,
        correct: Colors.green,
        wrong: Colors.red,
        disabled: Colors.divider,
    }[state]

    const badgeColor = state === 'default' || state === 'disabled' ? Colors.inkSecondary : '#fff'

    const textColor = state === 'disabled' ? Colors.inkMuted : Colors.inkHeading

    return (
        <Pressable
            onPress={onPress}
            disabled={state === 'disabled' || state === 'correct' || state === 'wrong'}
            style={[styles.optionBtn, { backgroundColor: bgColor, borderColor: badgeColor }]}
        >
            <View
                style={[styles.letterCtn, { backgroundColor: badgeBg }]}
            >
                <Text style={{
                    fontFamily: 'PlusJakartaSans-Bold',
                    fontSize: 13,
                    color: badgeColor,
                }}>{letter}</Text>
            </View>
            <Text style={{
                fontFamily: 'PlusJakartaSans-Medium',
                fontSize: 14,
                color: textColor,
                flex: 1,
                lineHeight: 20,
            }}>
                {text}
            </Text>
            {
                state === 'correct' && (
                    <Ionicons name="checkmark-circle" size={20} color={Colors.green} />
                )
            }
            {
                state === 'wrong' && (
                    <Ionicons name="close-circle" size={20} color={Colors.red} />
                )
            }
        </Pressable>
    )
}

function ScoreCircle({ accuracy, color }: { accuracy: number, color: string }) {
    return (
        <View style={[styles.scoreCircleCtn, { borderColor: color,  shadowColor: color}]}>
            <Text style={{
                fontFamily: 'PlusJakartaSans-ExtraBold',
                fontSize: 28,
                color,
                letterSpacing: -0.5,
            }}>
                {accuracy}%
            </Text>
            <Text style={{
                    fontFamily: 'PlusJakartaSans-Bold',
                    fontSize: 10,
                    color: Colors.inkMuted,
                    letterSpacing: 0.6,
                    textTransform: 'uppercase',
                }}
            >
                SCORE
            </Text>
        </View>
    )
}

// main screen
export default function QuizScreen() {
    const { courseId } = useLocalSearchParams<{ courseId: string }>()
    const router = useRouter()
    const insets = useSafeAreaInsets()
    const queryClient = useQueryClient()

    // quiz data 
    const { data: quizData, isLoading } = useQuiz(courseId)

    // session state
    const [currentIndex, setCurrentIndex] = useState(0)
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
    const [revealed, setRevealed] = useState(false)
    const [answers, setAnswers] = useState<{ questionId: string; selectedAnswer: string }[]>([])
    const [result, setResult] = useState<QuizSubmitResult | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showExitConfirm, setShowExitConfirm] = useState(false)
    const [isOfflineResult, setIsOfflineResult] = useState(false)

    if(isLoading || !quizData) return <ScreenLoader />

    const questions: QuizQuestion[] = quizData.questions
    const currentQuestion = questions[currentIndex]
    const isLastQuestion = currentIndex === questions.length - 1
    const difficultyStyle = getDifficultyStyle(currentQuestion?.difficulty)
    const progress = (currentIndex + 1) / questions.length

    const handleSelectOption = (option: string) => {
        if(revealed) return
        setSelectedAnswer(option)
    }

    const handleConfirm = () => {
        if(!selectedAnswer) return
        setRevealed(true)
        setAnswers(prev => [...prev, {
            questionId: currentQuestion._id,
            selectedAnswer
        }])
    }

    // const handleNext = async () => {
    //     if (!isLastQuestion) {
    //       setCurrentIndex(prev => prev + 1)
    //       setSelectedAnswer(null)
    //       setRevealed(false)
    //       return
    //     }
      
    //     setIsSubmitting(true)
    //     try {
    //         // Include current answer since state may not have updated yet
    //         const currentAnswer = {
    //             questionId: currentQuestion._id,
    //             selectedAnswer: selectedAnswer!,
    //         }
    //         // Only append if not already in answers state
    //         const alreadyRecorded = answers.some(a => a.questionId === currentQuestion._id)
    //         const allAnswers = alreadyRecorded ? [...answers] : [...answers, currentAnswer]
      
    //         // Group by materialId
    //         const byMaterial: Record<string, typeof allAnswers> = {}
    //         allAnswers.forEach((answer) => {
    //             const question = questions.find(q => q._id === answer.questionId)
    //             if (!question) return
    //             const mid = question.materialId
    //             if (!byMaterial[mid]) byMaterial[mid] = []
    //             byMaterial[mid].push(answer)
    //         })
      
    //         const sessionId = `${courseId}_${Date.now()}`

    //         const results = await Promise.all(
    //             Object.entries(byMaterial).map(([materialId, materialAnswers]) =>
    //             submitQuiz(courseId, { materialId, answers: materialAnswers, sessionId })
    //             )
    //         )

        
    //         const merged: QuizSubmitResult = { ...results[0].data.result }
    //         results.slice(1).forEach(r => {
    //             const res = r.data.result
    //             merged.correctCount   += res.correctCount
    //             merged.totalQuestions += res.totalQuestions
    //             merged.answers.push(...res.answers)
    //             merged.difficultyBreakdown.recall.total        += res.difficultyBreakdown.recall.total
    //             merged.difficultyBreakdown.recall.correct      += res.difficultyBreakdown.recall.correct
    //             merged.difficultyBreakdown.application.total   += res.difficultyBreakdown.application.total
    //             merged.difficultyBreakdown.application.correct += res.difficultyBreakdown.application.correct
    //             merged.difficultyBreakdown.analysis.total      += res.difficultyBreakdown.analysis.total
    //             merged.difficultyBreakdown.analysis.correct    += res.difficultyBreakdown.analysis.correct
    //         })
    //         merged.accuracy = Math.round((merged.correctCount / merged.totalQuestions) * 100)
        
    //         queryClient.invalidateQueries({ queryKey: ['course-progress', courseId] })
    //         queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    //         setResult(merged)
    //     } catch {
    //         router.back()
    //     } finally {
    //         setIsSubmitting(false)
    //     }
    // }

    const handleNext = async () => {
        if (!isLastQuestion) {
          setCurrentIndex(prev => prev + 1)
          setSelectedAnswer(null)
          setRevealed(false)
          return
        }
      
        setIsSubmitting(true)
        try {
            // Include current answer since state may not have updated yet
            const currentAnswer = {
                questionId: currentQuestion._id,
                selectedAnswer: selectedAnswer!,
            }
        
            // Only append if not already in answers state
            const alreadyRecorded = answers.some(a => a.questionId === currentQuestion._id)
            const allAnswers = alreadyRecorded ? [...answers] : [...answers, currentAnswer]
        
            // Group by materialId
            const byMaterial: Record<string, typeof allAnswers> = {}
            allAnswers.forEach((answer) => {
                const question = questions.find(q => q._id === answer.questionId)
                if (!question) return
                const mid = question.materialId
                if (!byMaterial[mid]) byMaterial[mid] = []
                byMaterial[mid].push(answer)
            })
      
            const sessionId = `${courseId}_${Date.now()}`
        
            let allGraded: QuizSubmitResult['answers'] = []
      
            try {
                // Try submitting to server first
                const results = await Promise.all(
                Object.entries(byMaterial).map(([materialId, materialAnswers]) =>
                    submitQuiz(courseId, { materialId, answers: materialAnswers, sessionId })
                )
                )
                // Flatten graded answers from all material submissions
                allGraded = results.flatMap(r => r.data.result.answers)
            } catch {
                // Offline — grade locally using questions already in memory
                console.log('Offline — grading locally')
                setIsOfflineResult(true)
                allGraded = allAnswers.map((answer) => {
                    const question = questions.find(q => q._id === answer.questionId)!
                    const isCorrect = answer.selectedAnswer === question.correctAnswer
                    return {
                        questionId: answer.questionId,
                        selectedAnswer: answer.selectedAnswer,
                        correctAnswer: question.correctAnswer,
                        isCorrect,
                        difficulty: question.difficulty,
                        _id: `local_${answer.questionId}`,
                    }
                })
            }
      
            // Build result from flat graded answers — same logic regardless of online/offline
            const correctCount = allGraded.filter(a => a.isCorrect).length
            const totalQuestions = allGraded.length
            const accuracy = Math.round((correctCount / totalQuestions) * 100)
        
            // Recalculate difficulty breakdown from allGraded directly
            const difficultyBreakdown = {
                recall:      { total: 0, correct: 0 },
                application: { total: 0, correct: 0 },
                analysis:    { total: 0, correct: 0 },
            }
            allGraded.forEach(a => {
                difficultyBreakdown[a.difficulty].total++
                if (a.isCorrect) difficultyBreakdown[a.difficulty].correct++
            })
        
            const merged: QuizSubmitResult = {
                student: '',
                course: courseId,
                material: '',
                answers: allGraded,
                correctCount,
                totalQuestions,
                accuracy,
                difficultyBreakdown,
                _id: `result_${Date.now()}`,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }
      
          queryClient.invalidateQueries({ queryKey: ['course-progress', courseId] })
          queryClient.invalidateQueries({ queryKey: ['dashboard'] })
          setResult(merged)
        } catch {
          // Catastrophic failure — go back
          router.back()
        } finally {
          setIsSubmitting(false)
        }
      }

    const handleRetry = () => {
        setCurrentIndex(0)
        setSelectedAnswer(null)
        setRevealed(false)
        setAnswers([])
        setResult(null)
        queryClient.invalidateQueries({ queryKey: ['quiz', courseId] })
    }

    const getOptionState = (option: string) => {
        if (!revealed) {
            return option === selectedAnswer ? 'selected' : 'default'
        }
        if (option === currentQuestion.correctAnswer) return 'correct'
        if (option === selectedAnswer && option !== currentQuestion.correctAnswer) return 'wrong'
        return 'disabled'
    }

    // Results screen
    if (result) {
        const scoreColor = getScoreColor(result.accuracy)
        const incorrectAnswers = result.answers.filter(a => !a.isCorrect)

        return (
            <View style={{ flex: 1, backgroundColor: Colors.bgApp }}>
                <ScrollView
                    contentContainerStyle={{ paddingBottom: 32 }}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={{
                        paddingHorizontal: 20,
                        paddingTop: insets.top + 20,
                    }}>

                        {/* Score circle */}
                        <View style={{ alignItems: 'center', marginBottom: 8 }}>
                        <ScoreCircle accuracy={result.accuracy} color={scoreColor} />
                        <Text style={{
                            fontFamily: 'PlusJakartaSans-ExtraBold',
                            fontSize: 24,
                            color: Colors.inkHeading,
                            marginBottom: 6,
                        }}>
                            {getPerformanceMessage(result.accuracy)}
                        </Text>
                        {
                            isOfflineResult && (
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 6,
                                backgroundColor: Colors.amberSoft,
                                borderRadius: 10,
                                paddingHorizontal: 12,
                                paddingVertical: 8,
                                marginTop: 8,
                            }}>
                                <Ionicons name="cloud-offline-outline" size={14} color={Colors.amberText} />
                                <Text style={{
                                    fontFamily: 'PlusJakartaSans-Medium',
                                    fontSize: 12.5,
                                    color: Colors.amberText,
                                }}>
                                    Graded offline — result not saved to your history
                                </Text>
                            </View>
                        )}
                        <Text style={{
                            fontFamily: 'PlusJakartaSans-Medium',
                            fontSize: 14,
                            color: Colors.inkSecondary,
                        }}>
                            {result.correctCount} of {result.totalQuestions} correct · You're on track for this topic.
                        </Text>
                        </View>

                        {/* Difficulty breakdown */}
                        <View style={{
                            flexDirection: 'row',
                            gap: 10,
                            backgroundColor: Colors.bgCard,
                            borderRadius: 16,
                            padding: 16,
                            marginBottom: 24,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.04,
                            shadowRadius: 8,
                            elevation: 2,
                        }}>
                            {[
                                { label: 'Recall', data: result.difficultyBreakdown.recall },
                                { label: 'Apply', data: result.difficultyBreakdown.application },
                                { label: 'Analyse', data: result.difficultyBreakdown.analysis },
                            ].map(({ label, data }) => (
                                <View key={label} style={{ flex: 1, alignItems: 'center' }}>
                                    <Text style={{
                                        fontFamily: 'PlusJakartaSans-ExtraBold',
                                        fontSize: 18,
                                        color: Colors.inkHeading,
                                        marginBottom: 2,
                                    }}>
                                        {data.correct}/{data.total}
                                    </Text>
                                    <Text style={{
                                        fontFamily: 'PlusJakartaSans-Medium',
                                        fontSize: 12,
                                        color: Colors.inkSecondary,
                                    }}>
                                        {label}
                                    </Text>
                                </View>
                            ))}
                        </View>

                        {/* Review incorrect */}
                        {
                            incorrectAnswers.length > 0 && (
                                <View style={{ marginBottom: 24 }}>
                                    <Text style={{
                                    fontFamily: 'PlusJakartaSans-ExtraBold',
                                    fontSize: 17,
                                    color: Colors.inkHeading,
                                    marginBottom: 12,
                                    }}>
                                    Review incorrect
                                    </Text>
                                    <View style={{ gap: 10 }}>
                                    {incorrectAnswers.map((answer) => {
                                        const question = questions.find(q => q._id === answer.questionId)
                                        return (
                                        <View
                                            key={answer._id}
                                            style={{
                                            backgroundColor: Colors.bgCard,
                                            borderRadius: 14,
                                            padding: 14,
                                            shadowColor: '#000',
                                            shadowOffset: { width: 0, height: 2 },
                                            shadowOpacity: 0.04,
                                            shadowRadius: 8,
                                            elevation: 2,
                                            }}
                                        >
                                            <Text style={{
                                            fontFamily: 'PlusJakartaSans-SemiBold',
                                            fontSize: 13,
                                            color: Colors.inkHeading,
                                            marginBottom: 8,
                                            lineHeight: 19,
                                            }}>
                                            {question?.question}
                                            </Text>
                                            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 6, marginBottom: 4 }}>
                                            <Ionicons name="close" size={14} color={Colors.red} style={{ marginTop: 2 }} />
                                            <Text style={{
                                                fontFamily: 'PlusJakartaSans-Medium',
                                                fontSize: 13,
                                                color: Colors.red,
                                                flex: 1,
                                            }}>
                                                Your answer: <Text style={{ fontFamily: 'PlusJakartaSans-Bold' }}>{answer.selectedAnswer}</Text>
                                            </Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 6 }}>
                                            <Ionicons name="checkmark" size={14} color={Colors.green} style={{ marginTop: 2 }} />
                                            <Text style={{
                                                fontFamily: 'PlusJakartaSans-Medium',
                                                fontSize: 13,
                                                color: Colors.green,
                                                flex: 1,
                                            }}>
                                                Correct: <Text style={{ fontFamily: 'PlusJakartaSans-Bold' }}>{answer.correctAnswer}</Text>
                                            </Text>
                                            </View>
                                        </View>
                                        )
                                    })}
                                    </View>
                                </View>
                            )
                        }
                    </View>
                </ScrollView>

                {/* Bottom buttons */}
                <View style={{
                    flexDirection: 'row',
                    gap: 12,
                    paddingHorizontal: 20,
                    paddingBottom: insets.bottom + 16,
                    paddingTop: 12,
                    backgroundColor: Colors.bgApp,
                    borderTopWidth: 1,
                    borderTopColor: Colors.divider,
                }}>
                    <Pressable
                        onPress={handleRetry}
                        style={{
                            flex: 1,
                            paddingVertical: 15,
                            borderRadius: 14,
                            alignItems: 'center',
                            backgroundColor: Colors.bgCard,
                            borderWidth: 1,
                            borderColor: Colors.borderInput,
                        }}
                    >
                        <Text style={{
                        fontFamily: 'PlusJakartaSans-Bold',
                        fontSize: 15,
                        color: Colors.primary,
                        }}>
                        Retry
                        </Text>
                    </Pressable>
                    <Pressable
                        onPress={() => router.back()}
                        style={{
                            flex: 1,
                            paddingVertical: 15,
                            borderRadius: 14,
                            alignItems: 'center',
                            backgroundColor: Colors.primary,
                            shadowColor: Colors.primary,
                            shadowOffset: { width: 0, height: 6 },
                            shadowOpacity: 0.28,
                            shadowRadius: 12,
                            elevation: 6,
                        }}
                    >
                        <Text style={{
                        fontFamily: 'PlusJakartaSans-Bold',
                        fontSize: 15,
                        color: '#fff',
                        }}>
                        Done
                        </Text>
                    </Pressable>
                </View>
            </View>
        )
    }

     // ── Question screen ─────────────────────────────────────────────────────────
  return (
        <View style={{ flex: 1, backgroundColor: Colors.bgApp }}>

        {/* Exit confirm modal */}
        <Modal
            visible={showExitConfirm}
            transparent
            animationType="fade"
            onRequestClose={() => setShowExitConfirm(false)}
        >
            <View style={{
                flex: 1,
                backgroundColor: 'rgba(0,0,0,0.4)',
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 32,
            }}>
            <View style={{
                backgroundColor: Colors.bgCard,
                borderRadius: 20,
                padding: 24,
                width: '100%',
            }}>
                <Text style={{
                    fontFamily: 'PlusJakartaSans-ExtraBold',
                    fontSize: 17,
                    color: Colors.inkHeading,
                    marginBottom: 8,
                    textAlign: 'center',
                }}>
                    Exit quiz?
                </Text>
                <Text style={{
                    fontFamily: 'PlusJakartaSans-Medium',
                    fontSize: 14,
                    color: Colors.inkSecondary,
                    textAlign: 'center',
                    marginBottom: 20,
                    lineHeight: 21,
                }}>
                    Your progress will be lost. Are you sure you want to exit?
                </Text>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                <Pressable
                    onPress={() => setShowExitConfirm(false)}
                    style={{
                    flex: 1,
                    paddingVertical: 13,
                    borderRadius: 12,
                    alignItems: 'center',
                    backgroundColor: Colors.bgBoard,
                    }}
                >
                    <Text style={{
                        fontFamily: 'PlusJakartaSans-Bold',
                        fontSize: 14,
                        color: Colors.inkHeading,
                        }}
                    >
                        Continue
                    </Text>
                </Pressable>
                <Pressable
                    onPress={() => router.back()}
                    style={{
                        flex: 1,
                        paddingVertical: 13,
                        borderRadius: 12,
                        alignItems: 'center',
                        backgroundColor: Colors.red,
                    }}
                >
                    <Text style={{
                        fontFamily: 'PlusJakartaSans-Bold',
                        fontSize: 14,
                        color: '#fff',
                    }}>
                    Exit
                    </Text>
                </Pressable>
                </View>
            </View>
            </View>
        </Modal>

        <View style={{
            paddingHorizontal: 20,
            paddingTop: insets.top + 12,
            flex: 1,
        }}>

            {/* Header */}
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 16,
            }}>
            <Pressable
                onPress={() => setShowExitConfirm(true)}
                style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: Colors.bgCard,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 6,
                elevation: 2,
                }}
            >
                <Ionicons name="close" size={18} color={Colors.inkHeading} />
            </Pressable>
            <Text style={{
                fontFamily: 'PlusJakartaSans-Bold',
                fontSize: 15,
                color: Colors.inkHeading,
                flex: 1,
            }}>
                Quiz · {quizData.courseId ? 'Course' : 'Quiz'}
            </Text>
            </View>

            {/* Progress row */}
            <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 8,
            }}>
            <Text style={{
                fontFamily: 'PlusJakartaSans-Medium',
                fontSize: 13,
                color: Colors.inkSecondary,
            }}>
                Question {currentIndex + 1} of {questions.length}
            </Text>
            <View style={{
                backgroundColor: difficultyStyle.bg,
                borderRadius: 999,
                paddingHorizontal: 10,
                paddingVertical: 4,
            }}>
                <Text style={{
                fontFamily: 'PlusJakartaSans-Bold',
                fontSize: 12,
                color: difficultyStyle.color,
                }}>
                {difficultyStyle.label}
                </Text>
            </View>
            </View>

            {/* Progress bar */}
            <View style={{
            height: 4,
            borderRadius: 999,
            backgroundColor: Colors.divider,
            marginBottom: 20,
            }}>
            <View style={{
                width: `${progress * 100}%`,
                height: 4,
                borderRadius: 999,
                backgroundColor: Colors.primary,
            }} />
            </View>

            {/* Question card */}
            <View style={{
            backgroundColor: Colors.bgCard,
            borderRadius: 16,
            padding: 18,
            marginBottom: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.04,
            shadowRadius: 8,
            elevation: 2,
            }}>
            <Text style={{
                fontFamily: 'PlusJakartaSans-Bold',
                fontSize: 16,
                color: Colors.inkHeading,
                lineHeight: 24,
            }}>
                {currentQuestion.question}
            </Text>
            </View>

            {/* Options */}
            <ScrollView showsVerticalScrollIndicator={false}>
            {currentQuestion.options.map((option, index) => (
                <OptionRow
                key={option}
                letter={LETTERS[index]}
                text={option}
                state={getOptionState(option)}
                onPress={() => handleSelectOption(option)}
                />
            ))}
            </ScrollView>
        </View>

        {/* Bottom button */}
        <View style={{
            paddingHorizontal: 20,
            paddingBottom: insets.bottom + 16,
            paddingTop: 12,
            borderTopWidth: 1,
            borderTopColor: Colors.divider,
            backgroundColor: Colors.bgApp,
        }}>
            <Pressable
            onPress={revealed ? handleNext : handleConfirm}
            disabled={!selectedAnswer && !revealed || isSubmitting}
            style={{
                backgroundColor: revealed || selectedAnswer ? Colors.primary : Colors.divider,
                borderRadius: 14,
                paddingVertical: 16,
                alignItems: 'center',
                shadowColor: revealed || selectedAnswer ? Colors.primary : 'transparent',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: revealed || selectedAnswer ? 0.28 : 0,
                shadowRadius: 16,
                elevation: revealed || selectedAnswer ? 6 : 0,
            }}
            >
            <Text style={{
                fontFamily: 'PlusJakartaSans-Bold',
                fontSize: 15,
                color: revealed || selectedAnswer ? '#fff' : Colors.inkMuted,
            }}>
                {isSubmitting
                ? 'Submitting...'
                : revealed
                    ? isLastQuestion ? 'See results' : 'Next question'
                    : 'Confirm answer'}
            </Text>
            </Pressable>
        </View>
        </View>
        )
    
}


const styles = StyleSheet.create({
    optionBtn:{
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderRadius: 12,
        padding: 14,
        gap: 12,
        marginBottom: 10,
    },
    letterCtn:{
        width: 28,
        height: 28,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scoreCircleCtn:{
        width: 120,
        height: 120,
        borderRadius: 999,
        borderWidth: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 4,
    }
})