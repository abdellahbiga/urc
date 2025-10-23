import React, { useState } from 'react'
import {Link as RouterLink, useNavigate} from 'react-router-dom'
import { registerUser } from './registerApi'
import { CustomError } from '../model/CustomError'

import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    Stack,
    Alert, Link,
} from '@mui/material'

export function Register() {
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    const handleRegister = () => {
        setErrorMessage('')
        setSuccessMessage('')

        registerUser(
            { username, email, password },
            (result) => {
                setSuccessMessage(result.message)
                // Rediriger après succès
                setTimeout(() => navigate('/login'), 1500)
            },
            (error: CustomError) => setErrorMessage(error.message)
        )
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                bgcolor: 'background.default',
                p: 2,
            }}
        >
            <Paper sx={{ p: 4, width: 400 }}>
                <Stack spacing={2}>
                    <Typography variant="h5" align="center">
                        Inscription
                    </Typography>

                    {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                    {successMessage && <Alert severity="success">{successMessage}</Alert>}

                    <TextField
                        label="Nom d'utilisateur"
                        fullWidth
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        label="Mot de passe"
                        type="password"
                        fullWidth
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleRegister}
                    >
                        S’inscrire
                    </Button>

                    <Typography variant="body2" align="center">
                        Déjà un compte ?{' '}
                        <Link component={RouterLink} to="/login" underline="hover">
                            Connectez-vous
                        </Link>
                    </Typography>
                </Stack>
            </Paper>
        </Box>
    )
}

export default Register
