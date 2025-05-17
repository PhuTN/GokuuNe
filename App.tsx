import React, { useEffect, useState } from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { LanguageProvider } from './src/asycnc_store/LanguageContext';
import { ThemeProvider } from './src/asycnc_store/ThemeContext';
import { NotificationProvider } from './src/asycnc_store/NotificationContext';
import {
  SoundEffectProvider,
  BackgroundMusicProvider,
} from './src/asycnc_store/SoundAndMusicContext';
import PushNotification from 'react-native-push-notification';
import { checkAndRequestNotificationPermission } from './src/untils/NotificationPermission';
import NotificationPermissionCustom from './src/components/common/Notification_Permission_Custom';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ZoomWrapper from './src/components/ZoomWrapper'; // <--- Add this

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
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NotificationProvider>
        <ThemeProvider>
          <LanguageProvider>
            <SoundEffectProvider>
              <BackgroundMusicProvider>

                <AppNavigator />

                <NotificationPermissionCustom
                  visible={showPermissionModal}
                  onClose={() => setShowPermissionModal(false)}
                  setModalVisible={setShowPermissionModal}
                />
              </BackgroundMusicProvider>
            </SoundEffectProvider>
          </LanguageProvider>
        </ThemeProvider>
      </NotificationProvider>
    </GestureHandlerRootView>
  );
}
