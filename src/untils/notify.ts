import { showMessage } from 'react-native-flash-message';

type NotifyType = 'success' | 'info' | 'warning' | 'danger';

interface NotifyOptions {
  message: string;
  description?: string;
  type?: NotifyType;
  enabled?: boolean;
  backgroundColor?: string;
  color?: string;
  icon?: 'auto' | 'success' | 'info' | 'warning' | 'danger' | 'none';
}

/**
 * Helper hiển thị thông báo (flash message) toàn app.
 * @param options NotifyOptions
 */
export const notify = ({
  message,
  description,
  type = 'info',
  enabled = true,
  backgroundColor,
  color = '#fff',
  icon = 'auto',
}: NotifyOptions) => {
  if (!enabled) return;

  const typeColors: Record<NotifyType, string> = {
    success: '#27AE60',
    info: '#2D9CDB',
    warning: '#F2C94C',
    danger: '#EB5757',
  };

  showMessage({
    message,
    description,
    type,
    backgroundColor: backgroundColor || typeColors[type],
    color,
    icon,
  });
};
