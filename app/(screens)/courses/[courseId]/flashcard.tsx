import ScreenLoader from '@/components/ScreenLoader';
import { Colors } from '@/constants';
import { useCourseMaterials } from '@/hooks/useCourses';
import { Flashcard } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { View, Text, Pressable, Dimensions, StyleSheet } from 'react-native'
import Animated, { Extrapolation, interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window')
const CARD_HEIGHT = height * 0.65

// helpers
const shuffleArray = <T,>(arr: T[]): T[] => {
    const copy = [...arr]
    for(let i = copy.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1))
        ;[copy[i], copy[j]] = [copy[j], copy[i]]
    }
    return copy
}

// flashcard component
function FlashCard({
    card,
    isFlipped,
    onFlip
}:{
    card: Flashcard
    isFlipped: boolean
    onFlip: () => void
}){
    const rotation =  useSharedValue(0)

    // trigger animation when isFlipped changes
    if(isFlipped){
        rotation.value = withTiming(1, { duration: 400 })
    }else{
        rotation.value = withTiming(0, { duration: 400 } )
    }

    const frontAnimatedStyle = useAnimatedStyle(() => {
        const rotateY = interpolate(
            rotation.value,
            [0, 1],
            [0, 180],
            Extrapolation.CLAMP
        )
        return {
            transform: [{ rotateY: `${rotateY}deg` }],
            backfaceVisibility: 'hidden'
        }
    })

    const backAnimatedStyle = useAnimatedStyle(() => {
        const rotateY = interpolate(
          rotation.value,
          [0, 1],
          [180, 360],
          Extrapolation.CLAMP
        )
        return {
          transform: [{ rotateY: `${rotateY}deg` }],
          backfaceVisibility: 'hidden',
        }
    })

    return(
        <Pressable onPress={onFlip} style={{ height: CARD_HEIGHT }}>
            {/* Front Card */}
            <Animated.View 
                style={[styles.frontCard, frontAnimatedStyle]}
            >
                <Text style={styles.termTitle}>TERM</Text>
                <Text style={styles.termText}>{card.front}</Text>
                <Text style={styles.termSubText}>tap to reveal definition</Text>
            </Animated.View>

            {/* Back Card */}
            <Animated.View
                style={[styles.backCard, backAnimatedStyle]}
            >
                <Text style={styles.definitionTitle}>DEFINITION</Text>
                <Text style={styles.definitionText}>{card.back}</Text>
            </Animated.View>
        </Pressable>
    )
    
}

// main screen
const FlashcardScreen = () => {
    const { courseId, materialId } = useLocalSearchParams<{courseId: string; materialId?: string}>()
    const router = useRouter()
    const insets = useSafeAreaInsets()

    const { data: materials, isLoading } = useCourseMaterials(courseId)

    const [currentIndex, setCurrentIndex] = useState(0)
    const [isFlipped, setIsFlipped] = useState(false)
    const [isFinished, setIsFinished] = useState(false)

    const CARDS_PER_SESSION = 10

    // flatten and shuffle all flashcards from all materials
    const allCards: Flashcard[] = materials ? shuffleArray<Flashcard>(materialId ? materials.filter((m:any) => m._id === materialId).flatMap((m:any) => m.flashcards ?? []) : materials.flatMap((m: any) => m.flashcards ?? [])).slice(0, CARDS_PER_SESSION) : []

    const currentCard = allCards[currentIndex]
    const progress = allCards.length > 0 ? (currentIndex + 1) / allCards.length : 0

    const handleFlip = useCallback(() => {
        setIsFlipped(prev => !prev)
    }, [])

    const handleNext = useCallback(() => {
        if(currentIndex >= allCards.length - 1){
            setIsFinished(true)
            return
        }
        setIsFlipped(false)
        // small delay before advancing so the flip-back animation plays
        setTimeout(() => {
            setCurrentIndex(prev => prev +1)
        }, 200)
    }, [currentIndex, allCards.length])

    const handleBack = useCallback(() => {
        if (currentIndex === 0) return
        setIsFlipped(false)
        setTimeout(() => {
          setCurrentIndex(prev => prev - 1)
        }, 200)
    }, [currentIndex])

    const handleRestart = useCallback(() => {
        setCurrentIndex(0)
        setIsFlipped(false)
        setIsFinished(false)
    }, [])

    if(isLoading) return <ScreenLoader />

    if (allCards.length === 0){
        return(
            <View style={styles.emptyCtn}>
                <Ionicons name="albums-outline" size={48} color={Colors.inkMuted} />
                <Text style={styles.emptyText}>No flashcards yet</Text>
                <Text style={styles.uploadText}>Upload and process materials to generate flashcards.</Text>
                <Pressable
                    onPress={() => router.back()}
                    style={styles.goBackBtn}
                >
                    <Text style={styles.goBackText}>
                        Go back
                    </Text>
                </Pressable>
            </View>
        )
    }

    // finished screen
    if(isFinished){
        return(
            <View style={styles.finishedCtn}>
                <View style={styles.iconCtn}>
                    <Ionicons name="checkmark" size={40} color={Colors.green} />
                </View>
                <Text style={styles.completeText}>
                    Deck complete!
                </Text>
                <Text style={styles.completeSubText}>
                    You've gone through all {allCards.length} cards. Want to go again?
                </Text>
                <View style={{ width: '100%', gap: 12 }}>
                <Pressable
                    onPress={handleRestart}
                    style={styles.studyAgainBtn}
                >
                    <Text style={styles.studyAgainText}>Study again</Text>
                </Pressable>
                <Pressable
                    onPress={() => router.back()}
                    style={styles.backCourseBtn}
                >
                    <Text style={styles.backCourseText}>Back to course</Text>
                </Pressable>
                </View>
            </View>
        )
    }

    return (
        <View style={{ flex: 1, backgroundColor: Colors.bgApp }}>
            <View style={{
                paddingHorizontal: 24,
                paddingTop: insets.top + 12,
                flex: 1
            }}>
                {/* Header */}
                <View style={styles.headerCtn}>
                    <Pressable
                        onPress={() => router.back()}
                        style={styles.headerCloseBtn}
                    >
                        <Ionicons name="close" size={18} color={Colors.inkHeading} />
                    </Pressable>

                    {/* Progress bar */}
                    <View style={styles.progressBarCtn}>
                        <View style={{
                        width: `${progress * 100}%`,
                        height: 6,
                        borderRadius: 999,
                        backgroundColor: Colors.purple,
                        }} />
                    </View>
                </View>

                {/* Subtitle */}
                <Text style={styles.headerSubtitle}>
                    Card {currentIndex + 1} of {allCards.length} · tap to flip
                </Text>

                {/* Card */}
                {currentCard && (
                    <FlashCard
                        key={currentIndex}
                        card={currentCard}
                        isFlipped={isFlipped}
                        onFlip={handleFlip}
                    />
                )}

                <View style={{ flex: 1 }} />

                {/* Bottom Actions */}
                <View style={{ paddingBottom: insets.bottom + 16 }}>
                    {
                        !isFlipped ? (
                        <Pressable
                            onPress={handleFlip}
                            style={styles.flipCardBtn}
                        >
                            <Text style={styles.flipCardText}>
                                Flip card
                            </Text>
                        </Pressable>
                        ) : (
                            <View style={{ flexDirection: 'row', gap: 12 }}>
                                <Pressable
                                    onPress={handleBack}
                                    disabled={currentIndex === 0}
                                    style={[styles.backBtn, { borderColor: currentIndex === 0 ? Colors.divider : Colors.borderInput}]}
                                >
                                    <Text style={{
                                        fontFamily: 'PlusJakartaSans-Bold',
                                        fontSize: 15,
                                        color: currentIndex === 0 ? Colors.inkMuted : Colors.primary,
                                    }}>
                                        Back
                                    </Text>
                                </Pressable>
                                <Pressable
                                    onPress={handleNext}
                                    style={styles.nextBtn}
                                >
                                    <Text style={{ fontFamily: 'PlusJakartaSans-Bold', fontSize: 15, color: '#fff' }}>
                                        {currentIndex === allCards.length - 1 ? 'Finish' : 'Next'}
                                    </Text>
                                </Pressable>
                            </View>
                        )
                    }
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    frontCard: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: Colors.bgCard,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 28,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 4,
    },
    termTitle:{
        fontFamily: 'PlusJakartaSans-Bold',
        fontSize: 11,
        color: Colors.purple,
        letterSpacing: 1.2,
        textTransform: 'uppercase',
        marginBottom: 16,
    },
    termText:{
        fontFamily: 'PlusJakartaSans-ExtraBold',
        fontSize: 28,
        color: Colors.inkHeading,
        textAlign: 'center',
        letterSpacing: -0.5,
        marginBottom: 16,
    },
    termSubText:{
        fontFamily: 'PlusJakartaSans-Medium',
        fontSize: 13,
        color: Colors.inkSecondary,
    },
    backCard:{
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: Colors.primary,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 28,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 6,
    },
    definitionTitle:{
        fontFamily: 'PlusJakartaSans-Bold',
        fontSize: 11,
        color: 'rgba(255,255,255,0.6)',
        letterSpacing: 1.2,
        textTransform: 'uppercase',
        marginBottom: 20,
    },
    definitionText:{
        fontFamily: 'PlusJakartaSans-SemiBold',
        fontSize: 18,
        color: '#fff',
        textAlign: 'center',
        lineHeight: 28,
    },
    emptyCtn:{
        flex: 1, 
        backgroundColor: Colors.bgApp, 
        alignItems: 'center', 
        justifyContent: 'center', 
        paddingHorizontal: 32
    },
    emptyText:{
        fontFamily: 'PlusJakartaSans-Bold',
        fontSize: 16,
        color: Colors.inkHeading,
        marginTop: 16,
        marginBottom: 8,
        textAlign: 'center',
    },
    uploadText:{
        fontFamily: 'PlusJakartaSans-Medium',
        fontSize: 14,
        color: Colors.inkSecondary,
        textAlign: 'center',  
    },
    goBackBtn:{
        marginTop: 24,
        backgroundColor: Colors.primary,
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 24,
    },
    goBackText:{
        fontFamily: 'PlusJakartaSans-Bold', 
        fontSize: 14, 
        color: '#fff' 
    },
    finishedCtn:{ 
        flex: 1, 
        backgroundColor: Colors.bgApp, 
        alignItems: 'center', 
        justifyContent: 'center', 
        paddingHorizontal: 32 
    },
    iconCtn:{
        width: 80,
        height: 80,
        borderRadius: 999,
        backgroundColor: Colors.greenSoft,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    completeText:{
        fontFamily: 'PlusJakartaSans-ExtraBold',
        fontSize: 24,
        color: Colors.inkHeading,
        marginBottom: 8,
        textAlign: 'center',
    },
    completeSubText:{
        fontFamily: 'PlusJakartaSans-Medium',
        fontSize: 14,
        color: Colors.inkSecondary,
        textAlign: 'center',
        lineHeight: 21,
        marginBottom: 32,
    },
    studyAgainBtn:{
        backgroundColor: Colors.primary,
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: 'center',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.28,
        shadowRadius: 16,
        elevation: 6,
    },
    studyAgainText:{
        fontFamily: 'PlusJakartaSans-Bold', 
        fontSize: 15, 
        color: '#fff'
    },
    backCourseBtn:{
        backgroundColor: Colors.bgCard,
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.borderInput,
    },
    backCourseText:{
        fontFamily: 'PlusJakartaSans-Bold', 
        fontSize: 15, 
        color: Colors.primary
    }, 
    headerCtn:{
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: 12, 
        marginBottom: 20 
    },
    headerCloseBtn: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: Colors.bgCard,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
    },
    progressBarCtn:{
        flex: 1, 
        height: 6, 
        borderRadius: 999, 
        backgroundColor: Colors.bgBoard
    },
    headerSubtitle:{
        fontFamily: 'PlusJakartaSans-Medium',
        fontSize: 13,
        color: Colors.inkSecondary,
        textAlign: 'center',
        marginBottom: 20,
    },
    flipCardBtn:{
        backgroundColor: Colors.purple,
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: 'center',
        shadowColor: Colors.purple,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.28,
        shadowRadius: 16,
        elevation: 6,
    },
    flipCardText:{
        fontFamily: 'PlusJakartaSans-Bold', 
        fontSize: 15, 
        color: '#fff' 
    },
    backBtn:{
        flex: 1,
        paddingVertical: 15,
        borderRadius: 14,
        alignItems: 'center',
        backgroundColor: Colors.bgCard,
        borderWidth: 1,
    },
    nextBtn:{
        flex: 1,
        paddingVertical: 15,
        borderRadius: 14,
        alignItems: 'center',
        backgroundColor: Colors.primary,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.28,
        shadowRadius: 16,
        elevation: 6,
    }
})

export default FlashcardScreen