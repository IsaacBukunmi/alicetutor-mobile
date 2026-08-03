import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native'
import { useAuthStore } from '@/stores/authStore'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Colors, Radius, Shadows } from '@/constants'
import { AntDesign } from '@expo/vector-icons'
import { useDashboard } from '@/hooks/useDashboard'
import ScreenLoader from '@/components/ScreenLoader'

const avatarInitials =  (fullName: string) => {
    const splitName = fullName.split(" ")
    return `${splitName[0][0]}${splitName[1][0]}`
}

const Profile = () => {
    const { signOut } = useAuthStore()
    const router = useRouter()
    const insets = useSafeAreaInsets()
    const { student } = useAuthStore()
    const {data: studentInfo, isLoading } = useDashboard()
    const handleLogout = async () => {
        await signOut()
        router.push('/(auth)/welcome')
    }

    if(isLoading){
        return <ScreenLoader />
    }

    return (
        <View
            style={{
                flex:1,
                paddingHorizontal: 24,
                paddingTop: insets.top + 24,
                paddingBottom: insets.bottom + 24,
                backgroundColor:Colors.bgApp
            }}
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
            >
                <View>
                    <Text style={styles.profileHeading}>Profile</Text>
                </View>

                {/* Profile Details */}
                <View style={styles.infoContainer}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{avatarInitials(`${student?.firstName} ${student?.lastName}`)}</Text>
                    </View>
                    <Text style={styles.profileName}>{`${student?.firstName} ${student?.lastName}`}</Text>
                    <Text style={styles.profileEmail}>{student?.email}</Text>
                    <View style={styles.statCards}>
                        <View style={styles.statCard}>
                            <View style={styles.streakItem}>
                                <View>
                                    <AntDesign name='fire' color={Colors.amber} size={15}/>
                                </View>
                                <Text 
                                    style={{
                                        fontSize:17, 
                                        fontFamily: 'PlusJakartaSans-Bold' 
                                    }}
                                >{studentInfo?.student.streak ?? 0}</Text>
                            </View>
                            <Text style={{fontSize:12, color: Colors.inkSecondary}}>Day streak</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={{fontSize:17, fontFamily:'PlusJakartaSans-Bold'}}>{studentInfo?.stats.totalCourses ?? 0}</Text>
                            <Text style={{fontSize:12, color: Colors.inkSecondary}}>Courses</Text>
                        </View>
                        <View style={[styles.statCard, {borderRightWidth:0}]}>
                            <Text style={{fontSize:17, fontFamily:'PlusJakartaSans-Bold'}}>{studentInfo?.stats.totalQuizzes ?? 0}</Text>
                            <Text style={{fontSize:12, color: Colors.inkSecondary}}>Quizzes</Text>
                        </View>
                    </View>
                </View>

                {/* academic details */}
                <Text style={styles.academicHeading}>ACADEMIC DETAILS</Text>
                <View style={styles.academicContainer}>
                    <View style={[styles.academicRow, {paddingTop:0}]}>
                        <Text style={{ color: Colors.inkSecondary, fontFamily: 'PlusJakartaSans-Medium'}}>Univerisity</Text>
                        <Text style={{ fontFamily: 'PlusJakartaSans-Bold'}}>{student?.university ?? "-"}</Text>
                    </View>
                    <View style={styles.academicRow}>
                        <Text style={styles.academicTitle}>Program</Text>
                        <Text style={{ fontFamily: 'PlusJakartaSans-Bold', textTransform:'capitalize'}}>{student?.program ?? "-"}</Text>
                    </View>
                    <View style={styles.academicRow}>
                        <Text style={styles.academicTitle}>Level</Text>
                        <Text style={{ fontFamily: 'PlusJakartaSans-Bold', textTransform:'capitalize'}}>{student?.level ? `${student.level} Level` : '-'}</Text>
                    </View>
                    <View style={[styles.academicRow, {borderBottomWidth:0, paddingBottom:0}]}>
                        <Text style={styles.academicTitle}>Course of study</Text>
                        <Text style={{ fontFamily: 'PlusJakartaSans-Bold'}}>{student?.courseOfStudy ?? '-'}</Text>
                    </View>
                </View>

                <Pressable
                    onPress={() => handleLogout()}
                >   
                    <View style={styles.signOutBtn}>
                        <Text style={styles.signOutText}>Sign out</Text>
                    </View>
                </Pressable>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    profileHeading:{
        fontFamily: 'PlusJakartaSans-ExtraBold',
        fontSize:28,
        marginBottom:20
    },
    infoContainer:{
        paddingHorizontal:18,
        paddingVertical:18,
        justifyContent:'center',
        alignItems: 'center',
        backgroundColor: Colors.bgCard,
        borderRadius:Radius.cardLg,
        marginBottom:20,
        ...Shadows.card
    },
    avatar:{
        width:70,
        height:70,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:Colors.primary,
        marginBottom:20,
        borderRadius:999,
        shadowColor: "#000",
        shadowOffset: { width:0, height:4 },
        shadowOpacity:0.2,
        shadowRadius:12,
        elevation:2
    },
    avatarText:{
        fontFamily: 'PlusJakartaSans-ExtraBold',
        fontSize:30,
        color: "#FFF"
    },
    profileName:{
        fontFamily: 'PlusJakartaSans-ExtraBold',
        fontSize:20,
        marginBottom:4
    },
    profileEmail:{
        fontFamily: 'PlusJakartaSans-Medium',
        fontSize:14,
        marginBottom:12,
        color: Colors.inkSecondary
    },
    streakItem:{
        flexDirection: 'row',
        alignItems: 'center',
        gap:3
    },
    statCards:{
        marginTop:6,
        flexDirection: 'row',
        backgroundColor: Colors.bgApp,
        borderRadius: 10
    },
    statCard:{
        flex: 1,
        borderRightWidth: 1,
        borderRightColor: Colors.borderInput,
        alignItems: 'center',
        paddingVertical: 14
    },
    signOutText:{
        fontFamily: 'PlusJakartaSans-Bold',
        fontSize:15,
        color:Colors.redText,
    },
    academicHeading:{
        fontFamily: 'PlusJakartaSans-Bold',
        color: Colors.inkMuted,
        marginBottom: 12,
        fontSize: 14
    },
    academicContainer:{
        paddingVertical:20,
        backgroundColor: Colors.bgCard,
        borderRadius:Radius.cardLg,
        marginBottom:20,
        ...Shadows.card
    },
    academicRow:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderInput,
        padding: 13
    },
    academicTitle: { 
        color: Colors.inkSecondary, 
        fontFamily: 'PlusJakartaSans-Medium'
    },
    signOutBtn:{
        backgroundColor: Colors.redSoft,
        height: 50,
        borderRadius: Radius.btn,
        justifyContent:'center',
        alignItems: 'center',
        ...Shadows.card
    }
})

export default Profile