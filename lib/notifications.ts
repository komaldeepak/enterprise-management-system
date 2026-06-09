import { useState, useCallback, useEffect } from 'react';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  timestamp: number;
  read: boolean;
}

// Notification store
let notifications: Notification[] = [];
let listeners: Array<(notifs: Notification[]) => void> = [];

export function useNotifications() {
  const [notifs, setNotifs] = useState<Notification[]>(notifications);

  useEffect(() => {
    // Subscribe to notifications
    listeners.push(setNotifs);
    return () => {
      listeners = listeners.filter((l) => l !== setNotifs);
    };
  }, []);

  const addNotification = useCallback((
    message: string,
    type: 'success' | 'error' | 'info' | 'warning' = 'info'
  ) => {
    const notification: Notification = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: Date.now(),
      read: false,
    };

    notifications = [notification, ...notifications].slice(0, 50); // Keep last 50
    listeners.forEach((listener) => listener([...notifications]));

    return notification.id;
  }, []);

  const removeNotification = useCallback((id: string) => {
    notifications = notifications.filter((n) => n.id !== id);
    listeners.forEach((listener) => listener([...notifications]));
  }, []);

  const markAsRead = useCallback((id: string) => {
    notifications = notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    listeners.forEach((listener) => listener([...notifications]));
  }, []);

  const clearAll = useCallback(() => {
    notifications = [];
    listeners.forEach((listener) => listener([]));
  }, []);

  return {
    notifications: notifs,
    addNotification,
    removeNotification,
    markAsRead,
    clearAll,
    unreadCount: notifs.filter((n) => !n.read).length,
  };
}
