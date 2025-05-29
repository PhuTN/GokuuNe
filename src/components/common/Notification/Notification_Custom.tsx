import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { useLanguage } from '../../../asycnc_store/LanguageContext';
import { useTheme } from '../../../asycnc_store/ThemeContext';
import { translations } from '../../../untils/i18n';
import NotificationIcon from '../../../assets/icons/notification_permission_icon.svg';
import LinearGradient from 'react-native-linear-gradient';

type Props = {
  visible: boolean;
  setModalVisible: (visible: boolean) => void;
  onClose: () => void;
  contentNotification: string;
  contentButtonNo: string;
  contentButtonYes: string;
  onConfirm: (confirmed: boolean) => void;
};

const NotificationCustom: React.FC<Props> = ({
  visible,
  setModalVisible,
  onClose,
  contentNotification,
  contentButtonNo,
  contentButtonYes,
  onConfirm,
}) => {
  const { language } = useLanguage();
  const t = translations[language];

  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const styles = isDark ? darkStyles : lightStyles;

  const handleYes = () => {
    onConfirm(true);
    setModalVisible(false);
  };

  const handleNo = () => {
    onConfirm(false);
    setModalVisible(false);
  };

  const handleOverlayPress = () => {
    onConfirm(false);
    setModalVisible(false);
    onClose();
  };

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={handleOverlayPress}>
      <TouchableWithoutFeedback onPress={handleOverlayPress}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.container}>
              <NotificationIcon width={60} height={60} />
              <View style={styles.contentContainer}>
                <Text style={styles.message}>{contentNotification}</Text>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={handleNo}>
                  <LinearGradient
                    colors={['#ccc', '#aaa']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.cancelButton}>
                    <Text style={styles.cancelText}>{contentButtonNo}</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleYes}>
                  <LinearGradient
                    colors={['#6B50F6', '#CC8FED']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.settingButton}>
                    <Text style={styles.settingText}>{contentButtonYes}</Text>
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
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  settingButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#6B50F6',
    shadowOffset: { width: 0, height: 2 },
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
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  settingButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#6B50F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  cancelText: {
    color: '#fff',
    fontSize: 16,
  },
  settingText: {
    color: 'white',
    fontSize: 16,
  },
});

export default NotificationCustom;