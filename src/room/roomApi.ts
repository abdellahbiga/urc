// src/room/roomApi.ts
import { AUTHENT_HEADER, BEARER } from "../model/common";
import { useSessionStore } from "../store/useSessionStore";

const API_URL = "/api";

export async function getRooms() {
    const token = useSessionStore.getState().session?.token;
    const res = await fetch(`${API_URL}/rooms`, {
        headers: { [AUTHENT_HEADER]: BEARER + token },
    });
    if (!res.ok) throw new Error("Erreur chargement rooms");
    return res.json();
}

export async function getRoomMessages(roomId: string) {
    const token = useSessionStore.getState().session?.token;
    const res = await fetch(`${API_URL}/rooms/${roomId}`, {
        headers: { [AUTHENT_HEADER]: BEARER + token },
    });
    if (!res.ok) throw new Error("Erreur chargement messages room");
    return res.json();
}

export async function sendRoomMessage(roomId: string, content: string) {
    const token = useSessionStore.getState().session?.token;
    const res = await fetch(`${API_URL}/rooms/${roomId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            [AUTHENT_HEADER]: BEARER + token,
        },
        body: JSON.stringify({ content }),
    });
    if (!res.ok) throw new Error("Erreur envoi message room");
    return res.json();
}
