import { View, Text, ScrollView, Pressable, FlatList, Image } from 'react-native'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Colors, Shadows } from '@/constants'
import { useAuthStore } from '@/stores/authStore'
import { AntDesign, Ionicons } from '@expo/vector-icons'
import ProgressBar from '@/components/ProgressBar'
import { useDashboard } from '@/hooks/useDashboard'
import { getToday } from '@/utils/helpers'
import ScreenLoader from '@/components/ScreenLoader'
import { StudyData, UpcomingExamsData } from '@/types'
import { useRouter } from 'expo-router'

const formatLastStudied = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    if (hours < 1) return 'Just now'
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    if (days === 1) return 'Yesterday'
    return `${days} days ago`
}

const getMasteryColor = (percent: number) => {
    if (percent >= 70) return Colors.green
    if (percent >= 50) return Colors.primary
    return Colors.red
}

const ExamCard = ({item, index}:{ item: UpcomingExamsData, index: number}) => {
    return(
        <View style={{
            width:150,
            height:120,
            backgroundColor: index === 0 ? Colors.red : Colors.bgCard,
            borderColor: Colors.borderCard,
            borderWidth:1,
            borderRadius:18,
            paddingVertical:12,
            paddingHorizontal:16,
            justifyContent:'space-between',
            shadowColor:"#000",
            shadowOffset:{width:0, height:3},
            shadowOpacity:0.06,
            shadowRadius: 6,
            elevation: 4,
        }}>
            <Text style={{
                    color: index === 0 ? "#fff" : Colors.amberText,
                    fontFamily:'PlusJakartaSans-Bold',
                    fontSize:12,
                }}
            >IN {item.daysRemaining} DAYS</Text>
            <View>
                <Text style={{
                    fontFamily:'PlusJakartaSans-ExtraBold',
                    fontSize:16,
                    marginBottom:3,
                    color: index === 0 ? "#fff" : ""
                }}>{item.courseName.split(' ').slice(0, 2).join(' ')}</Text>
                <Text style={{
                    fontFamily:'PlusJakartaSans-Bold',
                    fontSize:13,
                    color: index === 0 ? "rgba(256, 256, 256, 0.85)" : Colors.inkSecondary
                }}>{item.courseCode}</Text>
            </View>
        </View>
    )
}

const StudyCard = ({item}: {item: StudyData}) => {
    const masteryColor = getMasteryColor(item.masteryPercent)
    return(
        <View 
            style={{
                backgroundColor: Colors.bgCard,
                borderColor: Colors.borderCard,
                borderWidth:1,
                borderRadius:18,
                paddingVertical:14,
                paddingHorizontal:16,
                marginBottom:8,
                justifyContent:'space-between',
                shadowColor:"#000",
                shadowOffset:{width:0, height:3},
                shadowOpacity:0.06,
                shadowRadius: 8,
                elevation: 5,
            }}
        >
            <View>
                <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                    <Text style={{
                        fontFamily:'PlusJakartaSans-ExtraBold',
                        fontSize:15,
                        marginBottom:3,
                    }}>
                        {item.materialName}
                    </Text>
                    <Text style={{
                        fontFamily:'PlusJakartaSans-Bold',
                        fontSize:13,
                        color: Colors.inkSecondary
                    }}>{item.masteryPercent}%</Text>
                </View>
                <View style={{flexDirection:'row', gap: 5, marginBottom:8}}>
                    <Text style={courseSubTextStyle}>
                        {item.courseCode}
                    </Text>
                    <Text>·</Text>
                    <Text style={courseSubTextStyle}>
                        {formatLastStudied(item.lastStudied)}
                    </Text>
                </View>
                <ProgressBar progress={item.masteryPercent} bgColor={masteryColor}/>
            </View>
        </View>
    )
}

const Home = () => {
    const insets = useSafeAreaInsets()
    const router = useRouter()
    const { student } = useAuthStore()
    const { data, isLoading, error } = useDashboard()

    if(isLoading){
        return <ScreenLoader />
    }

    return (
        <ScrollView
            style={{
                flex:1, 
                paddingHorizontal:24,
                paddingTop: insets.top + 12,
                backgroundColor:Colors.bgApp
            }}
            contentContainerStyle={{ paddingBottom:32 }}
            showsVerticalScrollIndicator={false}
        >
            <View style={{
                flexDirection:'row',
                justifyContent:'space-between',
                marginBottom:25,
                gap:15
            }}>
                <View>
                    <Text style={{color: Colors.inkSecondary, fontFamily:'PlusJakartaSans-Medium', fontSize:13.5}}>{getToday()}</Text>
                    <Text 
                        style={{
                            fontFamily: 'PlusJakartaSans-ExtraBold',
                            fontSize:24
                        }}
                    >Hello, {student?.firstName} 👋</Text>
                </View>
                <View 
                    style={{
                        flexDirection:'row',
                        alignItems:'center',
                        gap:6,
                        backgroundColor: Colors.amberSoft,
                        alignSelf: 'flex-start',
                        paddingVertical:9,
                        paddingHorizontal:13,
                        borderColor: Colors.amber,
                        borderWidth: 1,
                        borderRadius: 99
                    }}>
                    <AntDesign name='fire' color={Colors.amber} size={12}/>
                    <Text style={{color: Colors.amberText, fontFamily:'PlusJakartaSans-ExtraBold', fontSize:15}}>{data?.student.streak ?? 0}</Text>
                </View>
            </View>

            {/* Stats Card */}
            <View 
                style={{
                    flexDirection:'row',
                    backgroundColor: Colors.bgCard,
                    borderWidth:1,
                    borderColor: Colors.borderInput,
                    borderRadius:15,
                    shadowColor:"#000",
                    shadowOffset:{width:1, height:4},
                    shadowOpacity:0.1,
                    shadowRadius: 14,
                    elevation: 7,
                    marginBottom:30
                }}
            >
                <View 
                    style={{
                        flex:1, 
                        alignItems:'center', 
                        borderRightWidth:1,
                        borderColor: Colors.borderInput,
                        paddingVertical:16
                    }}
                >
                    <Text style={statNumberStyle}>{data?.stats.totalCourses ?? 0}</Text>
                    <Text style={statTextStyle}>Courses</Text>
                </View>
                <View   
                    style={{
                        flex:1, 
                        alignItems:'center', 
                        borderRightWidth:1,
                        borderColor: Colors.borderInput,
                        paddingVertical:16
                    }}
                >
                    <Text style={statNumberStyle}>{data?.stats.totalQuizzes ?? 0}</Text>
                    <Text style={statTextStyle}>Quizzes</Text>
                </View>
                <View style={{flex:1, alignItems:'center', paddingVertical:16}}>
                    <Text style={{...statNumberStyle, "color": Colors.greenText}}>{data?.stats.averageAccuracy ?? 0}%</Text>
                    <Text style={statTextStyle}>Accuracy</Text>
                </View>
            </View>

            {/* Upcoming Exam */}
            {
                data?.upcomingExams && data.upcomingExams.length > 0 &&
                (
                    <View>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent:'space-between',
                                alignItems: 'center',
                                marginBottom:15
                            }}
                        >
                            <Text style={{fontFamily: 'PlusJakartaSans-ExtraBold', fontSize:17}}>Upcoming exams</Text>
                            <Pressable>
                                <Text style={{color: Colors.primary, fontFamily: 'PlusJakartaSans-Bold'}}>See all</Text> 
                            </Pressable>
                        </View>
                        <FlatList
                            data={data?.upcomingExams}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item) => item._id}
                            contentContainerStyle={{paddingBottom:25}}
                            ItemSeparatorComponent={() => <View style={{width:12}}/>}
                            renderItem={({ item, index }) => (
                                <ExamCard item={item} index={index}/>
                            )}
                        />
                    </View>
                )
            }

            {/* Courses */}
            {
                data?.continueStudying && data?.continueStudying.length > 0 && (
                    <View>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent:'space-between',
                                alignItems: 'center',
                                marginBottom:15
                            }}
                        >
                            <Text style={{fontFamily: 'PlusJakartaSans-ExtraBold', fontSize:17}}>Continue studying</Text>
                            <Pressable
                                onPress={() => router.push('/courses')}
                            >
                                <Text style={{color: Colors.primary, fontFamily: 'PlusJakartaSans-Bold'}}>All courses</Text> 
                            </Pressable>
                        </View>
                        {
                            data.continueStudying.map((item) => {
                                return(
                                   <StudyCard key={item._id} item={item}/>
                                )
                            })
                        }
                    </View>
                )
            }

            {/* Alice Tip */}
            <View style={{
                backgroundColor: Colors.blueSoft,
                borderWidth: 1,
                borderColor: Colors.blueBorder,
                paddingVertical:14,
                paddingHorizontal:16,
                borderRadius:16,
                marginTop:20
            }}>
                <View style={{flexDirection:'row', gap:4, marginBottom:6}}>
                    <View 
                        style={{
                            marginBottom:15,
                            shadowColor: "#000",
                            shadowOffset:{ width: 1, height:8},
                            shadowOpacity:0.10,
                            shadowRadius:7,
                            elevation:5
                        }}
                    >
                        <Image
                            source={require('../../assets/images/alicetutor-icon-512.png')}
                            style={{
                                width: 50,
                                height: 50
                            }}
                            resizeMode='contain'
                        />
                    </View>
                    <View style={{flex:1}}>
                        <Text style={{color:Colors.primaryDark,  fontFamily:'PlusJakartaSans-Bold', fontSize:13, marginBottom:2}}>Alice's tip</Text>
                        <Text style={{color:Colors.inkBody,  fontFamily:'PlusJakartaSans-Medium', fontSize:13}}>{data?.aliceTip.message}</Text>
                    </View>
                </View>
                <Pressable
                    onPress={() => {}}
                    style={{
                        backgroundColor: Colors.primaryDark,
                        borderRadius: 14,
                        paddingVertical: 14,
                        alignItems: 'center',

                    }}
                >
                    <View style={{flexDirection: 'row', gap:10}}>
                        <Ionicons name='chatbubble-ellipses-outline' color="#fff" size={20} />
                        <Text 
                            style={{
                                fontFamily: 'PlusJakartaSans-Bold',
                                fontSize: 15,
                                color:'#fff'
                            }}
                        >
                            Chat with Alice
                        </Text>
                    </View>
                </Pressable>
            </View>

        </ScrollView>
    )
}

const statNumberStyle = {
    fontFamily: 'PlusJakartaSans-ExtraBold',
    fontSize:24,
    marginBottom:2
}

const statTextStyle = {
    color: Colors.inkSecondary, 
    fontFamily:'PlusJakartaSans-Medium',
    fontSize:13
}

const courseSubTextStyle = {
    fontFamily:'PlusJakartaSans-Bold',
    fontSize:13,
    color: Colors.inkSecondary
}

export default Home