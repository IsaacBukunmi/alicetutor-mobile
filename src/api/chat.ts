import { apiClient } from './client'

export const getChatSessions = () =>
  apiClient.get('/api/chat/sessions')

export const getChatSession = (sessionId: string) =>
  apiClient.get(`/api/chat/sessions/${sessionId}`)

export const createChatSession = (payload: {
  type: 'general' | 'course_specific'
  courseId?: string
}) => apiClient.post('/api/chat/sessions', payload)

export const sendMessage = (sessionId: string, content: string) =>
  apiClient.post(`/api/chat/sessions/${sessionId}/messages`, { content })

export const deleteSession = (sessionId: string) =>
  apiClient.delete(`/api/chat/sessions/${sessionId}`)

export const renameSession = (sessionId: string, title: string) =>
  apiClient.patch(`/api/chat/sessions/${sessionId}`, { title })