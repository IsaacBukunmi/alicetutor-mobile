import { View, Text, ScrollView, StyleSheet, FlatList, Pressable } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Colors, Radius, Shadows } from '@/constants'
import { useRouter } from 'expo-router'
import { Entypo, Ionicons } from '@expo/vector-icons'
import { useCourses } from '@/hooks/useCourses'
import ScreenLoader from '@/components/ScreenLoader'
import { CourseData } from '@/types'
import EmptyScreen from '@/components/EmptyScreen'
import { useState } from 'react'
import CourseFormModal from '@/components/CourseFormModal'
import { useNetworkStatus } from '@/hooks/useNetworkStatus'
import OfflineBanner from '@/components/OfflineBanner'

const getFileTypeColor = (unit: number) => {
    if (unit >= 4) return Colors.purple
    if (unit >= 3) return Colors.primary
    return Colors.green
}

function CourseCard({ course, onPress }: { course: CourseData, onPress: () => void }){
    return(
        <Pressable
            onPress={onPress}
        >
            <View style={styles.card}>
                <View style={styles.cardTop}>
                    <View style={{flexDirection: 'row', gap:7, alignItems:'center'}}>
                        <View style={styles.codePill}>
                            <Text style={styles.codePillText}>{course.courseCode}</Text>
                        </View>
                        <Text style={{color: Colors.inkMuted, fontSize:11, fontFamily:'PlusJakartaSans-Medium'}}>{course.courseUnit} units</Text>
                    </View>
                    <View style={styles.courseInfo}>
                        <Ionicons name='calendar-outline' color={Colors.inkSecondary}/>
                        <Text style={styles.courseInfoText}>{course.examDate
                        ? `Exam: ${new Date(course.examDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`
                        : 'No exam date set'}</Text>
                    </View>
                </View>
                <Text style={styles.courseTitle}>{course.courseName}</Text>
                <Text style={styles.lecturer}>{course.lecturerName}</Text>
            </View>
        </Pressable>  
    )
}

const Courses = () => {
    const insets = useSafeAreaInsets()
    const router = useRouter()
    const {data: courses, isLoading, error} = useCourses()
    const [modalVisible, setModalVisible] = useState(false)
    const { isOnline } = useNetworkStatus()
    
    if(isLoading){
        return <ScreenLoader />
    }
    return (
        <>
            <FlatList 
                data={courses}
                keyExtractor={(item) =>  item._id}
                ListHeaderComponent={
                    <View>
                        {!isOnline && <OfflineBanner />}
                        <View style={styles.headerContainer}>
                            <View style={{marginBottom:20}}>
                                <Text style={styles.heading}>My Courses</Text>
                            </View>
                            <Pressable 
                                style={styles.headerBtn}
                                onPress={() => setModalVisible(true)}
                            >
                                <Entypo name='plus' size={27} color={"#fff"}/>
                            </Pressable>
                        </View>
                    </View>
                }
                renderItem={({ item }) => (
                    <CourseCard 
                        key={item._id}
                        course={item}
                        onPress={() => router.push(`/(screens)/courses/${item._id}`)}
                    />
                )}
                contentContainerStyle={{
                    flex:1, 
                    paddingHorizontal:24,
                    paddingTop: insets.top + 12,
                    paddingBottom: insets.bottom + 24,
                    backgroundColor:Colors.bgApp
                }}
                ListEmptyComponent={
                    <EmptyScreen 
                        title='No courses yet'
                        subtitle='Tap the + button to add your first course'
                    />
                }
            />
            <CourseFormModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
            />
        </>
        
    )
}

const styles = StyleSheet.create({
    heading:{
        fontFamily: 'PlusJakartaSans-ExtraBold',
        fontSize:30  
    },
    headerContainer:{
        flexDirection:'row',
        justifyContent:'space-between'
    },
    headerBtn:{
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.28,
        shadowRadius: 8,
        elevation: 6,
    },
    card:{
        backgroundColor: Colors.bgCard,
        marginBottom:15,
        padding:12,
        borderRadius:Radius.card,
        borderWidth:1, 
        borderColor: Colors.borderCard,
        ...Shadows.card
    },
    cardTop:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom:4
    },
    cardTitle:{
        fontFamily: 'PlusJakartaSans-ExtraBold',
        fontSize:20  
    },
    codePill:{
        backgroundColor: Colors.blueSoft,
        color: Colors.primary,
        paddingVertical:4,
        paddingHorizontal: 8,
        borderRadius:20
    },
    codePillText:{
        color: Colors.primaryDark,
        fontFamily: 'PlusJakartaSans-Bold',
        fontSize:11
    },
    statusPill:{
        backgroundColor: Colors.amberSoft,
        color: Colors.primary,
        paddingVertical:4,
        paddingHorizontal: 8,
        borderRadius:99
    },
    statusPillText:{
        color: Colors.amberText,
        fontFamily: 'PlusJakartaSans-Bold',
        fontSize:11
    },
    courseTitle:{
        fontFamily: 'PlusJakartaSans-Bold',
        fontSize:15,
        marginBottom:4
    },
    lecturer:{
        fontFamily: 'PlusJakartaSans-Medium',
        fontSize:12,
        color:Colors.inkSecondary
    },
    cardBottom:{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: 6,
        marginTop:10
    },
    courseInfo:{
        flexDirection: 'row', 
        gap:6, 
        alignItems:'center'
    },
    courseInfoText:{
        color: Colors.inkSecondary,
        fontFamily: 'PlusJakartaSans-Medium',
        fontSize:12,
    },
})

export default Courses