// src/components/chat/UserList.tsx
import React, { useEffect } from 'react'
import { List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material'
import { useChatStore } from '../../store/useChatStore'
import { useSessionStore } from '../../store/useSessionStore'
import { getUsers } from '../../user/userApi'
import { useNavigate, useParams } from 'react-router-dom'

export default function UserList() {
    const navigate = useNavigate()
    const { userId } = useParams()
    const { session } = useSessionStore()
    const { users, setUsers, selectedUser, setSelectedUser } = useChatStore()

    useEffect(() => {
        getUsers()
            .then((data) => {
                const filtered = data.filter((u) => u.username !== session?.username)
                setUsers(filtered)
            })
            .catch((err) => console.error(err))
    }, [session])

    const handleSelect = (user: any) => {
        setSelectedUser(user)
        navigate(`/messages/user/${user.user_id}`)
    }

    useEffect(() => {
        if (userId && users.length > 0) {
            const found = users.find((u) => String(u.user_id) === userId)
            if (found) setSelectedUser(found)
        }
    }, [userId, users])

    return (
        <List>
            <Typography variant="subtitle1" sx={{ p: 1 }}>
                Utilisateurs connectés
            </Typography>
            {users.map((user) => (
                <ListItem disablePadding key={user.user_id}>
                    <ListItemButton
                        selected={selectedUser?.user_id === user.user_id}
                        onClick={() => handleSelect(user)}
                    >
                        <ListItemText
                            primary={user.username}
                            secondary={`Dernière connexion : ${user.last_login}`}
                        />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    )
}
