import { useState } from 'react'
import { View, Text, Pressable, ScrollView, Image } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useChatSessions } from '@/hooks/useChat'
import { useCourses } from '@/hooks/useCourses'
import ScreenLoader from '@/components/ScreenLoader'
import { Colors } from '@/constants'
import { ChatSession, CourseData } from '@/types'
import { createChatSession } from '@/api/chat'
import { useQueryClient } from '@tanstack/react-query'
import OfflineState from '@/components/OfflineState'
import { useNetworkStatus } from '@/hooks/useNetworkStatus'

// ── Helpers ───────────────────────────────────────────────────────────────────

type FilterType = 'all' | 'course_specific' | 'general'

const formatTimeAgo = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (mins < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days === 1) return 'Yesterday'
  return `${days}d ago`
}

const getLastMessage = (session: ChatSession) => {
  const messages = session.messages
  if (!messages || messages.length === 0) return 'No messages yet'
  const last = messages[messages.length - 1]
  const text = last.content.replace(/\*\*/g, '').replace(/#{1,6}\s/g, '').replace(/\n/g, ' ')
  return text.length > 50 ? text.slice(0, 50) + '...' : text
}

// ── Subcomponents ─────────────────────────────────────────────────────────────

function FilterTab({
  label,
  active,
  onPress,
}: {
  label: string
  active: boolean
  onPress: () => void
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: active ? Colors.bgCard : 'transparent',
        shadowColor: active ? '#000' : 'transparent',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: active ? 0.06 : 0,
        shadowRadius: 4,
        elevation: active ? 2 : 0,
      }}
    >
      <Text style={{
        fontFamily: active ? 'PlusJakartaSans-Bold' : 'PlusJakartaSans-Medium',
        fontSize: 13.5,
        color: active ? Colors.inkHeading : Colors.inkSecondary,
      }}>
        {label}
      </Text>
    </Pressable>
  )
}

function SessionCard({ session, onPress }: { session: ChatSession; onPress: () => void }) {
  const isCourse = session.type === 'course_specific'
  const avatarBg = isCourse ? Colors.primary : Colors.purple

  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.bgCard,
        borderRadius: 16,
        padding: 14,
        marginBottom: 10,
        gap: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      {/* Avatar */}
      <View style={{
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: avatarBg,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
        <Image
          source={require('../../../assets/images/alicetutor-icon-512.png')}
          style={{ width: 44, height: 44 }}
          resizeMode="cover"
        />
      </View>

      {/* Content */}
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 3 }}>
          <Text
            style={{
              fontFamily: 'PlusJakartaSans-Bold',
              fontSize: 14,
              color: Colors.inkHeading,
              flex: 1,
            }}
            numberOfLines={1}
          >
            {session.title}
          </Text>
          <Text style={{
            fontFamily: 'PlusJakartaSans-Medium',
            fontSize: 11.5,
            color: Colors.inkMuted,
          }}>
            {formatTimeAgo(session.updatedAt)}
          </Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          {isCourse && session.course ? (
            <View style={{
              backgroundColor: Colors.blueSoft,
              borderRadius: 6,
              paddingHorizontal: 6,
              paddingVertical: 2,
            }}>
              <Text style={{
                fontFamily: 'PlusJakartaSans-Bold',
                fontSize: 11,
                color: Colors.primary,
              }}>
                {session.course.courseCode}
              </Text>
            </View>
          ) : (
            <View style={{
              backgroundColor: Colors.purpleSoft,
              borderRadius: 6,
              paddingHorizontal: 6,
              paddingVertical: 2,
            }}>
              <Text style={{
                fontFamily: 'PlusJakartaSans-Bold',
                fontSize: 11,
                color: Colors.purple,
              }}>
                General
              </Text>
            </View>
          )}
        </View>

        <Text
          style={{
            fontFamily: 'PlusJakartaSans-Medium',
            fontSize: 12.5,
            color: Colors.inkSecondary,
          }}
          numberOfLines={1}
        >
          {getLastMessage(session)}
        </Text>
      </View>
    </Pressable>
  )
}

function NewSessionModal({
  visible,
  onClose,
  courses,
}: {
  visible: boolean
  onClose: () => void
  courses: CourseData[]
}) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [sessionType, setSessionType] = useState<'general' | 'course_specific' | null>(null)
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
 

  

  const canStart =
    sessionType === 'general' ||
    (sessionType === 'course_specific' && selectedCourseId !== null)

  const handleStart = async () => {
    if (!canStart) return
    setIsLoading(true)
    try {
      const { data } = await createChatSession({
        type: sessionType!,
        courseId: selectedCourseId ?? undefined,
      })
      queryClient.invalidateQueries({ queryKey: ['chat-sessions'] })
      onClose()
      router.push(`/(screens)/chat/${data.session._id}`)
    } catch {
      // handle error silently
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setSessionType(null)
    setSelectedCourseId(null)
    onClose()
  }

  if (!visible) return null

  return (
    <View style={{
      position: 'absolute',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.4)',
      justifyContent: 'flex-end',
      zIndex: 100,
    }}>
      <View style={{
        backgroundColor: Colors.bgApp,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 20,
        paddingBottom: 40,
      }}>
        {/* Header */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 20,
        }}>
          <Pressable
            onPress={handleClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              backgroundColor: Colors.bgBoard,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 12,
            }}
          >
            <Ionicons name="close" size={16} color={Colors.inkHeading} />
          </Pressable>
          <Text style={{
            fontFamily: 'PlusJakartaSans-ExtraBold',
            fontSize: 16,
            color: Colors.inkHeading,
          }}>
            New session
          </Text>
        </View>

        <Text style={{
          fontFamily: 'PlusJakartaSans-Medium',
          fontSize: 13,
          color: Colors.inkSecondary,
          marginBottom: 14,
        }}>
          What should this conversation be about?
        </Text>

        {/* Session type options */}
        <View style={{ gap: 10, marginBottom: 20 }}>
          <Pressable
            onPress={() => {
              setSessionType('course_specific')
              setSelectedCourseId(null)
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              padding: 14,
              borderRadius: 14,
              backgroundColor: Colors.bgCard,
              borderWidth: 1.5,
              borderColor: sessionType === 'course_specific' ? Colors.primary : Colors.borderInput,
            }}
          >
            <View style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              backgroundColor: Colors.blueSoft,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Ionicons name="book-outline" size={20} color={Colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{
                fontFamily: 'PlusJakartaSans-Bold',
                fontSize: 14,
                color: Colors.inkHeading,
                marginBottom: 2,
              }}>
                Course session
              </Text>
              <Text style={{
                fontFamily: 'PlusJakartaSans-Medium',
                fontSize: 12.5,
                color: Colors.inkSecondary,
              }}>
                Alice uses your quiz history for this course.
              </Text>
            </View>
            {sessionType === 'course_specific' && (
              <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />
            )}
          </Pressable>

          <Pressable
            onPress={() => {
              setSessionType('general')
              setSelectedCourseId(null)
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              padding: 14,
              borderRadius: 14,
              backgroundColor: Colors.bgCard,
              borderWidth: 1.5,
              borderColor: sessionType === 'general' ? Colors.purple : Colors.borderInput,
            }}
          >
            <View style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              backgroundColor: Colors.purpleSoft,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Ionicons name="star-outline" size={20} color={Colors.purple} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{
                fontFamily: 'PlusJakartaSans-Bold',
                fontSize: 14,
                color: Colors.inkHeading,
                marginBottom: 2,
              }}>
                General session
              </Text>
              <Text style={{
                fontFamily: 'PlusJakartaSans-Medium',
                fontSize: 12.5,
                color: Colors.inkSecondary,
              }}>
                Open study chat about anything.
              </Text>
            </View>
            {sessionType === 'general' && (
              <Ionicons name="checkmark-circle" size={20} color={Colors.purple} />
            )}
          </Pressable>
        </View>

        {/* Course picker */}
        {sessionType === 'course_specific' && (
          <View style={{ marginBottom: 20 }}>
            <Text style={{
              fontFamily: 'PlusJakartaSans-Bold',
              fontSize: 11,
              color: Colors.inkMuted,
              letterSpacing: 0.6,
              textTransform: 'uppercase',
              marginBottom: 10,
            }}>
              Choose a course
            </Text>
            <View style={{ gap: 8 }}>
              {courses.map((course) => (
                <Pressable
                  key={course._id}
                  onPress={() => setSelectedCourseId(course._id)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 14,
                    borderRadius: 12,
                    backgroundColor: Colors.bgCard,
                    borderWidth: 1.5,
                    borderColor: selectedCourseId === course._id ? Colors.primary : Colors.borderInput,
                    gap: 10,
                  }}
                >
                  <View style={{
                    backgroundColor: Colors.blueSoft,
                    borderRadius: 6,
                    paddingHorizontal: 8,
                    paddingVertical: 3,
                  }}>
                    <Text style={{
                      fontFamily: 'PlusJakartaSans-Bold',
                      fontSize: 11,
                      color: Colors.primary,
                    }}>
                      {course.courseCode}
                    </Text>
                  </View>
                  <Text style={{
                    fontFamily: 'PlusJakartaSans-SemiBold',
                    fontSize: 13.5,
                    color: Colors.inkHeading,
                    flex: 1,
                  }}>
                    {course.courseName}
                  </Text>
                  {selectedCourseId === course._id && (
                    <Ionicons name="checkmark" size={18} color={Colors.primary} />
                  )}
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* Start Chat button */}
        <Pressable
          onPress={handleStart}
          disabled={!canStart || isLoading}
          style={{
            backgroundColor: canStart ? Colors.primary : Colors.divider,
            borderRadius: 14,
            paddingVertical: 16,
            alignItems: 'center',
            shadowColor: canStart ? Colors.primary : 'transparent',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: canStart ? 0.28 : 0,
            shadowRadius: 16,
            elevation: canStart ? 6 : 0,
          }}
        >
          <Text style={{
            fontFamily: 'PlusJakartaSans-Bold',
            fontSize: 15,
            color: canStart ? '#fff' : Colors.inkMuted,
          }}>
            {isLoading ? 'Starting...' : 'Start Chat'}
          </Text>
        </Pressable>
      </View>
    </View>
  )
}

// ── Main Screen ───────────────────────────────────────────────────────────────

export default function ChatScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { data: sessions, isLoading } = useChatSessions()
  const { data: courses } = useCourses()
  const { isOnline } = useNetworkStatus()

  const [filter, setFilter] = useState<FilterType>('all')
  const [showNewSession, setShowNewSession] = useState(false)

  if (isLoading) return <ScreenLoader />

  const filteredSessions = sessions?.filter(s => {
    if (filter === 'all') return true
    return s.type === filter
  }) ?? []

  if(!isOnline){
    return <OfflineState message="You appear to be offline. Chat with Alice requires an internet connection."/>
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bgApp }}>

      {/* Header */}
      <View style={{
        paddingHorizontal: 20,
        paddingTop: insets.top + 16,
        paddingBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Text style={{
          fontFamily: 'PlusJakartaSans-ExtraBold',
          fontSize: 24,
          color: Colors.inkHeading,
          letterSpacing: -0.4,
        }}>
          Chat
        </Text>
        <Pressable
          onPress={() => setShowNewSession(true)}
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            backgroundColor: Colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: Colors.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.28,
            shadowRadius: 8,
            elevation: 6,
          }}
        >
          <Ionicons name="add" size={22} color="#fff" />
        </Pressable>
      </View>

      {/* Filter tabs */}
      <View style={{
        flexDirection: 'row',
        marginHorizontal: 20,
        backgroundColor: Colors.bgBoard,
        borderRadius: 12,
        padding: 4,
        marginBottom: 16,
      }}>
        <FilterTab label="All" active={filter === 'all'} onPress={() => setFilter('all')} />
        <FilterTab label="Course" active={filter === 'course_specific'} onPress={() => setFilter('course_specific')} />
        <FilterTab label="General" active={filter === 'general'} onPress={() => setFilter('general')} />
      </View>

      {/* Legend */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        gap: 16,
        marginBottom: 12,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          <View style={{ width: 8, height: 8, borderRadius: 999, backgroundColor: Colors.primary }} />
          <Text style={{ fontFamily: 'PlusJakartaSans-Medium', fontSize: 12, color: Colors.inkSecondary }}>
            Course
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          <View style={{ width: 8, height: 8, borderRadius: 999, backgroundColor: Colors.purple }} />
          <Text style={{ fontFamily: 'PlusJakartaSans-Medium', fontSize: 12, color: Colors.inkSecondary }}>
            General
          </Text>
        </View>
      </View>

      {/* Sessions list or empty state */}
      {filteredSessions.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
          <View style={{
            width: 72,
            height: 72,
            borderRadius: 20,
            backgroundColor: Colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
            overflow: 'hidden',
          }}>
            <Image
              source={require('../../../assets/images/alicetutor-icon-512.png')}
              style={{ width: 72, height: 72 }}
              resizeMode="cover"
            />
          </View>
          <Text style={{
            fontFamily: 'PlusJakartaSans-ExtraBold',
            fontSize: 18,
            color: Colors.inkHeading,
            marginBottom: 8,
            textAlign: 'center',
          }}>
            Start a conversation with Alice
          </Text>
          <Text style={{
            fontFamily: 'PlusJakartaSans-Medium',
            fontSize: 14,
            color: Colors.inkSecondary,
            textAlign: 'center',
            lineHeight: 21,
            marginBottom: 24,
          }}>
            Ask about a specific course or open a general study chat — Alice remembers your quiz history.
          </Text>
          <Pressable
            onPress={() => setShowNewSession(true)}
            style={{
              backgroundColor: Colors.primary,
              borderRadius: 14,
              paddingVertical: 14,
              paddingHorizontal: 24,
              shadowColor: Colors.primary,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.28,
              shadowRadius: 16,
              elevation: 6,
            }}
          >
            <Text style={{ fontFamily: 'PlusJakartaSans-Bold', fontSize: 14, color: '#fff' }}>
              + New session
            </Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
        >
          {filteredSessions.map(session => (
            <SessionCard
              key={session._id}
              session={session}
              onPress={() => router.push(`/(screens)/chat/${session._id}`)}
            />
          ))}
        </ScrollView>
      )}

      {/* New session modal */}
      <NewSessionModal
        visible={showNewSession}
        onClose={() => setShowNewSession(false)}
        courses={courses as CourseData[]}
      />
    </View>
  )
}