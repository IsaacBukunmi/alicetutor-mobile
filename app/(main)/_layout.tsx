import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '@/constants'

type IconProps = {
  color: string
  size: number
  focused: boolean
}

export default function MainLayout() {
  return (
    <Tabs
        screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: Colors.primary,
            tabBarInactiveTintColor: Colors.inkMuted,
            tabBarStyle: {
                backgroundColor: Colors.bgCard,
                borderTopColor: Colors.borderInput,
                paddingTop: 8,
                // height: 64,
            },
            tabBarLabelStyle: {
                fontFamily: 'PlusJakartaSans-SemiBold',
                fontSize: 11,
            },
        }}
    >
        <Tabs.Screen
            name="home"
            options={{
                title: 'Home',
                tabBarIcon: ({ color, size, focused }) => (
                    <Ionicons
                        name={focused ? 'home' : 'home-outline'}
                        size={size}
                        color={color}
                    />
                ),
            }}
        />
        <Tabs.Screen
            name="courses"
            options={{
            title: 'Courses',
            tabBarIcon: ({ color, size, focused }) => (
                <Ionicons
                    name={focused ? 'book' : 'book-outline'}
                    size={size}
                    color={color}
                />
            ),
            }}
        />
        <Tabs.Screen
            name="chat"
            options={{
            title: 'Chat',
            tabBarIcon: ({ color, size, focused }) => (
                <Ionicons
                    name={focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline'}
                    size={size}
                    color={color}
                />
            ),
            }}
        />
        <Tabs.Screen
            name="profile"
            options={{
            title: 'Profile',
            tabBarIcon: ({ color, size, focused }) => (
                <Ionicons
                    name={focused ? 'person' : 'person-outline'}
                    size={size}
                    color={color}
                />
            ),
            }}
        />
    </Tabs>
  )
}