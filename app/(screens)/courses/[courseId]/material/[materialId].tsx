import { View, Text, ScrollView, Pressable } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useCourseMaterials, useCourseProgress } from '@/hooks/useCourses'
import ScreenLoader from '@/components/ScreenLoader'
import { Colors } from '@/constants'
import { Material } from '@/types'

// ── Helpers ───────────────────────────────────────────────────────────────────

const getFileTypeBadge = (fileType: string) => {
  switch (fileType.toLowerCase()) {
    case 'pdf':  return { label: 'PDF',  bg: '#FDECEC', color: Colors.red }
    case 'docx': return { label: 'DOCX', bg: Colors.indigoSoft, color: Colors.indigo }
    case 'pptx': return { label: 'PPTX', bg: Colors.amberSoft, color: Colors.amberText }
    default:     return { label: 'TXT',  bg: Colors.divider, color: Colors.inkSecondary }
  }
}

const formatUploadDate = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Uploaded today'
  if (days === 1) return 'Uploaded yesterday'
  return `Uploaded ${days} days ago`
}

const getMasteryColor = (accuracy: number) => {
  if (accuracy >= 70) return Colors.green
  if (accuracy >= 50) return Colors.amber
  return Colors.red
}

const getKeyTopics = (material: Material): string[] => {
  if (!material.flashcards || material.flashcards.length === 0) return []
  return material.flashcards.slice(0, 4).map(f => f.front)
}

// ── Main Screen ───────────────────────────────────────────────────────────────

export default function MaterialDetailScreen() {
  const { courseId, materialId } = useLocalSearchParams<{
    courseId: string
    materialId: string
  }>()
  const router = useRouter()
  const insets = useSafeAreaInsets()

  const { data: materials, isLoading: materialsLoading } = useCourseMaterials(courseId)
  const { data: progress, isLoading: progressLoading } = useCourseProgress(courseId)

  if (materialsLoading || progressLoading) return <ScreenLoader />

  const material = materials?.find((m: Material) => m._id === materialId)
  if (!material) return null

  const badge = getFileTypeBadge(material.fileType)
  const keyTopics = getKeyTopics(material)

  // Derive stats from course progress
  const materialProgress = progress?.progressByMaterial.find(
    p => p.materialId.toString() === materialId
  )
  const accuracy = materialProgress?.bestAccuracy ?? 0
  const quizCount = materialProgress?.attempts ?? 0
  const flashcardCount = material.flashcards?.length ?? 0
  const masteryColor = getMasteryColor(accuracy)

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bgApp }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Header */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingTop: insets.top + 12,
          paddingBottom: 16,
          gap: 12,
        }}>
          <Pressable
            onPress={() => router.back()}
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              backgroundColor: Colors.bgCard,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.06,
              shadowRadius: 6,
              elevation: 2,
            }}
          >
            <Ionicons name="chevron-back" size={20} color={Colors.inkHeading} />
          </Pressable>
          <Text
            style={{
              fontFamily: 'PlusJakartaSans-Bold',
              fontSize: 15,
              color: Colors.inkHeading,
              flex: 1,
            }}
            numberOfLines={1}
          >
            {material.title}
          </Text>
        </View>

        <View style={{ paddingHorizontal: 20 }}>

          {/* File info card */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: Colors.bgCard,
            borderRadius: 16,
            padding: 14,
            gap: 12,
            marginBottom: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.04,
            shadowRadius: 8,
            elevation: 2,
          }}>
            <View style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              backgroundColor: badge.bg,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Text style={{
                fontFamily: 'PlusJakartaSans-Bold',
                fontSize: 11,
                color: badge.color,
              }}>
                {badge.label}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{
                fontFamily: 'PlusJakartaSans-Bold',
                fontSize: 14,
                color: Colors.inkHeading,
                marginBottom: 3,
              }}
                numberOfLines={1}
              >
                {material.title}
              </Text>
              <Text style={{
                fontFamily: 'PlusJakartaSans-Medium',
                fontSize: 12,
                color: Colors.inkSecondary,
              }}>
                {formatUploadDate(material.createdAt)}
              </Text>
            </View>
          </View>

          {/* Stats row */}
          <View style={{
            flexDirection: 'row',
            gap: 10,
            marginBottom: 24,
          }}>
            {[
              { value: `${accuracy}%`, label: 'Accuracy' },
              { value: quizCount,      label: 'Quizzes' },
              { value: flashcardCount, label: 'Flashcards' },
            ].map(({ value, label }) => (
              <View
                key={label}
                style={{
                  flex: 1,
                  backgroundColor: Colors.bgCard,
                  borderRadius: 14,
                  padding: 14,
                  alignItems: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.04,
                  shadowRadius: 8,
                  elevation: 2,
                }}
              >
                <Text style={{
                  fontFamily: 'PlusJakartaSans-ExtraBold',
                  fontSize: 20,
                  color: Colors.inkHeading,
                  marginBottom: 3,
                }}>
                  {value}
                </Text>
                <Text style={{
                  fontFamily: 'PlusJakartaSans-Medium',
                  fontSize: 12,
                  color: Colors.inkSecondary,
                }}>
                  {label}
                </Text>
              </View>
            ))}
          </View>

          {/* AI Summary */}
          {material.summary && material.summary.length > 0 && (
            <View style={{ marginBottom: 24 }}>
              <Text style={{
                fontFamily: 'PlusJakartaSans-ExtraBold',
                fontSize: 17,
                color: Colors.inkHeading,
                marginBottom: 12,
              }}>
                AI summary
              </Text>
              <View style={{
                backgroundColor: Colors.bgCard,
                borderRadius: 16,
                padding: 16,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.04,
                shadowRadius: 8,
                elevation: 2,
              }}>
                <Text style={{
                  fontFamily: 'PlusJakartaSans-Medium',
                  fontSize: 14,
                  color: Colors.inkBody,
                  lineHeight: 22,
                }}>
                  {material.summary}
                </Text>
              </View>
            </View>
          )}

          {/* Key topics */}
          {keyTopics.length > 0 && (
            <View style={{ marginBottom: 24 }}>
              <Text style={{
                fontFamily: 'PlusJakartaSans-ExtraBold',
                fontSize: 17,
                color: Colors.inkHeading,
                marginBottom: 12,
              }}>
                Key topics
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {keyTopics.map((topic, index) => (
                  <View
                    key={index}
                    style={{
                      backgroundColor: Colors.blueSoft,
                      borderRadius: 999,
                      paddingHorizontal: 14,
                      paddingVertical: 7,
                    }}
                  >
                    <Text style={{
                      fontFamily: 'PlusJakartaSans-SemiBold',
                      fontSize: 13,
                      color: Colors.primary,
                    }}>
                      {topic}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Progress */}
          {materialProgress && (
            <View style={{ marginBottom: 24 }}>
              <Text style={{
                fontFamily: 'PlusJakartaSans-ExtraBold',
                fontSize: 17,
                color: Colors.inkHeading,
                marginBottom: 12,
              }}>
                Your progress
              </Text>
              <View style={{
                backgroundColor: Colors.bgCard,
                borderRadius: 16,
                padding: 16,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.04,
                shadowRadius: 8,
                elevation: 2,
              }}>
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 10,
                }}>
                  <Text style={{
                    fontFamily: 'PlusJakartaSans-SemiBold',
                    fontSize: 13,
                    color: Colors.inkSecondary,
                  }}>
                    Mastery
                  </Text>
                  <Text style={{
                    fontFamily: 'PlusJakartaSans-Bold',
                    fontSize: 13,
                    color: masteryColor,
                  }}>
                    {accuracy}%
                  </Text>
                </View>
                <View style={{
                  height: 8,
                  borderRadius: 999,
                  backgroundColor: Colors.divider,
                }}>
                  <View style={{
                    width: `${accuracy}%`,
                    height: 8,
                    borderRadius: 999,
                    backgroundColor: masteryColor,
                  }} />
                </View>
              </View>
            </View>
          )}

        </View>
        </ScrollView>

        {/* Ask Alice CTA */}
        {/* <View style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            paddingHorizontal: 20,
            paddingBottom: insets.bottom + 16,
            paddingTop: 12,
            backgroundColor: Colors.bgApp,
            borderTopWidth: 1,
            borderTopColor: Colors.divider,
        }}>
            <Pressable
            onPress={() => router.push('/(main)/chat')}
            style={{
                backgroundColor: Colors.primary,
                borderRadius: 14,
                paddingVertical: 16,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
                gap: 8,
                shadowColor: Colors.primary,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.28,
                shadowRadius: 16,
                elevation: 6,
            }}
            >
            <Ionicons name="chatbubble-ellipses-outline" size={18} color="#fff" />
            <Text style={{
                fontFamily: 'PlusJakartaSans-Bold',
                fontSize: 15,
                color: '#fff',
            }}>
                Ask Alice
            </Text>
            </Pressable>
        </View> */}
        {/* Bottom CTAs */}
        <View style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
        paddingBottom: insets.bottom + 16,
        paddingTop: 12,
        backgroundColor: Colors.bgApp,
        borderTopWidth: 1,
        borderTopColor: Colors.divider,
        flexDirection: 'row',
        gap: 12,
        }}>
        <Pressable
            onPress={() => router.push(`/courses/${courseId}/flashcard?materialId=${materialId}`)}
            style={{
            flex: 1,
            paddingVertical: 15,
            borderRadius: 14,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 8,
            backgroundColor: Colors.bgCard,
            borderWidth: 1,
            borderColor: Colors.borderInput,
            }}
        >
            <Ionicons name="albums-outline" size={16} color={Colors.purple} />
            <Text style={{
            fontFamily: 'PlusJakartaSans-Bold',
            fontSize: 14,
            color: Colors.purple,
            }}>
            Flashcards
            </Text>
        </Pressable>

        <Pressable
            onPress={() => router.push('/(main)/chat')}
            style={{
            flex: 1,
            paddingVertical: 15,
            borderRadius: 14,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 8,
            backgroundColor: Colors.primary,
            shadowColor: Colors.primary,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.28,
            shadowRadius: 16,
            elevation: 6,
            }}
        >
            <Ionicons name="chatbubble-ellipses-outline" size={16} color="#fff" />
            <Text style={{
            fontFamily: 'PlusJakartaSans-Bold',
            fontSize: 14,
            color: '#fff',
            }}>
            Ask Alice
            </Text>
        </Pressable>
        </View>
    </View>
  )
}