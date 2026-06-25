import { View, Text, ScrollView, Pressable, FlatList, Image } from 'react-native'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Colors, Shadows } from '@/constants'
import { useAuthStore } from '@/stores/authStore'
import { AntDesign, Ionicons } from '@expo/vector-icons'
import ProgressBar from '@/components/ProgressBar'

const upcomingExams = [
    { id: '1', days: 2, courseName: "Data Structure", code: "CSC301" }, 
    { id: '2', days: 5, courseName: "Data Structure", code: "CSC301" }, 
    { id: '3', days: 12, courseName: "Data Structure", code: "CSC301" },
    { id: '4', days: 30, courseName: "Data Structure", code: "CSC301" }];

const Home = () => {
    const insets = useSafeAreaInsets()
    const { student } = useAuthStore()

    return (
        <ScrollView
            style={{
                flex:1, 
                paddingHorizontal:24,
                paddingTop: insets.top + 24,
                paddingBottom: insets.bottom + 24,
                backgroundColor:Colors.bgApp
            }}
        >
            <View style={{
                flexDirection:'row',
                justifyContent:'space-between',
                marginBottom:25
            }}>
                <View>
                    <Text style={{color: Colors.inkSecondary, fontFamily:'PlusJakartaSans-Medium', fontSize:13.5}}>Tuesday, 12 June</Text>
                    <Text 
                        style={{
                            fontFamily: 'PlusJakartaSans-ExtraBold',
                            fontSize:24
                        }}
                    >Good morning, {student?.firstName} 👋</Text>
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
                    <Text style={{color: Colors.amberText, fontFamily:'PlusJakartaSans-ExtraBold', fontSize:15}}>4</Text>
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
                    <Text style={statNumberStyle}>5</Text>
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
                    <Text style={statNumberStyle}>47</Text>
                    <Text style={statTextStyle}>Quizzes</Text>
                </View>
                <View style={{flex:1, alignItems:'center', paddingVertical:16}}>
                    <Text style={{...statNumberStyle, "color": Colors.greenText}}>78%</Text>
                    <Text style={statTextStyle}>Accuracy</Text>
                </View>
            </View>

            {/* Upcoming Exam */}
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
                    data={upcomingExams}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{paddingBottom:25}}
                    ItemSeparatorComponent={() => <View style={{width:12}}/>}
                    renderItem={({ item, index }) => (
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
                            >IN {item.days} DAYS</Text>
                            <View>
                                <Text style={{
                                    fontFamily:'PlusJakartaSans-ExtraBold',
                                    fontSize:16,
                                    marginBottom:3,
                                    color: index === 0 ? "#fff" : ""
                                }}>{item.courseName}</Text>
                                <Text style={{
                                    fontFamily:'PlusJakartaSans-Bold',
                                    fontSize:13,
                                    color: index === 0 ? "rgba(256, 256, 256, 0.85)" : Colors.inkSecondary
                                }}>{item.code}</Text>
                            </View>
                        </View>
                    )}
                />
            </View>

            {/* Courses */}
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
                    <Pressable>
                        <Text style={{color: Colors.primary, fontFamily: 'PlusJakartaSans-Bold'}}>All courses</Text> 
                    </Pressable>
                </View>
                <View>
                    <FlatList
                        data={upcomingExams.slice(0, 2)}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={{paddingBottom:25}}
                        ItemSeparatorComponent={
                            () => <View style={{height:12}} />
                        }
                        renderItem={({ item }) => (
                            <View style={{
                                backgroundColor: Colors.bgCard,
                                borderColor: Colors.borderCard,
                                borderWidth:1,
                                borderRadius:18,
                                paddingVertical:14,
                                paddingHorizontal:16,
                                justifyContent:'space-between',
                                shadowColor:"#000",
                                shadowOffset:{width:0, height:3},
                                shadowOpacity:0.06,
                                shadowRadius: 8,
                                elevation: 5,
                            }}>
                                <View>
                                    <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                                        <Text style={{
                                            fontFamily:'PlusJakartaSans-ExtraBold',
                                            fontSize:15,
                                            marginBottom:3,
                                        }}>
                                            {item.courseName}
                                        </Text>
                                        <Text style={{
                                            fontFamily:'PlusJakartaSans-Bold',
                                            fontSize:13,
                                            color: Colors.inkSecondary
                                        }}>64%</Text>
                                    </View>
                                    <View style={{flexDirection:'row', gap: 5, marginBottom:8}}>
                                        <Text style={courseSubTextStyle}>
                                            {item.code}
                                        </Text>
                                        <Text>·</Text>
                                        <Text style={courseSubTextStyle}>
                                            2h ago
                                        </Text>
                                    </View>
                                    <ProgressBar progress={80} />
                                </View>
                            </View>
                        )}
                    />
                </View>
            </View>

            {/* Alice Tip */}
            <View style={{
                backgroundColor: Colors.blueSoft,
                borderWidth: 1,
                borderColor: Colors.blueBorder,
                paddingVertical:14,
                paddingHorizontal:16,
                borderRadius:16
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
                        <Text style={{color:Colors.inkBody,  fontFamily:'PlusJakartaSans-Medium', fontSize:13}}>You haven't studied CSC302 in 3 days, and your exam is in 5. Want a quick session?</Text>
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