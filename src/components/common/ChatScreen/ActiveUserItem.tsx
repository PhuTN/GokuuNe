import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Modal,
  Pressable,
  TouchableOpacity,
  Alert,
  ToastAndroid,
} from 'react-native';
import {sendChallengeDirect, unfriendUser} from '../../../api/userApi';
import {socket} from '../../../untils/socket';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NotificationCustom from '../Notification/Notification_Custom';
import {useLanguage} from '../../../asycnc_store/LanguageContext';
import {translations} from '../../../untils/i18n';
import {notify} from '../../../untils/Notify';
import {useNotification} from '../../../asycnc_store/NotificationContext';
import { useNavigation } from '@react-navigation/native';

type Props = {
  user: {
    _id: string;
    username: string;
    displayName: string;
    avatarUrl?: string;
  };
};

export default function ActiveUserItem({user}: Props) {
  const {language, toggleLanguage} = useLanguage();
  const t = translations[language];
  const {notification, toggleNotification} = useNotification();
 const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [modalNotificationCustomVisible, setModalNotificationCustomVisible] =
    useState(false);

  // 🔁 Lấy currentUserId từ AsyncStorage
  React.useEffect(() => {
    const getCurrentUser = async () => {
      const userJson = await AsyncStorage.getItem('currentUser');
      const currentUser = userJson ? JSON.parse(userJson) : null;
      setCurrentUserId(currentUser?._id || null);
    };
    getCurrentUser();
  }, []);

const handleChallenge = async () => {
  setModalVisible(false);

  try {
    if (!currentUserId) {
      ToastAndroid.show('❌ Không tìm thấy người dùng hiện tại', ToastAndroid.SHORT);
      return;
    }

    await sendChallengeDirect(currentUserId, user._id);

    notify({
      message: language === 'vi' ? 'Thách đấu thành công' : 'Challenge sent',
      description: `${user.displayName}`,
      type: 'success',
      inapp: true,
      pushState: notification,
      systemNotification: true,
    });

    socket.emit('challenge:refresh', user._id);
    console.log('📤 challenge:refresh →', user._id);

    // 👇 Sửa tại đây - truyền đúng params
    navigation.navigate('Host', {
      accountLogin: currentUserId,
      friend: user,
      selectedTime: null, // hoặc defaultTime
      match: null,
    });

  } catch (err) {
    console.error('❌ Lỗi khi gửi thách đấu:', err);
    ToastAndroid.show('❌ Lỗi khi gửi thách đấu', ToastAndroid.SHORT);
  }
};


  const handleUnfriend = () => {
    setModalVisible(true);
    setModalNotificationCustomVisible(true);
  };

  const handleUnfriendConfirm = async (confirmed: boolean) => {
    setModalVisible(false);
    if (!confirmed) {
      return;
    }
    try {
      if (!currentUserId) return;
      await unfriendUser(currentUserId, user._id);
      notify({
        message: t.noti_success,
        description: '✅ Đã hủy kết bạn',
        type: 'success',
        systemNotification: true,
        pushState: notification,
        inapp: true,
      });

      // Emit reload cho cả hai
      socket.emit('friend:update', {userId: currentUserId});
      socket.emit('friend:update', {userId: user._id});
    } catch (err) {
      console.error('❌ Lỗi khi hủy kết bạn:', err);
      ToastAndroid.show('❌ Lỗi khi hủy kết bạn', ToastAndroid.SHORT);
    }
  };
console.log("HELLLO",user)
  return (
    <>
      <TouchableOpacity
        onLongPress={() => setModalVisible(true)}
        style={styles.userItem}>
        <Image
          source={
            user.avatarUrl
              ? {uri: user.avatarUrl}
              : require('../../../images/user.png')
          }
          style={styles.avatar}
          resizeMode="cover"
        />
        <Text style={styles.name}>{user.displayName}</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}>
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <Pressable style={styles.modalButton} onPress={handleChallenge}>
              <Text style={styles.modalText}>
  {language === 'vi' ? 'Thách đấu' : 'Challenge'}
</Text>
            </Pressable>

            <View style={styles.separator} />

            <Pressable style={styles.modalButton} onPress={handleUnfriend}>
             
<Text style={[styles.modalText, { color: 'red' }]}>
  {language === 'vi' ? 'Hủy kết bạn' : 'Unfriend'}
</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      <NotificationCustom
        visible={modalNotificationCustomVisible}
        setModalVisible={setModalNotificationCustomVisible}
        onClose={() => setModalNotificationCustomVisible(false)}
        contentNotification={`${t.noti_unfriend_confirm} ${user.displayName}`}
        contentButtonNo={t.noti_confirm_no}
        contentButtonYes={t.noti_confirm_yes}
        onConfirm={handleUnfriendConfirm}
      />
    </>
  );
}

const styles = StyleSheet.create({
  userItem: {
    alignItems: 'center',
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#8B2CFF',
  },
  name: {
    marginTop: 6,
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: 250,
    elevation: 10,
  },
  modalButton: {
    paddingVertical: 12,
  },
  modalText: {
    fontSize: 16,
    textAlign: 'left',
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: '#DDD',
    marginVertical: 4,
  },
});
