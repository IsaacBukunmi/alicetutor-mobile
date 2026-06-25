import { View, Text, TextInput, TextInputProps } from 'react-native'
import { useState } from 'react'
import { Colors } from '@/constants'

type Props = TextInputProps & {
    label: string
}

export default function OnboardingInput({ label, ...props }: Props) {
    const [focused, setFocused] = useState(false)

    return (
        <View>
            {
                label.length > 0 &&
                <Text style={{
                    fontFamily: 'PlusJakartaSans-SemiBold',
                    fontSize: 13,
                    color: Colors.inkBody,
                    marginBottom: 8,
                }}>
                    {label}
                </Text>
            }
            <TextInput
                placeholderTextColor={Colors.inkMuted}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                style={{
                    backgroundColor: Colors.bgCard,
                    borderWidth: focused ? 1.5 : 1,
                    borderColor: focused ? Colors.primary : Colors.borderInput,
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                    fontFamily: 'PlusJakartaSans-Medium',
                    fontSize: 15,
                    color: Colors.inkHeading,
                }}
                {...props}
            />
        </View>
    )
}