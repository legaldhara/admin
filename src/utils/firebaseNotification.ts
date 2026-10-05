// src/utils/firebaseNotification.ts
import { AxiosRequestConfig } from 'axios';
import { messaging } from '../config/FirebaseConfiguration';
import { getToken, onMessage } from 'firebase/messaging';

export const requestUserNotificationPermission = async (): Promise<NotificationPermission> => {
    if ('Notification' in window && Notification.permission === 'default') {
        try {
            const permission = await Notification.requestPermission();
            return permission;
        } catch {
            return 'default';
        }
    } else {
        return Notification.permission; // 'granted' or 'denied'
    }
};

export async function registerFirebaseSW() {
    if ('serviceWorker' in navigator) {
        await navigator.serviceWorker.register('/firebase-messaging-sw.js').catch(() => undefined);
    }
}

export async function requestAndSaveToken(isAuthenticated: boolean, secureRequest: <T>(cfg: AxiosRequestConfig) => Promise<T>): Promise<void> {
    if (!isAuthenticated) return;

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
        return;
    }

    try {
        const VAPID_KEY = import.meta.env.VITE_PUBLIC_VAPID_KEY_HERE!;
        const token = await getToken(messaging, { vapidKey: VAPID_KEY });
        if (token) {
            await secureRequest({
                url: '/notification/save-token',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
        }
    } catch {
        return;
    }
}

/**
 * 3. Listen for foreground messages and show them via the service‑worker
 */
export function listenForForegroundNotifications() {
    onMessage(messaging, async (payload) => {
        if (Notification.permission === 'granted' && payload.notification) {
            const reg = await navigator.serviceWorker.ready;
            reg.showNotification(payload.notification.title || 'Notification', {
                body: payload.notification.body || '',
                icon: '/logo192.png',
                tag: payload.messageId,
                requireInteraction: true,
            });
        }
    });
}
