import { createCourse, updateCourse } from "@/api/course"
import { Colors } from "@/constants"
import { CourseData } from "@/types"
import { Ionicons } from "@expo/vector-icons"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { Alert, Image, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native"
import OnboardingInput from "./OnboardingInput"
import LoadingSpinner from "./LoadingSpinner"
import CalendarPickerModal from "./CalendarPickerModal"

type Props = {
    visible: boolean
    onClose: () => void
    course?: CourseData | null // if provided == edit mode
}

export default function CourseFormModal({ visible, onClose, course }: Props){
    const queryClient = useQueryClient()
    const isEdit =  !!course

    const [courseName, setCourseName] = useState('')
    const [courseCode, setCourseCode] = useState('')
    const [courseUnit, setCourseUnit] = useState('')
    const [description, setDescription] = useState('')
    const [lecturerName, setLecturerName] = useState('')
    const [examDate, setExamDate] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [showCalendar, setShowCalendar] = useState(false)

     // Pre-fill fields in edit mode
    useEffect(() => {
        if (course) {
            setCourseName(course.courseName)
            setCourseCode(course.courseCode)
            setCourseUnit(String(course.courseUnit))
            setDescription(course.description ?? '')
            setLecturerName(course.lecturerName ?? '')
            setExamDate(course.examDate ? course.examDate.split('T')[0] : '')
        } else {
            setCourseName('')
            setCourseCode('')
            setCourseUnit('')
            setDescription('')
            setLecturerName('')
        }
    }, [course, visible])

    const canSubmit =
    courseName.trim().length > 0 &&
    courseCode.trim().length > 0 &&
    courseUnit.trim().length > 0

    const handleSubmit = async () => {
        setIsLoading(true)
        setError('')
        try {
            if(isEdit && course){
                await updateCourse(course._id, {
                    courseName: courseName.trim(),
                    courseCode: courseCode.trim(),
                    courseUnit: Number(courseUnit),
                    description: description.trim(),
                    lecturerName: lecturerName.trim(),
                    examDate: examDate.trim() || undefined,
                })
                queryClient.invalidateQueries({
                    queryKey:['course', course._id]
                })
                onClose()
                Alert.alert('Course Updated', 'Course updated successfully')
            } else {
                await createCourse({
                    courseName: courseName.trim(),
                    courseCode: courseCode.trim(),
                    courseUnit: Number(courseUnit),
                    description: description.trim(),
                    lecturerName: lecturerName.trim(),
                    examDate: examDate.trim() || undefined,
                })
                queryClient.invalidateQueries({
                    queryKey:['courses']
                })
                onClose()
            }
        } catch (error: any) {
            console.log(error)
            setError(error.response?.data?.message ?? 'Something went wrong.')
        } finally{
            setIsLoading(false)
        }
    }
    
    return(
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >   
            <KeyboardAvoidingView
                style={{ flex: 1, backgroundColor: Colors.bgApp }}
                behavior={Platform.OS === "ios" ? 'padding' : 'height'}
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.formContainer}>
                        {/* Header */}
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginBottom: 24,
                            paddingTop:Platform.OS === "android" ? 30 : 0
                        }}>
                            <Pressable
                                onPress={onClose}
                                style={styles.closeIcon}
                            >
                                <Ionicons name="close" size={18} color={Colors.inkHeading} />
                            </Pressable>
                            <Text style={styles.formHeading}>
                                {isEdit ? 'Edit Course' : 'Add Course'}
                            </Text>
                        </View>

                        {/* Info banner */}
                        {!isEdit && (
                            <View style={styles.bannerContainer}>
                                <View style={styles.bannerImg}>
                                    <Image
                                        source={require('../../assets/images/alicetutor-icon-512.png')}
                                        style={{ width: 36, height: 36 }}
                                        resizeMode="cover"
                                    />
                                </View>
                                <Text style={styles.bannerText}>
                                    Add a course to start uploading materials and generating quizzes.
                                </Text>
                            </View>
                        )}

                        {/* Form fields */}
                        <View style={{ gap: 20, marginBottom: 24 }}>
                            <OnboardingInput
                                label="Course title"
                                value={courseName}
                                onChangeText={setCourseName}
                                placeholder="Data Structures & Algorithms"
                                autoCapitalize="none"
                            />

                            <View style={{ flexDirection: 'row', gap: 12 }}>
                                <View style={{ flex: 1.2 }}>
                                <OnboardingInput
                                    label="Course code"
                                    value={courseCode}
                                    onChangeText={setCourseCode}
                                    placeholder="CSC301"
                                    autoCapitalize="characters"
                                />
                                </View>
                                <View style={{ flex: 0.8 }}>
                                    <OnboardingInput
                                        label="Units"
                                        value={courseUnit}
                                        onChangeText={setCourseUnit}
                                        placeholder="3"
                                        keyboardType="numeric"
                                    />
                                </View>
                            </View>

                            {/* Description — multiline */}
                            <View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                                    <Text style={{
                                        fontFamily: 'PlusJakartaSans-SemiBold',
                                        fontSize: 13,
                                        color: Colors.inkSecondary,
                                    }}>
                                        Description
                                    </Text>
                                    <Text style={{
                                        fontFamily: 'PlusJakartaSans-Medium',
                                        fontSize: 13,
                                        color: Colors.inkMuted,
                                    }}>
                                        (optional)
                                    </Text>
                                </View>
                                <TextInput
                                    value={description}
                                    onChangeText={setDescription}
                                    placeholder="A short note about this course..."
                                    placeholderTextColor={Colors.inkMuted}
                                    multiline
                                    numberOfLines={4}
                                    textAlignVertical="top"
                                    style={styles. multilineTextInput}
                                />
                            </View>

                            {/* Lecturer */}
                            <View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                                    <Text style={{
                                        fontFamily: 'PlusJakartaSans-SemiBold',
                                        fontSize: 13,
                                        color: Colors.inkSecondary,
                                    }}>
                                        Lecturer's name
                                    </Text>
                                    <Text style={{
                                        fontFamily: 'PlusJakartaSans-Medium',
                                        fontSize: 13,
                                        color: Colors.inkMuted,
                                    }}>
                                        (optional)
                                    </Text>
                                </View>
                                <OnboardingInput
                                    label=""
                                    value={lecturerName}
                                    onChangeText={setLecturerName}
                                    placeholder="Dr. A. Okafor"
                                    autoCapitalize="words"
                                />
                            </View>
                        </View>

                        {/* Exam Date */}

                        <View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                                <Text style={{
                                    fontFamily: 'PlusJakartaSans-SemiBold',
                                    fontSize: 13,
                                    color: Colors.inkSecondary,
                                }}>
                                    Exam date
                                </Text>
                                <Text style={{
                                    fontFamily: 'PlusJakartaSans-Medium',
                                    fontSize: 13,
                                    color: Colors.inkMuted,
                                }}>
                                (optional)
                                </Text>
                            </View>
                            <Pressable
                                onPress={() => setShowCalendar(true)}
                                style={{
                                    backgroundColor: Colors.bgCard,
                                    borderWidth: 1,
                                    borderColor: Colors.borderInput,
                                    borderRadius: 12,
                                    paddingHorizontal: 16,
                                    paddingVertical: 14,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Text style={{
                                    fontFamily: 'PlusJakartaSans-Medium',
                                    fontSize: 15,
                                    color: examDate ? Colors.inkHeading : Colors.inkMuted,
                                }}>
                                    {examDate ? examDate : 'Select a date'}
                                </Text>
                                <Ionicons
                                    name="calendar-outline"
                                    size={18}
                                    color={examDate ? Colors.primary : Colors.inkMuted}
                                />
                            </Pressable>
                            {/* Calendar modal */}
                            <CalendarPickerModal
                                visible={showCalendar}
                                onClose={() => setShowCalendar(false)}
                                onSelect={(date) => setExamDate(date)}
                                selectedDate={examDate}
                            />
                        </View>

                        {/* Error */}
                        {error.length > 0 && (
                            <View style={{
                                backgroundColor: Colors.redSoft,
                                borderRadius: 10,
                                padding: 12,
                                marginBottom: 16,
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
                        <View style={{ flex: 1 }} />

                        {/* Submit button */}
                        <Pressable
                            onPress={handleSubmit}
                            disabled={!canSubmit || isLoading}
                            style={{
                                backgroundColor: canSubmit ? Colors.primary : Colors.divider,
                                borderRadius: 14,
                                paddingVertical: 16,
                                alignItems: 'center',
                                shadowColor: canSubmit ? Colors.primary : 'transparent',
                                shadowOffset: { width: 0, height: 10 },
                                shadowOpacity: canSubmit ? 0.28 : 0,
                                shadowRadius: 22,
                                elevation: canSubmit ? 8 : 0,
                            }}
                        >
                            <View style={{flexDirection: 'row', gap:10}}>
                                {
                                    isLoading &&
                                    <LoadingSpinner color="#fff" size="small" />
                                }
                                <Text style={{
                                    fontFamily: 'PlusJakartaSans-Bold',
                                    fontSize: 15,
                                    color: canSubmit ? '#fff' : Colors.inkMuted,
                                }}>
                                    {isEdit ? 'Save Changes' : 'Add Course'}
                                </Text>
                            </View>
                        </Pressable>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </Modal>
    )
}

const styles = StyleSheet.create({
    formContainer: {
        flex:1, 
        paddingHorizontal: 20, 
        paddingTop: 20, 
        paddingBottom:32 
    },
    closeIcon:{
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: Colors.bgBoard,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    formHeading:{
        fontFamily: 'PlusJakartaSans-ExtraBold',
        fontSize: 17,
        color: Colors.inkHeading,
    },
    bannerContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.blueSoft,
        borderRadius: 14,
        padding: 14,
        gap: 12,
        marginBottom: 24,
    },
    bannerImg: {
        width: 36,
        height: 36,
        borderRadius: 10,
        overflow: 'hidden', 
    },
    bannerText:{
        fontFamily: 'PlusJakartaSans-Medium',
        fontSize: 13,
        color: Colors.inkBody,
        flex: 1,
        lineHeight: 19,
    },
    multilineTextInput:{
        backgroundColor: Colors.bgCard,
        borderWidth: 1,
        borderColor: Colors.borderInput,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontFamily: 'PlusJakartaSans-Medium',
        fontSize: 15,
        color: Colors.inkHeading,
        minHeight: 100,
    }
})