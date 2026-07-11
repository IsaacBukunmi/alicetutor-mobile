import { useState, useRef, useEffect } from 'react'
import {
  View, Text, Pressable, TextInput, ScrollView,
  KeyboardAvoidingView, Platform, Image, ActivityIndicator
} from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useQueryClient } from '@tanstack/react-query'
import { useChatSession } from '@/hooks/useChat'
import ScreenLoader from '@/components/ScreenLoader'
import { Colors } from '@/constants'
import { ChatMessage } from '@/types'
import { sendMessage } from '@/api/chat'

// ── Helpers ───────────────────────────────────────────────────────────────────

const formatTime = (dateStr: string) => {
  return new Date(dateStr).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Basic markdown to plain styled text — handles **bold** and bullet points
const renderMessageText = (content: string) => {
  const lines = content.split('\n').filter(l => l.trim().length > 0)
  return lines.map((line, index) => {
    const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('• ')
    const isHeader = /^#{1,3}\s/.test(line)
    const cleaned = line
      .replace(/^#{1,3}\s/, '')
      .replace(/^[-•]\s/, '')
      .trim()

    // Split by **bold** markers
    const parts = cleaned.split(/\*\*(.*?)\*\*/g)

    return (
      <Text
        key={index}
        style={{
          fontFamily: 'PlusJakartaSans-Medium',
          fontSize: 14.5,
          lineHeight: 21,
          color: Colors.inkHeading,
          marginBottom: isBullet || isHeader ? 4 : 0,
        }}
      >
        {isBullet ? '• ' : ''}{parts.map((part, i) =>
          i % 2 === 1 ? (
            <Text key={i} style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
              {part}
            </Text>
          ) : part
        )}
      </Text>
    )
  })
}

// ── Subcomponents ─────────────────────────────────────────────────────────────

function UserBubble({ message }: { message: ChatMessage }) {
  return (
    <View style={{ alignItems: 'flex-end', marginBottom: 12, paddingLeft: 60 }}>
      <View style={{
        backgroundColor: Colors.primary,
        borderRadius: 18,
        borderBottomRightRadius: 4,
        paddingHorizontal: 14,
        paddingVertical: 10,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
      }}>
        <Text style={{
          fontFamily: 'PlusJakartaSans-Medium',
          fontSize: 14.5,
          lineHeight: 21,
          color: '#fff',
        }}>
          {message.content}
        </Text>
      </View>
      <Text style={{
        fontFamily: 'PlusJakartaSans-Medium',
        fontSize: 11,
        color: Colors.inkMuted,
        marginTop: 4,
      }}>
        {formatTime(message.createdAt)}
      </Text>
    </View>
  )
}

function AssistantBubble({ message }: { message: ChatMessage }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginBottom: 12, paddingRight: 60, gap: 8 }}>
      <View style={{
        width: 32,
        height: 32,
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: Colors.primary,
        flexShrink: 0,
      }}>
        <Image
          source={require('../../../assets/images/alicetutor-icon-512.png')}
          style={{ width: 32, height: 32 }}
          resizeMode="cover"
        />
      </View>
      <View style={{ flex: 1 }}>
        <View style={{
          backgroundColor: Colors.bgCard,
          borderRadius: 18,
          borderBottomLeftRadius: 4,
          paddingHorizontal: 14,
          paddingVertical: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 6,
          elevation: 2,
        }}>
          {renderMessageText(message.content)}
        </View>
        <Text style={{
          fontFamily: 'PlusJakartaSans-Medium',
          fontSize: 11,
          color: Colors.inkMuted,
          marginTop: 4,
        }}>
          {formatTime(message.createdAt)}
        </Text>
      </View>
    </View>
  )
}

function TypingIndicator() {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginBottom: 12, paddingRight: 60, gap: 8 }}>
      <View style={{
        width: 32,
        height: 32,
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: Colors.primary,
        flexShrink: 0,
      }}>
        <Image
          source={require('../../../assets/images/alicetutor-icon-512.png')}
          style={{ width: 32, height: 32 }}
          resizeMode="cover"
        />
      </View>
      <View style={{
        backgroundColor: Colors.bgCard,
        borderRadius: 18,
        borderBottomLeftRadius: 4,
        paddingHorizontal: 16,
        paddingVertical: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
      }}>
        <ActivityIndicator size="small" color={Colors.inkMuted} />
      </View>
    </View>
  )
}

// ── Main Screen ───────────────────────────────────────────────────────────────

export default function ChatSessionScreen() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>()
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const queryClient = useQueryClient()
  const scrollRef = useRef<ScrollView>(null)

  const { data: session, isLoading } = useChatSession(sessionId)

  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [optimisticMessages, setOptimisticMessages] = useState<ChatMessage[]>([])

  // Scroll to bottom when messages change
  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true })
    }, 100)
  }, [session?.messages, optimisticMessages, isSending])

  if (isLoading) return <ScreenLoader />

  const allMessages = [
    ...(session?.messages ?? []),
    ...optimisticMessages,
  ]

  const isCourse = session?.type === 'course_specific'
  const subtitle = isCourse && session?.course
    ? `${session.course.courseCode} session`
    : 'General session'

  const handleSend = async () => {
    const content = input.trim()
    if (!content || isSending) return

    setInput('')
    setIsSending(true)

    // Add optimistic user message
    const tempMessage: ChatMessage = {
      _id: `temp-${Date.now()}`,
      role: 'user',
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setOptimisticMessages(prev => [...prev, tempMessage])

    try {
      await sendMessage(sessionId, content)
      // Refetch session to get real messages including Alice's response
      await queryClient.invalidateQueries({ queryKey: ['chat-session', sessionId] })
      await queryClient.refetchQueries({ queryKey: ['chat-session', sessionId] })
      setOptimisticMessages([])
      // Also refresh sessions list so title updates
      queryClient.invalidateQueries({ queryKey: ['chat-sessions'] })
    } catch {
      // Remove optimistic message on failure
      setOptimisticMessages([])
    } finally {
      setIsSending(false)
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.bgApp }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      {/* Header */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: insets.top + 12,
        paddingBottom: 12,
        backgroundColor: Colors.bgCard,
        borderBottomWidth: 1,
        borderBottomColor: Colors.divider,
        gap: 10,
      }}>
        <Pressable
          onPress={() => router.back()}
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            backgroundColor: Colors.bgBoard,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="chevron-back" size={20} color={Colors.inkHeading} />
        </Pressable>

        <View style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          overflow: 'hidden',
          backgroundColor: Colors.primary,
        }}>
          <Image
            source={require('../../../assets/images/alicetutor-icon-512.png')}
            style={{ width: 36, height: 36 }}
            resizeMode="cover"
          />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={{
            fontFamily: 'PlusJakartaSans-Bold',
            fontSize: 15,
            color: Colors.inkHeading,
          }}>
            Alice
          </Text>
          <Text style={{
            fontFamily: 'PlusJakartaSans-Medium',
            fontSize: 12,
            color: Colors.primary,
          }}>
            {subtitle}
          </Text>
        </View>

        <Pressable style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          backgroundColor: Colors.bgBoard,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Ionicons name="ellipsis-horizontal" size={18} color={Colors.inkHeading} />
        </Pressable>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 16,
        }}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
      >
        {allMessages.length === 0 ? (
          <View style={{ alignItems: 'center', paddingTop: 60 }}>
            <Text style={{
              fontFamily: 'PlusJakartaSans-Medium',
              fontSize: 14,
              color: Colors.inkMuted,
              textAlign: 'center',
            }}>
              Say hi to Alice to get started!
            </Text>
          </View>
        ) : (
          allMessages.map((message) =>
            message.role === 'user' ? (
              <UserBubble key={message._id} message={message} />
            ) : (
              <AssistantBubble key={message._id} message={message} />
            )
          )
        )}
        {isSending && <TypingIndicator />}
      </ScrollView>

      {/* Input bar */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        paddingBottom: insets.bottom + 12,
        backgroundColor: Colors.bgCard,
        borderTopWidth: 1,
        borderTopColor: Colors.divider,
        gap: 10,
      }}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Message Alice..."
          placeholderTextColor={Colors.inkMuted}
          multiline
          style={{
            flex: 1,
            fontFamily: 'PlusJakartaSans-Medium',
            fontSize: 14.5,
            color: Colors.inkHeading,
            backgroundColor: Colors.bgApp,
            borderRadius: 20,
            paddingHorizontal: 16,
            paddingVertical: 10,
            maxHeight: 100,
          }}
          onSubmitEditing={handleSend}
        />
        <Pressable
          onPress={handleSend}
          disabled={!input.trim() || isSending}
          style={{
            width: 40,
            height: 40,
            borderRadius: 999,
            backgroundColor: input.trim() ? Colors.primary : Colors.divider,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: input.trim() ? Colors.primary : 'transparent',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: input.trim() ? 0.28 : 0,
            shadowRadius: 8,
            elevation: input.trim() ? 4 : 0,
          }}
        >
          <Ionicons name="send" size={16} color={input.trim() ? '#fff' : Colors.inkMuted} />
        </Pressable>
      </View>

    </KeyboardAvoidingView>
  )
}