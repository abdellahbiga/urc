import React, { useEffect, useRef } from 'react'
import { Box, Typography } from '@mui/material'
import { useChatStore, Message } from '../../store/useChatStore'
import { useParams } from 'react-router-dom'
import { getMessages } from '../../user/userApi'
import { getRoomMessages } from '../../room/roomApi'
import { Message as ApiMessage } from '../../model/common'
import { UserPublic } from '../../model/common'

export default function ChatMessages() {
    const { userId, roomId } = useParams<{ userId?: string; roomId?: string }>()
    const selectedUser = useChatStore((state) => state.selectedUser)
    const selectedRoom = useChatStore((state) => state.selectedRoom)
    const messages = useChatStore((state) => state.messages)
    const setMessages = useChatStore((state) => state.setMessages)
    const users = useChatStore((state) => state.users) // ⚠ liste de tous les users

    const currentUserId = Number(sessionStorage.getItem('id'))
    const endOfMessagesRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        async function fetchMessages() {
            try {
                let data: ApiMessage[] = []
                if (userId) {
                    data = await getMessages(userId)
                } else if (roomId) {
                    data = await getRoomMessages(roomId)
                }
                const formatted: Message[] = data.map((msg) => ({
                    id: msg.id || crypto.randomUUID(),
                    senderId: msg.senderId,
                    content: msg.content,
                    timestamp: msg.timestamp,
                }))
                setMessages(formatted)
            } catch (err) {
                console.error('Erreur récupération messages :', err)
            }
        }
        fetchMessages()
    }, [userId, roomId, setMessages])

    const getSenderName = (senderId: number) => {
        if (senderId === currentUserId) return 'Vous'
        if (!roomId) return selectedUser?.username || '???' // convo privée
        const user = users.find((u: UserPublic) => Number(u.user_id) === senderId)
        return user?.username || 'Inconnu'
    }

    return (
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 2 }}>
            <Typography variant="h6" gutterBottom>
                {selectedUser
                    ? `Conversation avec ${selectedUser.username}`
                    : selectedRoom
                        ? `Salon : ${selectedRoom}`
                        : 'Aucune conversation'}
            </Typography>

            <Box
                sx={{
                    flexGrow: 1,
                    overflowY: 'auto',
                    padding: 1,
                    border: '1px solid #ddd',
                    borderRadius: 2,
                    maxHeight: '75vh',
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
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    {getSenderName(Number(msg.senderId))}
                                </Typography>

                                <Typography variant="body1">{msg.content}</Typography>
                                <Typography
                                    variant="caption"
                                    sx={{ display: 'block', mt: 0.5, textAlign: 'right' }}
                                >
                                    {new Date(msg.timestamp).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
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
