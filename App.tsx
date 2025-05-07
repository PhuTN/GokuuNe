import React, { useEffect, useState } from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { LanguageProvider } from './src/asycnc_store/LanguageContext';
import { ThemeProvider } from './src/asycnc_store/ThemeContext';
import { NotificationProvider } from './src/asycnc_store/NotificationContext';
import PushNotification from 'react-native-push-notification';
import { playBackgroundMusic } from './src/untils/BackgroundMusic';
import  { loadSoundEffects }  from './src/untils/SoundEffects';
import { loadVictorySound } from './src/untils/VictorySound';
import { checkAndRequestNotificationPermission } from './src/untils/NotificationPermission';
import NotificationPermissionCustom from './src/components/common/Notification_Permission_Custom';

export default function App() {
  const [showPermissionModal, setShowPermissionModal] = useState(false);

  useEffect(() => {
    PushNotification.createChannel(
      {
        channelId: 'default-channel-id',
        channelName: 'Default Channel',
        soundName: 'custom_sound',
        importance: 4,
        vibrate: true,
      },
      created => console.log(`Channel created: ${created}`),
    );

    const init = async () => {
      const permissionStatus = await checkAndRequestNotificationPermission();
      if (permissionStatus === 'needsSettings') {
        setShowPermissionModal(true);
      }
    };

    init();
    // playBackgroundMusic();
    loadSoundEffects();
    loadVictorySound();
  }, []);

  return (
    <NotificationProvider>
      <ThemeProvider>
        <LanguageProvider>
          <AppNavigator />
          <NotificationPermissionCustom
            visible={showPermissionModal}
            onClose={() => setShowPermissionModal(false)}
            setModalVisible={setShowPermissionModal}
          />
        </LanguageProvider>
      </ThemeProvider>
    </NotificationProvider>
  );
}
