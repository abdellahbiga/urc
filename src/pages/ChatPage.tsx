// src/pages/ChatPage.tsx
import React from 'react'
import { Box } from '@mui/material'
import ChatSidebar from '../components/chat/ChatSidebar'
import ChatMessages from '../components/chat/ChatMessages'
import ChatInput from '../components/chat/ChatInput'

export default function ChatPage() {
    return (
        <Box sx={{ display: 'flex', height: '100vh' }}>
            <ChatSidebar />
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <ChatMessages />
                <ChatInput />
            </Box>
        </Box>
    )
}
