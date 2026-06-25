import { ActivityIndicator, View } from 'react-native'
import { Colors } from '@/constants'

type Props = {
  color?: string
  size?: 'small' | 'large'
}

export default function LoadingSpinner({ color = Colors.bgCard, size = 'small' }: Props) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator size={size} color={color} />
    </View>
  )
}