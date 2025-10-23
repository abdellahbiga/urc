import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
import { useChatStore } from '../../store/useChatStore';
import { sendMessage } from '../../user/userApi';

export default function ChatInput() {
    const [message, setMessage] = useState('');
    const addMessage = useChatStore((state) => state.addMessage);
    const selectedUser = useChatStore((state) => state.selectedUser);

    const handleSend = async () => {
        if (!message.trim() || !selectedUser) return;

        try {
            const newMsg = await sendMessage(selectedUser.user_id, message);
            addMessage(newMsg); // met à jour le store et l'affichage
            setMessage('');
        } catch (err) {
            console.error('Erreur envoi message :', err);
        }
    };

    return (
        <Box sx={{ display: 'flex', p: 2, gap: 1 }}>
            <TextField
                fullWidth
                placeholder="Écrivez un message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <Button variant="contained" onClick={handleSend}>
                Envoyer
            </Button>
        </Box>
    );
}
