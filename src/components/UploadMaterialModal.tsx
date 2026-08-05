import { Colors } from "@/constants"
import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import * as DocumentPicker from 'expo-document-picker'
import { uploadMaterial } from "@/api/course"
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import OnboardingInput from "./OnboardingInput"
import LoadingSpinner from "./LoadingSpinner"


type Props = {
    visible: boolean
    onClose: () => void
    courseId: string
}

type PickedFile = {
    uri: string
    name: string
    type: string
    size: number
}

const getFileTypeBadge = (name: string) => {
    const ext = name.split('.').pop()?.toLowerCase()
    switch(ext){
        case 'pdf': return { label: 'PDF', bg: '#FDECEC', color: Colors.red }
        case 'docx': return { label: 'DOCX', bg: Colors.indigoSoft, color: Colors.indigo }
        case 'pptx': return { label: 'PPTX', bg: Colors.amberSoft, color: Colors.amberText }
        default: return { label: 'TXT', bg: Colors.divider, color: Colors.inkSecondary } 
    }
}

const formatFileSize = (bytes: number) => {
    if(bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function UploadMaterialModal({ visible, onClose, courseId }: Props){
    const queryClient = useQueryClient()

    const [title, setTitle] = useState('')
    const [file, setFile] = useState<PickedFile | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState('')

    const canUpload = title.trim().length > 0 && file !== null

    const handlePickFile = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: [
                    'application/pdf',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                    'text/plain',
                ],
                copyToCacheDirectory: true
            })

            if(!result.canceled && result.assets.length > 0){
                const assets = result.assets[0]
                setFile({
                    uri: assets.uri,
                    name: assets.name,
                    type: assets.mimeType ?? 'application/octet-stream',
                    size: assets.size ?? 0
                })
            }
        } catch (error) {
            setError('Failed to pick file. Please try again.')
        }
    }

    const handleUpload = async () => {
        if(!file) return
        setIsLoading(true)
        setError("")
        try {
            await uploadMaterial(courseId, {
                title: title.trim(),
                file: {
                    uri: file.uri,
                    name: file.name,
                    type: file.type
                }
            })
            queryClient.invalidateQueries({
                queryKey:['course-materials', courseId]
            })
            queryClient.invalidateQueries({
                queryKey: ['dashboard']
            })
            setIsSuccess(true)
        } catch (error: any) {
            setError(error.response?.data?.message ?? 'Upload failed. Please try again.')
        }finally{
            setIsLoading(false)
        }
    }

    const handleClose = () => {
        setTitle('')
        setFile(null)
        setIsSuccess(false)
        setError('')
        onClose()
    }

    const badge = file ? getFileTypeBadge(file.name) : null

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={handleClose}
        >
            <KeyboardAvoidingView
                style={{ flex: 1, backgroundColor: Colors.bgApp }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 32 }}>
    
                    {/* Header */}
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 28,
                        paddingTop:Platform.OS === "android" ? 30 : 0
                    }}>
                        <Pressable
                            onPress={handleClose}
                            style={{
                                width: 36,
                                height: 36,
                                borderRadius: 10,
                                backgroundColor: Colors.bgBoard,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: 12,
                            }}
                        >
                        <Ionicons name="close" size={18} color={Colors.inkHeading} />
                        </Pressable>
                        <Text style={{
                            fontFamily: 'PlusJakartaSans-ExtraBold',
                            fontSize: 17,
                            color: Colors.inkHeading,
                        }}>
                            Upload material
                        </Text>
                    </View>
        
                    {/* Title input */}
                    <View style={{ marginBottom: 20 }}>
                        <OnboardingInput
                            label="Title"
                            value={title}
                            onChangeText={setTitle}
                            placeholder="e.g. Lecture 7 — Scheduling"
                            autoCapitalize="words"
                        />
                    </View>
        
                    {/* File picker */}
                    <View style={{ marginBottom: 24 }}>
                        <Text style={{
                            fontFamily: 'PlusJakartaSans-SemiBold',
                            fontSize: 13,
                            color: Colors.inkSecondary,
                            marginBottom: 8,
                        }}>
                        File
                        </Text>
        
                        {file ? (
                        // File picked state
                        <Pressable
                            onPress={handlePickFile}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: Colors.bgCard,
                                borderRadius: 12,
                                padding: 14,
                                gap: 12,
                                borderWidth: 1,
                                borderColor: Colors.borderInput,
                            }}
                        >
                            <View style={{
                                width: 40,
                                height: 40,
                                borderRadius: 10,
                                backgroundColor: badge?.bg,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                            <Text style={{
                                fontFamily: 'PlusJakartaSans-Bold',
                                fontSize: 10,
                                color: badge?.color,
                            }}>
                                {badge?.label}
                            </Text>
                            </View>
                            <View style={{ flex: 1 }}>
                            <Text
                                style={{
                                    fontFamily: 'PlusJakartaSans-Bold',
                                    fontSize: 14,
                                    color: Colors.inkHeading,
                                    marginBottom: 2,
                                }}
                                numberOfLines={1}
                            >
                                {file.name}
                            </Text>
                            <Text style={{
                                fontFamily: 'PlusJakartaSans-Medium',
                                fontSize: 12,
                                color: Colors.inkSecondary,
                            }}>
                                {formatFileSize(file.size)}
                            </Text>
                            </View>
                            <Ionicons name="swap-horizontal-outline" size={18} color={Colors.inkMuted} />
                        </Pressable>
                        ) : (
                        // Empty state
                        <Pressable
                            onPress={handlePickFile}
                            style={{
                                borderWidth: 1.5,
                                borderColor: Colors.borderInput,
                                borderStyle: 'dashed',
                                borderRadius: 14,
                                paddingVertical: 36,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: Colors.bgCard,
                                gap: 10,
                            }}
                        >
                            <View style={{
                                width: 44,
                                height: 44,
                                borderRadius: 12,
                                backgroundColor: Colors.blueSoft,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                            <Ionicons name="cloud-upload-outline" size={22} color={Colors.primary} />
                            </View>
                            <Text style={{
                            fontFamily: 'PlusJakartaSans-Bold',
                            fontSize: 14,
                            color: Colors.inkHeading,
                            }}>
                            Tap to browse files
                            </Text>
                            <Text style={{
                            fontFamily: 'PlusJakartaSans-Medium',
                            fontSize: 12.5,
                            color: Colors.inkMuted,
                            }}>
                            PDF, DOCX, PPTX or TXT · up to 20 MB
                            </Text>
                        </Pressable>
                        )}
                    </View>
        
                    {/* Success banner */}
                    {isSuccess && (
                        <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: Colors.greenSoft,
                        borderRadius: 12,
                        padding: 14,
                        gap: 10,
                        marginBottom: 20,
                        }}>
                        <Ionicons name="checkmark-circle" size={18} color={Colors.green} />
                        <Text style={{
                            fontFamily: 'PlusJakartaSans-SemiBold',
                            fontSize: 13,
                            color: Colors.greenText,
                            flex: 1,
                        }}>
                            Uploaded! Alice is generating quizzes & flashcards...
                        </Text>
                        </View>
                    )}
        
                    {/* Error banner */}
                    {error.length > 0 && (
                        <View style={{
                        backgroundColor: Colors.redSoft,
                        borderRadius: 10,
                        padding: 12,
                        marginBottom: 16,
                        }}>
                        <Text style={{
                            fontFamily: 'PlusJakartaSans-Medium',
                            fontSize: 13,
                            color: Colors.redText,
                            textAlign: 'center',
                        }}>
                            {error}
                        </Text>
                        </View>
                    )}
        
                    <View style={{ flex: 1 }} />
        
                    {/* Action button */}
                    <Pressable
                        onPress={isSuccess ? handleClose : handleUpload}
                        disabled={!isSuccess && (!canUpload || isLoading)}
                        style={{
                        backgroundColor: isSuccess
                            ? Colors.green
                            : canUpload
                            ? Colors.primary
                            : Colors.divider,
                        borderRadius: 14,
                        paddingVertical: 16,
                        alignItems: 'center',
                        shadowColor: isSuccess ? Colors.green : canUpload ? Colors.primary : 'transparent',
                        shadowOffset: { width: 0, height: 10 },
                        shadowOpacity: isSuccess || canUpload ? 0.28 : 0,
                        shadowRadius: 22,
                        elevation: isSuccess || canUpload ? 8 : 0,
                        }}
                    >
                        {isLoading ? (
                        <LoadingSpinner color="#fff" />
                        ) : (
                        <Text style={{
                            fontFamily: 'PlusJakartaSans-Bold',
                            fontSize: 15,
                            color: isSuccess || canUpload ? '#fff' : Colors.inkMuted,
                        }}>
                            {isSuccess ? 'Done' : 'Upload'}
                        </Text>
                        )}
                    </Pressable>
        
                </View>
            </ScrollView>
            </KeyboardAvoidingView>
        </Modal>
    )

}