// /api/rooms/[roomId].js
import { checkSession } from '/home/abigagane/dosi/tp_react/urc/lib/session.js';
import { Redis } from '@upstash/redis';

export const config = {
    runtime: 'nodejs', // ⚠️ Node runtime pour utiliser crypto et req/res
};

const redis = Redis.fromEnv();

export default async function handler(req, res) {
    try {
        // Récupération roomId depuis query ou pathname
        const roomId = req.query?.roomId || req.url.split('/').pop();
        if (!roomId) return res.status(400).json({ code: 'BAD_REQUEST', message: 'roomId manquant' });

        // Vérification session
        const connected = await checkSession(req);
        if (!connected) return res.status(401).json({ code: 'UNAUTHORIZED', message: 'Session invalide' });

        const convKey = `room_${roomId}`;

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
            if (!content) return res.status(400).json({ code: 'BAD_REQUEST', message: 'Content manquant' });

            const newMsg = {
                id: crypto.randomUUID(),
                senderId: connected.id,
                content,
                timestamp: new Date().toISOString(),
            };

            await redis.rpush(convKey, JSON.stringify(newMsg));
            console.log('💬 Nouveau message stocké dans Redis :', newMsg);

            return res.status(200).json(newMsg);
        }

        // Méthode non autorisée
        return res.status(405).json({ code: 'METHOD_NOT_ALLOWED', message: 'Méthode non autorisée' });

    } catch (error) {
        console.error('Erreur dans /api/rooms/[roomId].js:', error);
        return res.status(500).json({ code: 'SERVER_ERROR', message: error.message });
    }
}
