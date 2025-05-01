import React, {useEffect} from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import {LanguageProvider} from './src/asycnc_store/LanguageContext';
import {ThemeProvider} from './src/asycnc_store/ThemeContext';
import {NotificationProvider} from './src/asycnc_store/NotificationContext';
import PushNotification from 'react-native-push-notification';
import {PermissionsAndroid, Platform} from 'react-native';
import {playBackgroundMusic} from './src/untils/BackgroundMusic';

export default function App() {
  useEffect(() => {
    PushNotification.createChannel(
      {
        channelId: 'default-channel-id', // giống với channelId dùng trong localNotification
        channelName: 'Default Channel',
        soundName: 'custom_sound',
        importance: 4,
        vibrate: true,
      },
      created => console.log(`Channel created: ${created}`), // Callback để kiểm tra kênh đã được tạo thành công hay chưa
    );

    if (Platform.OS === 'android' && Platform.Version >= 33) {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      ).then(result => {
        if (result === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Notification permission granted');
        } else {
          console.log('Notification permission denied');
        }
      });
    }
    // 🔊 Phát nhạc nền khi mở app
    playBackgroundMusic();
  }, []);

  return (
    <NotificationProvider>
      <ThemeProvider>
        <LanguageProvider>
          <AppNavigator />
        </LanguageProvider>
      </ThemeProvider>
    </NotificationProvider>
  );
}
