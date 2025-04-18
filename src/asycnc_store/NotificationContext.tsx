import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type NotificationType = 'on' | 'off';

interface NotificationContextType {
  notification: NotificationType;
  toggleNotification: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notification, setNotification] = useState<NotificationType>('on');

  useEffect(() => {
    const loadNotificationSetting = async () => {
      const savedSetting = await AsyncStorage.getItem('pushNotification');
      if (savedSetting === 'on' || savedSetting === 'off') {
        setNotification(savedSetting);
      }
    };
    loadNotificationSetting();
  }, []);

  const toggleNotification = async () => {
    const newSetting: NotificationType = notification === 'on' ? 'off' : 'on';
    setNotification(newSetting);
    await AsyncStorage.setItem('pushNotification', newSetting);
  };

  return (
    <NotificationContext.Provider value={{ notification, toggleNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
