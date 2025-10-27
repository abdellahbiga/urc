// /api/message.js
import { checkSession } from '../lib/session';
import { Redis } from '@upstash/redis';

export const config = {
    runtime: 'nodejs', // Utilisation de Node.js pour les Serverless Functions
};

const redis = new Redis({
    url: process.env.REDIS_URL,
    token: process.env.REDIS_TOKEN,
});

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const session = await checkSession(req);
    if (!session) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { recipientId, content } = req.body;
    if (!recipientId || !content) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const senderId = session.user_id;
    const roomKey = [senderId, recipientId].sort().join(':');
    const message = {
        senderId,
        content,
        timestamp: new Date().toISOString(),
    };

    try {
        await redis.lpush(`chat:${roomKey}`, JSON.stringify(message));
        await redis.expire(`chat:${roomKey}`, 86400); // Expiration après 24h
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error saving message:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
