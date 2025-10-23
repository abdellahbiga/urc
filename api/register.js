// /api/register.js
import { db } from '@vercel/postgres'
import { Redis } from '@upstash/redis'
import { arrayBufferToBase64, stringToArrayBuffer } from '../lib/base64'

export const config = { runtime: 'edge' }

const redis = Redis.fromEnv()

export default async function handler(request) {
    try {
        const { username, email, password } = await request.json()

        if (!username || !email || !password) {
            return new Response(
                JSON.stringify({ message: 'Tous les champs sont obligatoires.' }),
                { status: 400, headers: { 'content-type': 'application/json' } }
            )
        }

        const client = await db.connect()

        // Vérifier si username ou email existe
        const { rowCount: existing } = await client.sql`
            SELECT * FROM users WHERE username = ${username} OR email = ${email}
        `
        if (existing > 0) {
            return new Response(
                JSON.stringify({ message: 'Nom d’utilisateur ou email déjà utilisé.' }),
                { status: 409, headers: { 'content-type': 'application/json' } }
            )
        }

        // Hasher le mot de passe
        const hashBuffer = await crypto.subtle.digest(
            'SHA-256',
            stringToArrayBuffer(username + password)
        )
        const hashedPassword = arrayBufferToBase64(hashBuffer)

        // Générer external_id
        const externalId = crypto.randomUUID().toString()

        // Insérer l’utilisateur
        await client.sql`
            INSERT INTO users (username, email, password, external_id, created_on)
            VALUES (${username}, ${email}, ${hashedPassword}, ${externalId}, now())
        `

        return new Response(
            JSON.stringify({ message: 'Utilisateur créé avec succès !' }),
            { status: 201, headers: { 'content-type': 'application/json' } }
        )
    } catch (error) {
        console.error(error)
        return new Response(JSON.stringify({ message: 'Erreur serveur' }), {
            status: 500,
            headers: { 'content-type': 'application/json' },
        })
    }
}
