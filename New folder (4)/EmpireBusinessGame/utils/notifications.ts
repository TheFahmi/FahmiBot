// File baru untuk mengelola notifikasi dalam game

import { Animated } from 'react-native';

export type NotificationType = 'success' | 'info' | 'warning' | 'error';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  message: string;
  icon?: string;
  duration?: number;
  animValue: Animated.Value;
}

// Simpan notifikasi aktif di sini
let notifications: NotificationItem[] = [];
let notificationListeners: ((items: NotificationItem[]) => void)[] = [];

// ID unik untuk notifikasi
let notificationCounter = 0;

// Tambahkan notifikasi baru
export const showNotification = (
  message: string,
  type: NotificationType = 'info',
  icon?: string,
  duration: number = 3000
): string => {
  const id = `notification_${notificationCounter++}`;
  const animValue = new Animated.Value(0);
  
  // Animasi masuk
  Animated.timing(animValue, {
    toValue: 1,
    duration: 300,
    useNativeDriver: true,
  }).start();
  
  // Buat item notifikasi baru
  const newItem: NotificationItem = {
    id,
    type,
    message,
    icon,
    duration,
    animValue,
  };
  
  // Tambahkan ke daftar notifikasi
  notifications = [...notifications, newItem];
  
  // Beritahu semua listener
  notifyListeners();
  
  // Set timeout untuk animasi keluar dan penghapusan
  setTimeout(() => {
    dismissNotification(id);
  }, duration);
  
  return id;
};

// Hapus notifikasi dengan ID tertentu
export const dismissNotification = (id: string): void => {
  const notification = notifications.find(item => item.id === id);
  
  if (!notification) return;
  
  // Animasi keluar
  Animated.timing(notification.animValue, {
    toValue: 0,
    duration: 300,
    useNativeDriver: true,
  }).start(() => {
    // Hapus notifikasi setelah animasi selesai
    notifications = notifications.filter(item => item.id !== id);
    notifyListeners();
  });
};

// Hapus semua notifikasi
export const clearAllNotifications = (): void => {
  notifications.forEach(notification => {
    dismissNotification(notification.id);
  });
};

// Subscribe ke perubahan notifikasi
export const subscribeToNotifications = (
  callback: (items: NotificationItem[]) => void
): (() => void) => {
  notificationListeners.push(callback);
  
  // Panggil callback langsung dengan notifikasi saat ini
  callback(notifications);
  
  // Return fungsi unsubscribe
  return () => {
    notificationListeners = notificationListeners.filter(listener => listener !== callback);
  };
};

// Beritahu semua listener
const notifyListeners = (): void => {
  notificationListeners.forEach(listener => listener(notifications));
};

// Helper untuk tipe notifikasi spesifik
export const showSuccessNotification = (
  message: string,
  icon: string = 'check-circle',
  duration: number = 3000
): string => showNotification(message, 'success', icon, duration);

export const showInfoNotification = (
  message: string,
  icon: string = 'information',
  duration: number = 3000
): string => showNotification(message, 'info', icon, duration);

export const showWarningNotification = (
  message: string,
  icon: string = 'alert',
  duration: number = 3000
): string => showNotification(message, 'warning', icon, duration);

export const showErrorNotification = (
  message: string,
  icon: string = 'close-circle',
  duration: number = 3000
): string => showNotification(message, 'error', icon, duration); 