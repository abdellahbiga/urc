// src/store/useChatStore.ts
import { create } from 'zustand'
import { UserPublic, Message } from '../model/common'

interface ChatStore {
    // Messages & rooms
    messages: Message[]
    selectedRoom: string | null
    selectedUser: UserPublic | null
    setMessages: (messages: Message[]) => void
    addMessage: (message: Message) => void
    setSelectedRoom: (room: string | null) => void
    setSelectedUser: (user: UserPublic | null) => void

    // Utilisateurs
    users: UserPublic[]
    setUsers: (users: UserPublic[]) => void
}

export const useChatStore = create<ChatStore>((set) => ({
    messages: [],
    selectedRoom: null,
    selectedUser: null,
    setMessages: (messages) => set({ messages }),
    addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
    setSelectedRoom: (room) => set({ selectedRoom: room }),
    setSelectedUser: (user) => set({ selectedUser: user }),
    users: [],
    setUsers: (users) => set({ users }),
}))

// ⚠️ Exporter Message depuis le modèle commun
export type { Message }
