import { View, ActivityIndicator, Text } from 'react-native'
import { Colors } from '@/constants'

type Props = {
  color?: string
}

export default function ScreenLoader({ color = Colors.primary }: Props) {
  return (
    <View style={{
        flex: 1,
        backgroundColor: Colors.bgApp,
        alignItems: 'center',
        justifyContent: 'center',
    }}>
        <View style={{flexDirection:'row', alignItems:'center', gap:10}}>
            <ActivityIndicator size="large" color={color} />
            <Text style={{fontFamily: 'PlusJakartaSans-Bold', fontSize:16, color:color}}>Loading</Text>
        </View>
    </View>
  )
}