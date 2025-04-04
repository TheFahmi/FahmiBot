import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { 
  NotificationItem, 
  subscribeToNotifications 
} from '../utils/notifications';

// Lebar perangkat
const { width } = Dimensions.get('window');

// Fungsi untuk mendapatkan nama ikon yang valid
const getIconName = (iconName: string | undefined): any => {
  // Daftar ikon default berdasarkan tipe notifikasi
  const defaultIcons = {
    success: 'check-circle',
    info: 'information',
    warning: 'alert',
    error: 'close-circle',
  };
  
  // Jika tidak ada ikon yang diberikan atau ikon tidak valid, kembalikan null
  if (!iconName) return null;
  
  return iconName as any;
};

// Fungsi untuk mendapatkan warna berdasarkan tipe notifikasi
const getColorByType = (type: string): string => {
  switch (type) {
    case 'success': return '#4CAF50';
    case 'info': return '#2196F3';
    case 'warning': return '#FF9800';
    case 'error': return '#F44336';
    default: return '#2196F3';
  }
};

const NotificationContainer: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    // Subscribe ke perubahan notifikasi
    const unsubscribe = subscribeToNotifications(setNotifications);
    
    // Cleanup saat komponen unmount
    return unsubscribe;
  }, []);

  if (notifications.length === 0) {
    return null;
  }

  return (
    <View style={styles.container} pointerEvents="none">
      {notifications.map((notification) => (
        <Animated.View
          key={notification.id}
          style={[
            styles.notification,
            {
              backgroundColor: getColorByType(notification.type),
              opacity: notification.animValue,
              transform: [
                {
                  translateY: notification.animValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          {notification.icon && (
            <MaterialCommunityIcons
              name={getIconName(notification.icon)}
              size={20}
              color="#FFFFFF"
              style={styles.icon}
            />
          )}
          <Text style={styles.message}>{notification.message}</Text>
        </Animated.View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    width: '100%',
    alignItems: 'center',
    zIndex: 9999,
  },
  notification: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    width: width * 0.9,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  icon: {
    marginRight: 10,
  },
  message: {
    color: '#FFFFFF',
    fontWeight: '500',
    flex: 1,
  },
});

export default NotificationContainer; 