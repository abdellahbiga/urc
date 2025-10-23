// src/user/userApi.ts
import { CustomError } from '../model/CustomError'
import { UserPublic, Message } from '../model/common'

export async function getUsers(): Promise<UserPublic[]> {
    const token = sessionStorage.getItem('token')
    if (!token) throw new Error('No token found')

    const response = await fetch('/api/users', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    })

    if (response.status === 401) {
        throw new CustomError('UNAUTHORIZED', 'Session expirée ou invalide.')
    }

    if (!response.ok) {
        const error = await response.json()
        throw new CustomError(error.code || 'ERROR', error.message || 'Erreur inconnue')
    }

    return await response.json()
}

// -------------------------
// Récupérer les messages avec un autre utilisateur
export async function getMessages(userId: string): Promise<Message[]> {
    const token = sessionStorage.getItem('token')
    if (!token) throw new Error('No token found')

    const response = await fetch(`/api/messages/${userId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    })

    if (response.status === 401) {
        throw new CustomError('UNAUTHORIZED', 'Session expirée ou invalide.')
    }

    if (!response.ok) {
        const error = await response.json()
        throw new CustomError(error.code || 'ERROR', error.message || 'Erreur inconnue')
    }

    return await response.json()
}


export async function sendMessage(userId: string, content: string): Promise<Message> {
    const token = sessionStorage.getItem('token');
    if (!token) throw new Error('No token found');

    const response = await fetch(`/api/messages/${userId}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
    });

    if (response.status === 401) {
        throw new CustomError('UNAUTHORIZED', 'Session expirée ou invalide.');
    }

    if (!response.ok) {
        const err = await response.json();
        throw new CustomError(err.code || 'ERROR', err.message || 'Erreur inconnue');
    }

    return await response.json();
}
