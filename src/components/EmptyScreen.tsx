import { Colors } from '@/constants'
import { Ionicons } from '@expo/vector-icons'
import { View, Text } from 'react-native'


const EmptyScreen = ({ title, subtitle }: { title: string, subtitle:string }) => {
    return (
        <View 
            style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Ionicons name="book-outline" size={48} color={Colors.inkMuted} />
            <Text 
                style={{
                    fontFamily: 'PlusJakartaSans-Bold',
                    fontSize: 16,
                    color: Colors.inkHeading,
                    marginTop: 16,
                    marginBottom: 8,
                }}
            >
                {title}
            </Text>
            <Text 
                style={{
                    fontFamily: 'PlusJakartaSans-Medium',
                    fontSize: 14,
                    color: Colors.inkSecondary,
                    textAlign: 'center',
                }}
            >
                {subtitle}
            </Text>
        </View>
    )
}

export default EmptyScreen