import { useQuery } from '@tanstack/react-query'
import { getChatSessions, getChatSession } from '@/api/chat'
import { ChatSession } from '@/types'

export const useChatSessions = () => {
    return useQuery<ChatSession[]>({
        queryKey: ['chat-sessions'],
        queryFn: async () => {
            const { data } = await getChatSessions()
            return data.session
        },
        staleTime: 1000 * 60 * 2,
    })
}

export const useChatSession = (sessionId: string) => {
    return useQuery<ChatSession>({
        queryKey: ['chat-session', sessionId],
        queryFn: async () => {
            const { data } = await getChatSession(sessionId)
            return data.session
        },
        staleTime: 0,
    })
}