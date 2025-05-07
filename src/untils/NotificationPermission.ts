// src/utils/NotificationPermission.ts
import { PermissionsAndroid, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'NOTIFICATION_PERMISSION_REQUESTED';

export const checkAndRequestNotificationPermission = async (): Promise<'granted' | 'denied' | 'needsSettings' | 'unavailable'> => {
  if (Platform.OS !== 'android' || Platform.Version < 33) return 'unavailable';

  const alreadyRequested = await AsyncStorage.getItem(STORAGE_KEY);
  const hasPermission = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
  );

  if (hasPermission) {
    console.log('🔔 Permission already granted');
    return 'granted';
  }

  if (alreadyRequested !== 'true') {
    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );

    await AsyncStorage.setItem(STORAGE_KEY, 'true');

    if (result === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('✅ Permission granted');
      return 'granted';
    } else {
      console.log('❌ Permission denied');
      return 'denied';
    }
  } else {
    return 'needsSettings';
  }
};
