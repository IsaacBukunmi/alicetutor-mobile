import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native'
import { useAuthStore } from '@/stores/authStore'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Colors, Radius, Shadows } from '@/constants'

const Profile = () => {
    const { signOut } = useAuthStore()
    const router = useRouter()
    const insets = useSafeAreaInsets()
    const handleLogout = async () => {
        await signOut()
        router.push('/(auth)/welcome')
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
                 <View style={styles.infoContainer}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>IA</Text>
                    </View>
                    <Text style={styles.profileName}>Isaac Adetona</Text>
                    <Text style={styles.profileEmail}>isaac.adeyemi@student.unilag.edu.ng</Text>
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
    signOutText:{
        fontFamily: 'PlusJakartaSans-Bold',
        fontSize:15,
        color:Colors.redText,
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