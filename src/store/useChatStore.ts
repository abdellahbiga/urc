// src/store/useChatStore.ts
import { create } from 'zustand'
import { UserPublic } from '../model/common'

// === Types ===
export interface Message {
    id: string
    senderId: string   // ⚡️ renommé pour correspondre aux données du serveur
    content: string
    timestamp: string
}

interface ChatStore {
    // --- Messages & salons ---
    selectedRoom: string | null
    messages: Message[]
    setSelectedRoom: (room: string) => void
    setMessages: (messages: Message[]) => void
    addMessage: (message: Message) => void

    // --- Utilisateurs ---
    users: UserPublic[]
    selectedUser: UserPublic | null
    setUsers: (users: UserPublic[]) => void
    selectUser: (user: UserPublic | null) => void
    setSelectedUser: (user: UserPublic | null) => void
}

// === Store Zustand ===
export const useChatStore = create<ChatStore>((set) => ({
    // --- Messages & salons ---
    selectedRoom: null,
    messages: [],
    setSelectedRoom: (room) => set({ selectedRoom: room }),
    setMessages: (messages) => set({ messages }),
    addMessage: (message) =>
        set((state) => ({ messages: [...state.messages, message] })),

    // --- Utilisateurs ---
    users: [],
    selectedUser: null,
    setUsers: (users) => set({ users }),
    selectUser: (user) => set({ selectedUser: user }),
    setSelectedUser: (user) => set({ selectedUser: user }),
}))
