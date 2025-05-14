import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../asycnc_store/ThemeContext';

export default function ChatCardItem({  chat, currentUserId  }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigation = useNavigation();

  const goToChatDetail = () => {
    navigation.navigate('ChatDetail', { conversationId: chat.conversationId,currentUserId });   // ✅ truyền conversationId nếu cần
  };

  // 🕑 Format time (có thể tuỳ chỉnh theo moment, dayjs... nếu muốn)
  const formatTime = (isoTime) => {
    if (!isoTime) return '';
    const date = new Date(isoTime);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <TouchableOpacity onPress={goToChatDetail}>
      <View style={[styles.card, isDark && { backgroundColor: '#1E1E1E' }]}>
        <Image
          source={
            chat.friend.avatarUrl
              ? { uri: chat.friend.avatarUrl }
              : require('../../../images/user.png')    // fallback nếu không có avatar
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
  avatar: {width: 50, height: 50, borderRadius: 25, marginRight: 12},
  name: {fontWeight: 'bold', color: '#FFD700', fontSize: 13},
  message: {color: '#fff', fontSize: 13, marginTop: 2},
  time: {fontSize: 11, color: '#fff'},
  unreadBubble: {
    backgroundColor: '#6A00FF',
    borderRadius: 10,
    paddingHorizontal: 6,
    marginTop: 6,
  },
  unreadText: {fontSize: 12, color: '#fff', fontWeight: 'bold'},
});
