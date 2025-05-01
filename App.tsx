import React, {useEffect, useRef} from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import {LanguageProvider} from './src/asycnc_store/LanguageContext';
import {ThemeProvider} from './src/asycnc_store/ThemeContext';
import {NotificationProvider} from './src/asycnc_store/NotificationContext';
import PushNotification from 'react-native-push-notification';
import {AppState, AppStateStatus, PermissionsAndroid, Platform} from 'react-native';
import {playBackgroundMusic} from './src/untils/BackgroundMusic';
import {loadSoundEffects} from './src/untils/SoundEffects';
import {loadVictorySound} from './src/untils/VictorySound';

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

    const checkNotificationPermission = async () => {
      if (Platform.OS === 'android' && Platform.Version >= 33) {
        const hasPermission = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
  
        if (!hasPermission) {
          const result = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          );
  
          if (result === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('🔔 Notification permission granted');
          } else {
            console.log('🔕 Notification permission denied');
          }
        } else {
          console.log('🔔 Notification permission already granted');
        }
      }
    };
  
    checkNotificationPermission(); // Lần đầu mở app
  
    const appState = useRef(AppState.currentState);
  
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // App được đưa lên foreground
        console.log('📲 App back to foreground, checking permission...');
        checkNotificationPermission();
      }
      appState.current = nextAppState;
    };
  
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );
  
    return () => {
      subscription.remove();
    };
    
    // 🔊 Phát nhạc nền khi mở app
    // playBackgroundMusic();
    loadSoundEffects(); // Load nhạc hiệu ứng
    loadVictorySound(); // 👈 Load file riêng cho chiến thắng
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
