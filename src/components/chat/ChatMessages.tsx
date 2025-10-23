// src/components/chat/ChatMessages.tsx
import React, { useEffect, useRef, useState } from 'react'
import { Box, Typography } from '@mui/material'
import { useChatStore, Message } from '../../store/useChatStore'
import { useParams } from 'react-router-dom'
import { getMessages } from '../../user/userApi'
import { Message as ApiMessage } from '../../model/common'

export default function ChatMessages() {
    const { userId } = useParams<{ userId: string }>()
    const { selectedUser, setMessages } = useChatStore()

    const currentUserId = Number(sessionStorage.getItem('id'))

    const [messages, setMessagesState] = useState<Message[]>(useChatStore.getState().messages)
    const endOfMessagesRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (userId) {
            getMessages(userId)
                .then((data: ApiMessage[]) => {
                    const messagesForStore: Message[] = data.map((msg) => ({
                        id: msg.id || crypto.randomUUID(),
                        senderId: msg.senderId,
                        content: msg.content,
                        timestamp: msg.timestamp,
                    }))
                    setMessagesState(messagesForStore)
                    setMessages(messagesForStore)
                })
                .catch((err) => console.error('Erreur récupération messages :', err))
        }
    }, [userId, setMessages])

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    return (
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 2 }}>
            <Typography variant="h6" gutterBottom>
                Conversation avec {selectedUser?.username || 'Utilisateur'}
            </Typography>

            {/* Conteneur messages avec hauteur max et scroll */}
            <Box
                sx={{
                    flexGrow: 1,
                    overflowY: 'auto',
                    padding: 1,
                    border: '1px solid #ddd',
                    borderRadius: 2,
                    maxHeight: '75vh', // limite la hauteur pour avoir slider si trop de messages
                }}
            >
                {messages.map((msg) => {
                    const isMine = Number(msg.senderId) === currentUserId

                    return (
                        <Box
                            key={msg.id}
                            sx={{
                                display: 'flex',
                                justifyContent: isMine ? 'flex-end' : 'flex-start',
                                mb: 1,
                            }}
                        >
                            <Box
                                sx={{
                                    maxWidth: '70%',
                                    padding: 1.5,
                                    borderRadius: 2,
                                    bgcolor: isMine ? 'primary.main' : 'grey.100',
                                    color: isMine ? 'white' : 'black',
                                    border: '1px solid',
                                    borderColor: isMine ? 'primary.dark' : 'grey.300',
                                    wordBreak: 'break-word',
                                }}
                            >
                                {/*<Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    {isMine ? 'Vous' : selectedUser?.username}    pas besoin d'afficher le nom
                                </Typography>*/}
                                <Typography variant="body1">{msg.content}</Typography>
                                <Typography
                                    variant="caption"
                                    sx={{ display: 'block', mt: 0.5, textAlign: 'right' }}
                                >
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Typography>
                            </Box>
                        </Box>
                    )
                })}

                <div ref={endOfMessagesRef} />
            </Box>
        </Box>
    )
}
