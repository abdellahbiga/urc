import React, { useState } from 'react'
import { Box, TextField, IconButton } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import { useParams } from 'react-router-dom'
import { useChatStore } from '../../store/useChatStore'
import { sendMessage } from '../../user/userApi'
import { sendRoomMessage } from '../../room/roomApi'

export default function ChatInput() {
    const [content, setContent] = useState('')
    const { userId, roomId } = useParams<{ userId?: string; roomId?: string }>()
    const setMessages = useChatStore((state) => state.setMessages)
    const messages = useChatStore((state) => state.messages)

    const handleSend = async () => {
        if (!content.trim()) return
        try {
            let newMsg
            if (userId) {
                newMsg = await sendMessage(userId, content)
            } else if (roomId) {
                newMsg = await sendRoomMessage(roomId, content)
            }
            setMessages([...messages, newMsg])
            setContent('')
        } catch (err) {
            console.error('Erreur envoi message :', err)
        }
    }

    return (
        <Box sx={{ display: 'flex', p: 2, borderTop: '1px solid #ddd' }}>
            <TextField
                fullWidth
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Écrire un message..."
            />
            <IconButton color="primary" onClick={handleSend}>
                <SendIcon />
            </IconButton>
        </Box>
    )
}
