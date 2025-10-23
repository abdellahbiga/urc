import React from 'react'
import { useSessionStore } from '../store/useSessionStore'

function ChatPage() {
    const session = useSessionStore((state) => state.session)

    return (
        <div style={{ padding: 20 }}>
            <h1>Bienvenue sur la messagerie 👋</h1>
            <p>Connecté en tant que : <strong>{session?.username}</strong></p>
        </div>
    )
}

export default ChatPage
