import { View, Text, Pressable, Modal } from 'react-native'
import { Calendar } from 'react-native-calendars'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '@/constants'

type Props = {
  visible: boolean
  onClose: () => void
  onSelect: (date: string) => void
  selectedDate?: string
}

export default function CalendarPickerModal({
    visible,
    onClose,
    onSelect,
    selectedDate,
}: Props) {
    const today = new Date().toISOString().split('T')[0]

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
        <Pressable
            style={{
                flex: 1,
                backgroundColor: 'rgba(0,0,0,0.4)',
                justifyContent: 'center',
                paddingHorizontal: 20,
            }}
            onPress={onClose}
        >
            {/* Stop press from bubbling to overlay */}
            <Pressable onPress={e => e.stopPropagation()}>
                <View style={{
                    backgroundColor: Colors.bgCard,
                    borderRadius: 20,
                    overflow: 'hidden',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.12,
                    shadowRadius: 20,
                    elevation: 8,
                }}>

                    {/* Header */}
                    <View 
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingHorizontal: 16,
                            paddingTop: 16,
                            paddingBottom: 8,
                        }}
                    >
                    <Text style={{
                        fontFamily: 'PlusJakartaSans-ExtraBold',
                        fontSize: 16,
                        color: Colors.inkHeading,
                    }}>
                        Pick exam date
                    </Text>
                    <Pressable
                        onPress={onClose}
                        style={{
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            backgroundColor: Colors.bgBoard,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Ionicons name="close" size={16} color={Colors.inkHeading} />
                    </Pressable>
                    </View>

                    {/* Calendar */}
                    <Calendar
                        current={selectedDate ?? today}
                        minDate={today}
                        onDayPress={(day) => {
                            onSelect(day.dateString)
                            onClose()
                        }}
                        markedDates={selectedDate ? {
                            [selectedDate]: {
                            selected: true,
                            selectedColor: Colors.primary,
                            }
                        } : {}}
                        theme={{
                            backgroundColor: Colors.bgCard,
                            calendarBackground: Colors.bgCard,
                            selectedDayBackgroundColor: Colors.primary,
                            selectedDayTextColor: '#fff',
                            todayTextColor: Colors.primary,
                            dayTextColor: Colors.inkHeading,
                            textDisabledColor: Colors.inkMuted,
                            arrowColor: Colors.primary,
                            monthTextColor: Colors.inkHeading,
                            textDayFontFamily: 'PlusJakartaSans-Medium',
                            textMonthFontFamily: 'PlusJakartaSans-Bold',
                            textDayHeaderFontFamily: 'PlusJakartaSans-SemiBold',
                            textDayFontSize: 14,
                            textMonthFontSize: 15,
                            textDayHeaderFontSize: 12,
                            dotColor: Colors.primary,
                        }}
                    />

                    {/* Clear button */}
                    {
                        selectedDate && (
                            <Pressable
                                onPress={() => {
                                    onSelect('')
                                    onClose()
                                }}
                                style={{
                                    marginHorizontal: 16,
                                    marginBottom: 16,
                                    paddingVertical: 12,
                                    borderRadius: 12,
                                    alignItems: 'center',
                                    backgroundColor: Colors.bgBoard,
                                }}
                            >
                                <Text 
                                    style={{
                                        fontFamily: 'PlusJakartaSans-SemiBold',
                                        fontSize: 13,
                                        color: Colors.inkSecondary,
                                    }}
                                >
                                    Clear date
                                </Text>
                            </Pressable>
                        )
                    }

                </View>
            </Pressable>
        </Pressable>
        </Modal>
    )
}