import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  ToastAndroid,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../asycnc_store/ThemeContext';
import { unfriendUser } from '../../../api/userApi';
import { socket } from '../../../untils/socket';
import { useLanguage } from '../../../asycnc_store/LanguageContext';
import { translations } from '../../../untils/i18n';
import { notify } from '../../../untils/Notify';
import { useNotification } from '../../../asycnc_store/NotificationContext';
import NotificationCustom from '../Notification/Notification_Custom';

export default function ChatCardItem({ chat, currentUserId }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalNotificationCustomVisible, setModalNotificationCustomVisible] = useState(false);

  const { language } = useLanguage();
  const t = translations[language];
  const { notification } = useNotification();

  const goToChatDetail = () => {
    navigation.navigate('ChatDetail', {
      conversationId: chat.conversationId,
      currentUserId,
    });
  };

  const formatTime = (isoTime) => {
    if (!isoTime) return '';
    const date = new Date(isoTime);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleChallenge = () => {
    setModalVisible(false);
    console.log('Thách đấu với:', chat.friend.displayName);
    // Implement challenge logic here, e.g., navigate to Host screen
  };

  const handleUnfriend = () => {
    setModalVisible(false); // Close the first modal
    setModalNotificationCustomVisible(true); // Open confirmation modal
  };

  const handleUnfriendConfirm = async (confirmed: boolean) => {
    setModalNotificationCustomVisible(false); // Close confirmation modal
    if (!confirmed) {
      return;
    }
    try {
      if (!currentUserId || !chat.friend._id) return;
      await unfriendUser(currentUserId, chat.friend._id);
      notify({
        message: t.noti_success,
        description: '✅ Đã hủy kết bạn',
        type: 'success',
        systemNotification: true,
        pushState: notification,
        inapp: true,
      });

      // Emit reload for both users
      socket.emit('friend:update', { userId: currentUserId });
      socket.emit('friend:update', { userId: chat.friend._id });
    } catch (err) {
      console.error('❌ Lỗi khi hủy kết bạn:', err);
      notify({
        message: t.noti_danger,
        description: '❌ Lỗi khi hủy kết bạn',
        type: 'danger',
        systemNotification: true,
        pushState: notification,
        inapp: true,
      });
    }
  };

  return (
    <>
      <TouchableOpacity
        onPress={goToChatDetail}
        onLongPress={() => setModalVisible(true)}>
        <View style={[styles.card, isDark && { backgroundColor: '#1E1E1E' }]}>
          <Image
            source={
              chat.friend.avatarUrl
                ? { uri: chat.friend.avatarUrl }
                : require('../../../images/user.png')
            }
            style={styles.avatar}
          />
          <View style={{ flex: 1 }}>
            <Text style={[styles.name, isDark && { color: '#fff' }]}>{chat.friend.displayName}</Text>
            <Text style={[styles.message, isDark && { color: '#aaa' }]}>
              {chat.isYou ? 'You: ' : ''}
              {chat.lastMessage}
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={[styles.time, isDark && { color: '#aaa' }]}>{formatTime(chat.lastMessageTime)}</Text>
            {chat.unreadCount > 0 && (
              <View style={styles.unreadBubble}>
                <Text style={styles.unreadText}>{chat.unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}>
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}>
          <View style={[styles.modalContent, isDark && { backgroundColor: '#2c2c2c' }]}>
            <Pressable style={styles.modalButton} onPress={handleChallenge}>
              <Text style={[styles.modalText, isDark && { color: '#fff' }]}>Thách đấu</Text>
            </Pressable>
            <View style={[styles.separator, isDark && { backgroundColor: '#444' }]} />
            <Pressable style={styles.modalButton} onPress={handleUnfriend}>
              <Text style={[styles.modalText, { color: 'red' }]}>Hủy kết bạn</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      <NotificationCustom
        visible={modalNotificationCustomVisible}
        setModalVisible={setModalNotificationCustomVisible}
        onClose={() => setModalNotificationCustomVisible(false)}
        contentNotification={`${t.noti_unfriend_confirm} ${chat.friend.displayName}`}
        contentButtonNo={t.noti_confirm_no}
        contentButtonYes={t.noti_confirm_yes}
        onConfirm={handleUnfriendConfirm}
      />
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#C182FF',
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 14,
    padding: 12,
    alignItems: 'center',
  },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  name: { fontWeight: 'bold', color: '#FFD700', fontSize: 13 },
  message: { color: '#fff', fontSize: 13, marginTop: 2 },
  time: { fontSize: 11, color: '#fff' },
  unreadBubble: {
    backgroundColor: '#6A00FF',
    borderRadius: 10,
    paddingHorizontal: 6,
    marginTop: 6,
  },
  unreadText: { fontSize: 12, color: '#fff', fontWeight: 'bold' },
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
    width: 200,
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
