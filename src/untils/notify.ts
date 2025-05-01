import PushNotification from 'react-native-push-notification';
import { NotificationType } from '../asycnc_store/NotificationContext';

type NotifyType = 'success' | 'info' | 'warning' | 'danger';

interface NotifyOptions {
  message: string;
  description?: string;
  type?: NotifyType;
  enabled?: boolean;
  systemNotification?: boolean;
  pushState?: NotificationType;
}

/**
 * Hiển thị thông báo Android system notification nếu được bật
 */
export const notify = ({
  message,
  description,
  enabled = true,
  systemNotification = false,
  pushState = 'on',
}: NotifyOptions) => {
  if (!enabled) return;

  if (systemNotification && pushState === 'on') {
    PushNotification.localNotification({
      channelId: 'default-channel-id',
      title: message,
      message: description || '',
      playSound: true,
      soundName: 'custom_sound',
      smallIcon: 'ic_notification',
      importance: 'high',
      vibrate: true,
    });
  }
};
