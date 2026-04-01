/**
 * hooks/useNotification.ts — Browser Notification Hook
 * Manages push notification permissions and displays browser alerts.
 */

import { useState, useEffect, useCallback } from "react";

interface UseNotificationReturn {
  permission: NotificationPermission;
  requestPermission: () => Promise<void>;
  showNotification: (title: string, options?: NotificationOptions) => void;
  isSupported: boolean;
}

const useNotification = (): UseNotificationReturn => {
  const isSupported = typeof window !== "undefined" && "Notification" in window;

  const [permission, setPermission] = useState<NotificationPermission>(
    isSupported ? Notification.permission : "denied"
  );

  // Check current permission status on mount
  useEffect(() => {
    if (isSupported) {
      setPermission(Notification.permission);
    }
  }, [isSupported]);

  // Request notification permission from user
  const requestPermission = useCallback(async () => {
    if (!isSupported) return;

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
    } catch (err) {
      console.error("Notification permission request failed:", err);
    }
  }, [isSupported]);

  // Show a browser notification
  const showNotification = useCallback(
    (title: string, options?: NotificationOptions) => {
      if (!isSupported || permission !== "granted") return;

      try {
        const notification = new Notification(title, {
          icon: "/favicon.svg",
          badge: "/favicon.svg",
          requireInteraction: true, // Keep visible until dismissed (important for elderly)
          ...options,
        });

        // Auto-close after 30 seconds
        setTimeout(() => notification.close(), 30000);

        notification.onclick = () => {
          window.focus();
          notification.close();
        };
      } catch (err) {
        console.error("Failed to show notification:", err);
      }
    },
    [isSupported, permission]
  );

  return { permission, requestPermission, showNotification, isSupported };
};

export default useNotification;
