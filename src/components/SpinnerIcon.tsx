import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    Easing,
  } from 'react-native-reanimated'
  import { View } from 'react-native'
  
  export default function SpinnerIcon({ size = 12, color = '#D97706' }: { size?: number; color?: string }) {
    const rotation = useSharedValue(0)
  
    rotation.value = withRepeat(
      withTiming(360, { duration: 900, easing: Easing.linear }),
      -1,
      false
    )
  
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ rotate: `${rotation.value}deg` }],
    }))
  
    return (
      <Animated.View style={[animatedStyle, { width: size, height: size }]}>
        <View style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 1.5,
          borderColor: color,
          borderTopColor: 'transparent',
        }} />
      </Animated.View>
    )
  }