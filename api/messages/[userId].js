// /api/messages/[userId].js
import { checkSession } from '../../lib/session';
import { Redis } from '@upstash/redis';
import crypto from 'crypto';

const redis = Redis.fromEnv();

export default async function handler(req, res) {
    try {
        const { userId } = req.query;

        // ✅ Vérification session
        const connected = await checkSession(req);
        if (!connected) {
            return res.status(401).json({ code: 'UNAUTHORIZED', message: 'Session invalide' });
        }

        if (!userId) {
            return res.status(400).json({ code: 'BAD_REQUEST', message: 'userId manquant' });
        }

        const currentUserId = connected.id;

        // 🔑 Clé de conversation
        let convKey;
        if (currentUserId>userId)
            convKey = `conv_${currentUserId}_${userId}`;
        else
            convKey = `conv_${userId}_${currentUserId}`;

        // --- GET : lecture des messages ---
        if (req.method === 'GET') {
            const messages = await redis.lrange(convKey, 0, -1);
            const parsed = messages.map(m => {
                try {
                    return typeof m === 'string' ? JSON.parse(m) : m;
                } catch {
                    console.warn('❌ Message non valide JSON :', m);
                    return null;
                }
            }).filter(Boolean);
            return res.status(200).json(parsed);
        }

        // --- POST : envoi d’un message ---
        if (req.method === 'POST') {
            const { content } = req.body;
            if (!content) {
                return res.status(400).json({ code: 'BAD_REQUEST', message: 'Content manquant' });
            }

            const newMsg = {
                id: crypto.randomUUID(),
                senderId: currentUserId,
                content,
                timestamp: new Date().toISOString(),
            };

            // ✅ Enregistrement sous forme de chaîne JSON
            await redis.rpush(convKey, JSON.stringify(newMsg));


            console.log('💬 Nouveau message stocké dans Redis :', newMsg);

            return res.status(200).json(newMsg);
        }

        // --- Méthode non autorisée ---
        return res.status(405).json({ code: 'METHOD_NOT_ALLOWED', message: 'Méthode non autorisée' });

    } catch (error) {
        console.error('Erreur dans /api/messages/[userId].js:', error);
        return res.status(500).json({ code: 'SERVER_ERROR', message: error.message });
    }
}
