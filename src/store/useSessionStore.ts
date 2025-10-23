import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Session {
    id?: number
    username?: string
    externalId?: string
    token: string
}

interface SessionStore {
    session: Session | null
    setSession: (session: Session) => void
    clearSession: () => void
}

export const useSessionStore = create<SessionStore>()(
    persist(
        (set) => ({
            session: null,
            setSession: (session) => set({ session }),
            clearSession: () => set({ session: null }),
        }),
        {
            name: 'session-storage',
        }
    )
)
