// src/components/Notification_Permission_Custom.tsx
import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  TouchableWithoutFeedback,
} from 'react-native';
import {useLanguage} from '../../../asycnc_store/LanguageContext';
import {useTheme} from '../../../asycnc_store/ThemeContext';
import {translations} from '../../../untils/i18n';
import NotificationIcon from '../../../assets/icons/notification_permission_icon.svg';
import LinearGradient from 'react-native-linear-gradient';

type Props = {
  visible: boolean;
  setModalVisible: (visible: boolean) => void;
  onClose: () => void;
  contentNoti: string;
  contentButton1: string;
  contentButton2: string;
};

const NotificationPermissionCustom: React.FC<Props> = ({
  visible,
  setModalVisible,
  onClose,
  contentNoti,
  contentButton1,
  contentButton2
}) => {
  const {language, toggleLanguage} = useLanguage();
  const t = translations[language];

  const {theme, toggleTheme} = useTheme();
  const isDark = theme === 'dark';
  const styles = isDark ? darkStyles : lightStyles;

  const hanldeSetting = () => {
    Linking.openSettings();
    setModalVisible(false);
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={() => setModalVisible(false)}>
      <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.container}>
              {/* Hàng đầu - Icon */}
              <NotificationIcon width={60} height={60} />

              {/* Hàng giữa - Nội dung */}
              <View style={styles.contentContainer}>
                {/* <Text style={styles.title}>Thông báo</Text> */}
                <Text style={styles.message}>{contentNoti}</Text>
              </View>

              {/* Hàng cuối - Button */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                  <Text style={styles.cancelText}>
                    {contentButton1}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={hanldeSetting}>
                  <LinearGradient
                    colors={['#6B50F6', '#CC8FED']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 1}}
                    style={styles.settingButton}>
                    <Text style={styles.settingText}>
                      {contentButton2}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default NotificationPermissionCustom;

const lightStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 16,
  },
  icon: {
    width: 60,
    height: 60,
  },
  contentContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    color: 'black',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    gap: 30,
  },
  cancelButton: {
    backgroundColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  settingButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#6B50F6',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  cancelText: {
    color: '#000',
    fontSize: 16,
  },
  settingText: {
    color: 'white',
    fontSize: 16,
  },
});

const darkStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '85%',
    backgroundColor: '#535353',
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 16,
  },
  icon: {
    width: 60,
    height: 60,
  },
  contentContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    color: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    gap: 30,
  },
  cancelButton: {
    backgroundColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  settingButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#6B50F6',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  cancelText: {
    color: '#000',
    fontSize: 16,
  },
  settingText: {
    color: 'white',
    fontSize: 16,
  },
});
