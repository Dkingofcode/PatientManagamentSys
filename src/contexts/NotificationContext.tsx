import React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error" | "alert";
  category: "patient" | "appointment" | "lab" | "xray" | "inventory" | "system";
  priority: "low" | "medium" | "high" | "critical";
  timestamp: string;
  read: boolean;
  actionRequired?: boolean;
  data?: any;
  recipientRole:
    | "admin"
    | "doctor"
    | "lab-technician"
    | "xray-technician"
    | "all";
  autoExpire?: boolean;
  expiresAt?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (
    notification: Omit<Notification, "id" | "timestamp" | "read">
  ) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
  getNotificationsByRole: (role: string) => Notification[];
  getNotificationsByCategory: (category: string) => Notification[];
  triggerPatientRegistration: (patientData: any) => void;
  triggerAppointmentBooked: (appointmentData: any) => void;
  triggerLabTestBooked: (labData: any) => void;
  triggerXrayTestBooked: (xrayData: any) => void;
  triggerInventoryAlert: (inventoryData: any) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved =
      typeof window !== "undefined"
        ? localStorage.getItem("notifications")
        : null;
    return saved ? JSON.parse(saved) : [];
  });

  // Persist notifications to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("notifications", JSON.stringify(notifications));
    }
  }, [notifications]);

  // Auto-expire notifications
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      setNotifications((prev) =>
        prev.filter((notification) => {
          if (notification.autoExpire && notification.expiresAt) {
            return new Date(notification.expiresAt).getTime() > now;
          }
          return true;
        })
      );
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const addNotification = (
    notification: Omit<Notification, "id" | "timestamp" | "read">
  ) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      read: false,
      expiresAt: notification.autoExpire
        ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
        : undefined,
    };

    setNotifications((prev) => [newNotification, ...prev]);

    // Play notification sound for high priority notifications
    if (
      notification.priority === "high" ||
      notification.priority === "critical"
    ) {
      playNotificationSound();
    }

    // Show browser notification for critical alerts
    if (notification.priority === "critical" && "Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification(notification.title, {
          body: notification.message,
          icon: "/favicon.ico",
          tag: newNotification.id,
        });
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            new Notification(notification.title, {
              body: notification.message,
              icon: "/favicon.ico",
              tag: newNotification.id,
            });
          }
        });
      }
    }
  };

  const playNotificationSound = () => {
    // Create audio context for notification sound
    try {
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.3
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.log("Audio notification not supported");
    }
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const getNotificationsByRole = (role: string) => {
    return notifications.filter(
      (notification) =>
        notification.recipientRole === role ||
        notification.recipientRole === "all"
    );
  };

  const getNotificationsByCategory = (category: string) => {
    return notifications.filter(
      (notification) => notification.category === category
    );
  };

  // Trigger functions for different notification types
  const triggerPatientRegistration = (patientData: any) => {
    addNotification({
      title: "New Patient Registered",
      message: `${patientData.name} has successfully registered in the system`,
      type: "success",
      category: "patient",
      priority: "medium",
      recipientRole: "admin",
      data: patientData,
      autoExpire: true,
    });
  };

  const triggerAppointmentBooked = (appointmentData: any) => {
    // Notify doctor
    addNotification({
      title: "New Appointment Booked",
      message: `${appointmentData.patientName} has booked an appointment for ${appointmentData.date} at ${appointmentData.time}`,
      type: "info",
      category: "appointment",
      priority: "high",
      recipientRole: "doctor",
      data: appointmentData,
      actionRequired: true,
    });

    // Notify admin
    addNotification({
      title: "Appointment Scheduled",
      message: `New appointment scheduled with Dr. ${appointmentData.doctorName} for ${appointmentData.patientName}`,
      type: "info",
      category: "appointment",
      priority: "medium",
      recipientRole: "admin",
      data: appointmentData,
      autoExpire: true,
    });
  };

  const triggerLabTestBooked = (labData: any) => {
    addNotification({
      title: "New Lab Test Assigned",
      message: `${labData.testName} has been assigned for patient ${labData.patientName}`,
      type: "info",
      category: "lab",
      priority: "high",
      recipientRole: "lab-technician",
      data: labData,
      actionRequired: true,
    });
  };

  const triggerXrayTestBooked = (xrayData: any) => {
    addNotification({
      title: "New X-Ray Test Assigned",
      message: `${xrayData.testName} has been assigned for patient ${xrayData.patientName}`,
      type: "info",
      category: "xray",
      priority: "high",
      recipientRole: "xray-technician",
      data: xrayData,
      actionRequired: true,
    });
  };

  const triggerInventoryAlert = (inventoryData: any) => {
    const isLow = inventoryData.stock <= inventoryData.minLevel;
    const isCritical = inventoryData.stock < inventoryData.minLevel * 0.5;

    addNotification({
      title: isCritical ? "Critical Inventory Alert" : "Low Inventory Warning",
      message: `${inventoryData.item} is ${
        isCritical ? "critically low" : "running low"
      } (${inventoryData.stock} remaining)`,
      type: isCritical || isLow ? "error" : "warning",
      category: "inventory",
      priority: isCritical ? "critical" : "high",
      recipientRole: "admin",
      data: inventoryData,
      actionRequired: true,
    });
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAllNotifications,
        getNotificationsByRole,
        getNotificationsByCategory,
        triggerPatientRegistration,
        triggerAppointmentBooked,
        triggerLabTestBooked,
        triggerXrayTestBooked,
        triggerInventoryAlert,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
}
