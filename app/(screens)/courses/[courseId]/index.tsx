import { deleteCourse } from '@/api/course'
import CourseFormModal from '@/components/CourseFormModal'
import ScreenLoader from '@/components/ScreenLoader'
import SpinnerIcon from '@/components/SpinnerIcon'
import UploadMaterialModal from '@/components/UploadMaterialModal'
import { Colors } from '@/constants'
import { useCourse, useCourseMaterials, useCourseProgress } from '@/hooks/useCourses'
import { Material } from '@/types'
import { Ionicons } from '@expo/vector-icons'
import { useQueryClient } from '@tanstack/react-query'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'
import { View, Text, ScrollView, StyleSheet, Pressable, Modal, Alert, RefreshControl, ActivityIndicator } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const getDaysToExam = (examDate: string | null | undefined) => {
	if (!examDate) return null
	const diff = new Date(examDate).getTime() - Date.now()
	return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

const getFileTypeBadge = (fileType: string) => {
	switch (fileType.toLowerCase()) {
	  case 'pdf': return { label: 'PDF', bg: '#FDECEC', color: Colors.red }
	  case 'docx': return { label: 'DOCX', bg: Colors.indigoSoft, color: Colors.indigo }
	  case 'pptx': return { label: 'PPTX', bg: Colors.amberSoft, color: Colors.amberText }
	  default: return { label: 'TXT', bg: Colors.inkMuted ?? Colors.divider, color: Colors.inkSecondary }
	}
}

const getMasteryColor = (accuracy: number) => {
	if (accuracy >= 70) return Colors.green
	if (accuracy >= 50) return Colors.amber
	return Colors.red
}
  

function ActionButton({icon, label, onPress, iconColor="#000", active}:{ icon: string, label: string, iconColor?: string, onPress:() => void, active?: boolean}){
	return(
		<Pressable
			onPress={onPress}
			style={{
				flex: 1,
				backgroundColor: active ? Colors.primary : Colors.bgCard,
				borderRadius: 14,
				paddingVertical: 14,
				alignItems: 'center',
				gap: 6,
				shadowColor: active ? Colors.primary : '#000',
				shadowOffset: { width: 0, height: active ? 6 : 2 },
				shadowOpacity: active ? 0.25 : 0.04,
				shadowRadius: active ? 12 : 6,
				elevation: active ? 6 : 2,
			}}
		>
			 <Ionicons
				name={icon as any}
				size={22}
				color={active ? '#fff' : iconColor}
			/>
			<Text style={{
				fontFamily: 'PlusJakartaSans-Bold',
				fontSize: 12.5,
				color: active ? '#fff' : Colors.inkHeading,
			}}>
				{label}
			</Text>
		</Pressable>
	)
}

function MaterialRow({ material, onPress }: { material: Material; onPress: () => void }) {
	const badge = getFileTypeBadge(material.fileType)

	return (
		<Pressable 
			style={styles.materialRowCtn}
			onPress={onPress}
		>
			<View style={[styles.badgeCtn, {backgroundColor: badge.bg,}]}>
				<Text style={{
					fontFamily: 'PlusJakartaSans-Bold',
					fontSize: 10,
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
					marginBottom: 2,
				}}>
					{material.title}
				</Text>
				{
					material.isProcessed ? (
					<View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
						<View style={{ width: 6, height: 6, borderRadius: 999, backgroundColor: Colors.green }} />
						<Text style={{ fontFamily: 'PlusJakartaSans-Medium', fontSize: 12, color: Colors.green }}>
						Ready
						</Text>
					</View>
					) : (
					<View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
						<SpinnerIcon size={12} color={Colors.amberText} />
						<Text style={{ fontFamily: 'PlusJakartaSans-Medium', fontSize: 12, color: Colors.amberText }}>
						Processing...
						</Text>
					</View>
				)}
			</View>
			<Ionicons name="chevron-forward" size={16} color={Colors.inkMuted} />
		</Pressable>
	)
}

const CourseDetails = () => {
	const { courseId } = useLocalSearchParams<{ courseId: string }>()
	const insets = useSafeAreaInsets()
	const router = useRouter()
	const [menuVisible, setMenuVisible] = useState(false)
	const [modalVisible, setModalVisible] = useState(false)
	const [uploadModalVisible, setUploadModalVisible] = useState(false)
	const queryClient = useQueryClient()
	const [refreshing, setRefreshing] = useState(false)


	const { data: course, isLoading: courseLoading } = useCourse(courseId)
	const { data: progress } = useCourseProgress(courseId) 
	const { data:materials } = useCourseMaterials(courseId)

	const daysToExam = getDaysToExam(course?.examDate)

	const handleDelete = () => {
		Alert.alert(
			'Delete Course',
			`Are you sure you want to delete ${course?.courseName}? This cannot be undone`,
			[
				{text: 'Cancel', style: 'cancel' },
				{
					text: 'Delete',
					style: 'destructive',
					onPress: async () => {
						try {
							await deleteCourse(courseId)
							queryClient.invalidateQueries({ queryKey: ['courses'] })
							router.back()
						} catch {
							Alert.alert('Error', 'Failed to delete course. Please try again.')
						}
					}
				}
			]
		)
	}

	const handleRefresh = async () => {
		setRefreshing(true)
		await queryClient.invalidateQueries({
			queryKey:['course-materials', courseId]
		})
		setRefreshing(false)
	}

	if(courseLoading) return <ScreenLoader />

    return (
		<View style={{
			backgroundColor: Colors.bgApp,
			flex:1
		}}>
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{paddingBottom: 32}}
				refreshControl={
					<RefreshControl 
						refreshing={refreshing}
						onRefresh={handleRefresh}
						tintColor={Colors.primary}
					/>
				}
			>
				{/* Hero Header */}
				<View style={[styles.topSection, {paddingTop: insets.top + 24 }]}>
					<View style={styles.topNavigation}>
						<Pressable
							onPress={() => router.back()} 
							style={styles.navBtn}
						>
							<Ionicons name='chevron-back' size={22} color={"#fff"}/>
						</Pressable>
						<Text style={styles.navText}>{course?.courseCode}</Text>
						<Pressable
							onPress={() => setMenuVisible(true)}
							style={styles.navBtn}
						>
							<Ionicons name='ellipsis-horizontal' size={22} color={"#fff"}/>
						</Pressable>
					</View>
					<View>
						<Text style={styles.courseTitle}>{course?.courseName}</Text>
						<Text style={styles.courseInfo}>
							{course?.lecturerName} · {course?.courseUnit} units
						</Text>
					</View>
					<View style={styles.courseStats}>
						<View style={styles.statsPill}>
							<Text style={styles.statValue}>{daysToExam !== null ? `${daysToExam}d` : '-'}</Text>
							<Text style={styles.statLabel}>To exam</Text>
						</View>
						<View style={styles.statsPill}>
							<Text style={styles.statValue}>{progress ? `${progress.overallAccuracy}%` : '-'}</Text>
							<Text style={styles.statLabel}>Accuracy</Text>
						</View>
						<View style={styles.statsPill}>
							<Text style={styles.statValue}>{progress ? `${progress.totalAttempts}` : '-'}</Text>
							<Text style={styles.statLabel}>Quizzes</Text>
						</View>
					</View>
				</View>
				<View style={{ paddingHorizontal: 24, paddingTop: 20 }}>

					{/* Action Buttons */}
					<View style={{ flexDirection: 'row', gap: 10, marginBottom: 28 }}>
						<ActionButton
							icon="checkmark-circle-outline"
							label="Take Quiz"
							onPress={() => router.push(`/(screens)/courses/${courseId}/quiz`)}
							active
						/>
						<ActionButton
							icon="albums-outline"
							label="Flashcards"
							onPress={() => router.push(`/courses/${courseId}/flashcard`)}
							iconColor={Colors.indigo}
						/>
						<ActionButton
							icon="chatbubble-ellipses-outline"
							label="Ask Alice"
							onPress={() => router.push('/(main)/chat')}
							iconColor={Colors.primary}
						/>
					</View>

					{/* Materials */}
					<View style={{ marginBottom: 28 }}>
						<View style={styles.materialHeader}>
							<Text style={styles.materialText}>Materials</Text>
							<Pressable
								onPress={() => setUploadModalVisible(true)}
							>
								<Text style={styles.materialBtn}> + Upload</Text>
							</Pressable>
						</View>
						<View style={styles.materialCardCtn}>
							{
								materials && materials.length > 0 ? (
								materials.map((material: Material, index: number) => (
									<MaterialRow 
										key={material._id} 
										material={material} 
										onPress={() => router.push(`/courses/${courseId}/material/${material._id}`)}
									/>
								))
							) : (
								<View style={{ paddingVertical: 24, alignItems: 'center' }}>
									<Text style={{
										fontFamily: 'PlusJakartaSans-Medium',
										fontSize: 14,
										color: Colors.inkMuted,
									}}>
										No materials uploaded yet
									</Text>
								</View>
							)}
						</View>
					</View>
					{/* Progress by topic */}
				{progress && progress.progressByMaterial.length > 0 && (
					<View style={{ marginBottom: 28 }}>
						<Text style={styles.progressTopic}>
							Progress by topic
						</Text>
						<View style={styles.progressCardCtn}>
							{
								progress.progressByMaterial.map((item) => {
								const color = getMasteryColor(item.bestAccuracy)
									return (
										<View key={item.materialId}>
										<View style={styles.progressCardTop}>
											<Text style={styles.progressTitle}>
											{item.title}
											</Text>
											<Text style={[styles.progressAccuracy, {color}]}>
											{item.bestAccuracy}%
											</Text>
										</View>
										<View style={{
											height: 6,
											borderRadius: 999,
											backgroundColor: Colors.divider,
										}}>
											<View style={{
												width: `${item.bestAccuracy}%`,
												height: 6,
												borderRadius: 999,
												backgroundColor: color,
											}} />
										</View>
										</View>
									)
								})
							}
						</View>
					</View>
				)}
				</View>
			</ScrollView>
			<Modal
				visible={menuVisible}
				transparent
				animationType="fade"
				onRequestClose={() => setMenuVisible(false)}
			>
				<Pressable
					style={{ flex: 1 }}
					onPress={() => setMenuVisible(false)}
				>
					<View style={[styles.modalView, {top: insets.top + 60}]}>
						<Pressable
							onPress={() => {
								setMenuVisible(false)
								setModalVisible(true)
							}}
							style={styles.modalEdit}
						>
							<Ionicons name="pencil-outline" size={18} color={Colors.inkHeading} />
							<Text style={styles.modalEditText}>
								Edit Course
							</Text>
						</Pressable>

						<Pressable
							onPress={() => {
								setMenuVisible(false)
								handleDelete()
							}}
							style={styles.modalDelete}
						>
							<Ionicons name="trash-outline" size={18} color={Colors.red} />
							<Text style={styles.modalDeleteText}>
								Delete Course
							</Text>
						</Pressable>
					</View>
				</Pressable>
			</Modal>
			<CourseFormModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
				course={course}
            />
			<UploadMaterialModal
				visible={uploadModalVisible}
				onClose={() => setUploadModalVisible(false)}
				courseId={courseId}
			/>
		</View>
    )
}

const styles = StyleSheet.create({
	topSection:{
		backgroundColor: Colors.primary,
		paddingHorizontal: 24,
		paddingBottom:24
	},
	topNavigation:{
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 20,
	},
	navBtn:{
		width: 38,
		height: 38,
		borderRadius: 10,
		backgroundColor: 'rgba(255,255,255,0.15)',
		alignItems: 'center',
		justifyContent: 'center',
	},
	navText:{
		fontFamily: 'PlusJakartaSans-Bold',
		fontSize: 15,
		color: '#fff',
	},
	courseTitle:{
		fontFamily: 'PlusJakartaSans-ExtraBold',
		fontSize: 22,
		color: '#fff',
		letterSpacing: -0.4,
		marginBottom: 4,
	},
	courseInfo: {
		fontFamily: 'PlusJakartaSans-Medium',
		fontSize: 13,
		color: 'rgba(255,255,255,0.75)',
		marginBottom: 20,
	},
	courseStats: {
		flexDirection: 'row', 
		gap: 10 
	},
	statsPill: {
		flex: 1,
		backgroundColor: 'rgba(255,255,255,0.15)',
		borderRadius: 12,
		padding: 12,
		alignItems: 'center',
	},
	statValue: {
		fontFamily: 'PlusJakartaSans-ExtraBold',
        fontSize: 18,
        color: '#fff',
        marginBottom: 2,
	},
	statLabel:{
		fontFamily: 'PlusJakartaSans-Medium',
        fontSize: 11,
        color: 'rgba(255,255,255,0.75)',
	},
	materialHeader:{
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 12,
	},
	materialText:{
		fontFamily: 'PlusJakartaSans-ExtraBold',
		fontSize: 17,
		color: Colors.inkHeading,
	},
	materialBtn:{
		fontFamily: 'PlusJakartaSans-Bold',
		fontSize: 13,
		color: Colors.primary,
	},
	materialCardCtn:{
		backgroundColor: Colors.bgCard,
		borderRadius: 16,
		paddingHorizontal: 16,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.04,
		shadowRadius: 8,
		elevation: 2,
	},
	materialRowCtn:{
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderBottomColor: Colors.divider,
		gap: 12,
	},
	badgeCtn:{
		width: 40,
		height: 40,
		borderRadius: 10,
		alignItems: 'center',
		justifyContent: 'center',
	},
	progressTopic:{
		fontFamily: 'PlusJakartaSans-ExtraBold',
		fontSize: 17,
		color: Colors.inkHeading,
		marginBottom: 12,
	},
	progressCardCtn:{
		backgroundColor: Colors.bgCard,
		borderRadius: 16,
		padding: 16,
		gap: 16,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.04,
		shadowRadius: 8,
		elevation: 2,
	},
	progressCardTop:{
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 8,
	},
	progressTitle:{
		fontFamily: 'PlusJakartaSans-SemiBold',
		fontSize: 14,
		color: Colors.inkHeading,
		flex: 1,
		marginRight: 8,
	},
	progressAccuracy:{
		fontFamily: 'PlusJakartaSans-Bold',
		fontSize: 13,
	},
	modalView:{
		position: 'absolute',
		right: 20,
		backgroundColor: Colors.bgCard,
		borderRadius: 14,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 8 },
		shadowOpacity: 0.12,
		shadowRadius: 16,
		elevation: 8,
		overflow: 'hidden',
		minWidth: 180,
	},
	modalEdit:{
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
		paddingHorizontal: 16,
		paddingVertical: 14,
		borderBottomWidth: 1,
		borderBottomColor: Colors.divider,
	},
	modalEditText:{
		fontFamily: 'PlusJakartaSans-SemiBold',
		fontSize: 14,
		color: Colors.inkHeading,
	},
	modalDelete:{
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
		paddingHorizontal: 16,
		paddingVertical: 14,
	},
	modalDeleteText:{
		fontFamily: 'PlusJakartaSans-SemiBold',
		fontSize: 14,
		color: Colors.red,
	}
})

export default CourseDetails