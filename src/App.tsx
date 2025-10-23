import React, { JSX } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'

import Login from './user/Login'
import ChatPage from './pages/ChatPage'
import { useSessionStore } from './store/useSessionStore'
import theme from './theme'
import Register from "./user/Register"; // import du thème

function ProtectedRoute({ children }: { children: JSX.Element }) {
    const session = useSessionStore((state) => state.session)
    return session ? children : <Navigate to="/login" replace />
}

function App() {
    return (
        <ThemeProvider theme={theme}>
            {/* CssBaseline applique les styles de base du thème */}
            <CssBaseline />
            <BrowserRouter>
                <Routes>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/login" element={<Login />} />
                    <Route
                        path="/chat"
                        element={
                            <ProtectedRoute>
                                <ChatPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    )
}

export default App
