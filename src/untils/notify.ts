// import PushNotification from 'react-native-push-notification';
// import { NotificationType } from '../asycnc_store/NotificationContext';
// import Toast from 'react-native-toast-message';
// import Sound from 'react-native-sound';

// const playSound = () => {
//   const notificationSound = new Sound('custom_sound.mp3', Sound.MAIN_BUNDLE, (error) => {
//     if (error) {
//       console.log('Failed to load sound', error);
//       return;
//     }
//     notificationSound.play();
//   });
// };

// type NotifyType = 'success' | 'info' | 'warning' | 'danger';

// interface NotifyOptions {
//   message: string;
//   description?: string;
//   type?: NotifyType;
//   enabled?: boolean;
//   systemNotification?: boolean;
//   pushState?: NotificationType;
//   inapp?: boolean;
// }

// /**
//  * Hiển thị thông báo Android system notification nếu được bật
//  */
// export const notify = ({
//   message,
//   description,
//   enabled = true,
//   systemNotification = false,
//   pushState = 'on',
//   inapp = false,
//   type = 'info',
// }: NotifyOptions) => {
//   if (!enabled) return;

//   if (inapp) {
//     // Show in-app notification using react-native-toast-message
//     playSound();
//     Toast.show({
//       type,
//       text1: message,
//       text2: description || '',
//       position: 'top',
//       visibilityTime: 2000,
//     });
//   }
  
//   if (systemNotification && pushState === 'on') {
//     PushNotification.localNotification({
//       channelId: 'default-channel-id',
//       title: message,
//       message: description || '',
//       playSound: true,
//       soundName: 'custom_sound',
//       smallIcon: 'ic_notification',
//       importance: 'high',
//       vibrate: true,
//     });
//   }
// };


import Toast from 'react-native-toast-message';
import Sound from 'react-native-sound';
import { NotificationType } from '../asycnc_store/NotificationContext';

const playSound = () => {
  const notificationSound = new Sound('custom_sound.mp3', Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      console.log('Failed to load sound', error);
      return;
    }
    notificationSound.play();
  });
};

type NotifyType = 'success' | 'info' | 'warning' | 'danger';

interface NotifyOptions {
  message: string;
  description?: string;
  type?: NotifyType;
  enabled?: boolean;
  systemNotification?: boolean; // Vẫn giữ cho đúng interface nhưng bỏ dùng
  pushState?: NotificationType;
  inapp?: boolean;
}

/**
 * Hiển thị **chỉ** thông báo trong app bằng react-native-toast-message
 */
export const notify = ({
  message,
  description,
  enabled = true,
  inapp = false,
  type = 'info',
}: NotifyOptions) => {
  // if (!enabled || !inapp) return;

  playSound();
  Toast.show({
    type,
    text1: message,
    text2: description || '',
    position: 'top',
    visibilityTime: 2000,
  });
};
