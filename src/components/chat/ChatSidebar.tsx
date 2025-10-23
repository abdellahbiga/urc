// src/components/chat/ChatSidebar.tsx
import React, { useEffect } from 'react'
import {
    List,
    ListItemButton,
    ListItemText,
    Typography,
    Divider,
    Box,
} from '@mui/material'
import { useChatStore } from '../../store/useChatStore'
import { useSessionStore } from '../../store/useSessionStore'
import { getUsers } from '../../user/userApi'
import { useNavigate, useParams } from 'react-router-dom'
import {UserPublic} from "../../model/common";

export default function ChatSidebar() {
    const { users, selectedUser, setUsers, setSelectedUser } = useChatStore()
    const session = useSessionStore((state) => state.session)
    const navigate = useNavigate()
    const { userId } = useParams()

    // Charger la liste des utilisateurs
    useEffect(() => {
        async function fetchUsers() {
            try {
                const data = await getUsers()
                const filtered = data.filter((u) => u.username !== session?.username)
                setUsers(filtered)
            } catch (error) {
                console.error('Erreur récupération utilisateurs:', error)
            }
        }
        fetchUsers()
    }, [session, setUsers])

    // Synchroniser la sélection avec l'URL
    useEffect(() => {
        if (userId && users.length > 0) {
            const found = users.find((u) => u.user_id === userId)
            if (found) setSelectedUser(found)
        }
    }, [userId, users, setSelectedUser])

    // Clic sur un utilisateur
    const handleSelect = (user: UserPublic) => {
        setSelectedUser(user); // ⚡️ mettre à jour le store tout de suite
        navigate(`/messages/user/${user.user_id}`);
    }

    return (
        <Box
            sx={{
                width: 250,
                borderRight: '1px solid #ddd',
                height: '100vh',
                overflowY: 'auto',
            }}
        >
            <Typography variant="h6" align="center" sx={{ my: 2 }}>
                Utilisateurs
            </Typography>
            <Divider />
            <List>
                {users.map((user) => (
                    <ListItemButton
                        key={user.user_id}
                        selected={selectedUser?.user_id === user.user_id}
                        onClick={() => handleSelect(user)} // on passe l'utilisateur entier
                    >
                        <ListItemText
                            primary={user.username}
                            secondary={`Dernière connexion : ${user.last_login}`}
                        />
                    </ListItemButton>
                ))}
            </List>
        </Box>
    )
}
