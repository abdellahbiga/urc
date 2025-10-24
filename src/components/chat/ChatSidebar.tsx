// src/components/chat/ChatSidebar.tsx
import React, { useEffect } from 'react'
import {
    List,
    ListItemButton,
    ListItemText,
    Typography,
    Divider,
    Box,
    Button,
} from '@mui/material'
import { useChatStore } from '../../store/useChatStore'
import { useSessionStore } from '../../store/useSessionStore'
import { getUsers } from '../../user/userApi'
import { useNavigate } from 'react-router-dom'
import { UserPublic } from '../../model/common'
import { getRooms } from '../../room/roomApi'

export default function ChatSidebar() {
    const {
        users, setUsers, selectedUser, setSelectedUser,
        selectedRoom, setSelectedRoom
    } = useChatStore()

    const [rooms, setRooms] = React.useState<any[]>([])
    const session = useSessionStore((state) => state.session)
    const navigate = useNavigate()

    // Charger les users
    useEffect(() => {
        if (!session?.token) return // ⛔ attend que le token soit prêt
        async function fetchUsers() {
            try {
                const data = await getUsers()
                setUsers(data)
            } catch (err) {
                console.error('Erreur récupération users:', err)
            }
        }
        fetchUsers()
    }, [session?.token, setUsers])

    // Charger les rooms
    useEffect(() => {
        if (!session?.token) return // ⛔ attend que le token soit prêt
        async function fetchRooms() {
            try {
                const data = await getRooms()
                setRooms(data)
            } catch (err) {
                console.error('Erreur récupération rooms:', err)
            }
        }
        fetchRooms()
    }, [session?.token])

    const handleSelectUser = (user: UserPublic) => {
        setSelectedUser(user)
        setSelectedRoom(null)
        navigate(`/messages/user/${user.user_id}`)
    }

    const handleSelectRoom = (room: any) => {
        setSelectedRoom(room.name)
        setSelectedUser(null)
        navigate(`/messages/room/${room.room_id}`)
    }

    const handleLogout = () => {
        sessionStorage.clear()
        navigate('/login')
    }

    return (
        <Box
            sx={{
                width: 250,
                borderRight: '1px solid #ddd',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                <Typography variant="h6" align="center" sx={{ my: 1 }}>
                    Utilisateurs
                </Typography>
                <Divider />
                <List>
                    {users.filter((users) => Number(users.user_id) !== session?.id).map((user) => (
                        <ListItemButton
                            key={user.user_id}
                            selected={selectedUser?.user_id === user.user_id}
                            onClick={() => handleSelectUser(user)}
                        >
                            <ListItemText
                                primary={user.username}
                                secondary={`Dernière connexion : ${user.last_login}`}
                            />
                        </ListItemButton>
                    ))}
                </List>

                <Typography variant="h6" align="center" sx={{ my: 1 }}>
                    Salons
                </Typography>
                <Divider />
                <List>
                    {rooms.map((room) => (
                        <ListItemButton
                            key={room.room_id}
                            selected={selectedRoom === room.name}
                            onClick={() => handleSelectRoom(room)}
                        >
                            <ListItemText primary={room.name} />
                        </ListItemButton>
                    ))}
                </List>
            </Box>

            <Box sx={{ p: 2, borderTop: '1px solid #ddd' }}>
                <Button variant="outlined" color="error" fullWidth onClick={handleLogout}>
                    Déconnexion
                </Button>
            </Box>
        </Box>
    )
}
