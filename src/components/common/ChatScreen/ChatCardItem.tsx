import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, Pressable, Alert, ToastAndroid } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../asycnc_store/ThemeContext';
import { unfriendUser } from '../../../api/userApi';
import { socket } from '../../../untils/socket';

export default function ChatCardItem({ chat, currentUserId }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

  const goToChatDetail = () => {
    navigation.navigate('ChatDetail', { conversationId: chat.conversationId, currentUserId });
  };

  const formatTime = (isoTime) => {
    if (!isoTime) return '';
    const date = new Date(isoTime);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleChallenge = () => {
    setModalVisible(false);
    console.log('Thách đấu với:', chat.friend.displayName);
  };

 const handleUnfriend = () => {
    setModalVisible(false);

    Alert.alert(
      'Xác nhận',
      `Bạn có chắc chắn muốn hủy kết bạn với ${chat.friend.displayName}?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xác nhận',
          style: 'destructive',
          onPress: async () => {
            try {
              await unfriendUser(currentUserId, chat.friend._id);
              ToastAndroid.show('✅ Đã hủy kết bạn', ToastAndroid.SHORT);

              // Emit reload cho cả 2 user
              socket.emit('friend:update', { userId: currentUserId });
              socket.emit('friend:update', { userId: chat.friend._id });

            } catch (err) {
              console.error('❌ Lỗi khi hủy kết bạn:', err);
              ToastAndroid.show('❌ Lỗi khi hủy kết bạn', ToastAndroid.SHORT);
            }
          },
        },
      ]
    );
  };

  console.log(chat.friend._id)
  return (
    <>
      <TouchableOpacity
        onPress={goToChatDetail}
        onLongPress={() => setModalVisible(true)}
      >
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
            <Text style={styles.name}>{chat.friend.displayName}</Text>
            <Text style={styles.message}>
              {chat.isYou ? 'You: ' : ''}
              {chat.lastMessage}
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.time}>{formatTime(chat.lastMessageTime)}</Text>
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
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <Pressable style={styles.modalButton} onPress={handleChallenge}>
              <Text style={styles.modalText}>Thách đấu</Text>
            </Pressable>

            <View style={styles.separator} />

            <Pressable style={styles.modalButton} onPress={handleUnfriend}>
              <Text style={[styles.modalText, { color: 'red' }]}>Hủy kết bạn</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
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
