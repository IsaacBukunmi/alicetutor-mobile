import AsyncStorage from "@react-native-async-storage/async-storage";

const CACHE_PREFIX = 'alicetutor_cache_'

export const offlineCache = {
    async set<T>(key: string, data:T): Promise<void> {
        try {
            const payload = JSON.stringify({
                data,
                cachedAt: new Date().toISOString()
            })
            await AsyncStorage.setItem(`${CACHE_PREFIX}${key}`, payload)
        } catch (error) {
            console.warn('Cache write failed:', error)
        }
    },

    async get<T>(key: string): Promise<T | null> {
        try {
            const raw = await AsyncStorage.getItem(`${CACHE_PREFIX}${key}`)
            if(!raw) return null
            const { data } = JSON.parse(raw)
            return data as T
        } catch (error) {
            console.warn('Cache read failed:', error)
            return null
        }
    },

    async remove(key: string): Promise<void> {
        try {
            await AsyncStorage.removeItem(`${CACHE_PREFIX}${key}`)
        } catch (error) {
            console.warn('Cache remove failed:', error)
        }
    }
}