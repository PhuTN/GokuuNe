import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/AppNavigator';
import ChatDetailHeader from '../components/common/ChatDetailScreen/ChatDetailHeader';
import MessageBubble from '../components/common/ChatDetailScreen/MessageBubble';
import MessageInput from '../components/common/ChatDetailScreen/MessageInput';
import {fakeMessages} from '../fake_data/Phuc/fake_data';
import {useTheme} from '../asycnc_store/ThemeContext';
import {useLanguage} from '../asycnc_store/LanguageContext';
import {translations} from '../untils/i18n';
import {
  getConversationById,
  markAllMessagesRead,
  sendMessage,
} from '../api/messageApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {socket} from '../untils/socket';
import {getUserById} from '../api/userApi';

type Props = NativeStackScreenProps<RootStackParamList, 'ChatDetail'>;

export default function ChatDetailScreen({route}: Props) {
  const {conversationId, currentUserId} = route.params;
  const [messages, setMessages] = useState<any[]>([]);
  const {theme} = useTheme();
  const isDark = theme === 'dark';
  const {language} = useLanguage();
  const t = translations[language];
  const flatListRef = useRef<FlatList>(null);
  const didMount = useRef(false);
  const [friendUser, setFriendUser] = useState<any>(null);
  const loadMessages = async () => {
    try {
      const data = await getConversationById(conversationId);
      const user1 = await getUserById(data.user1);
      const user2 = await getUserById(data.user2);

      const defaultAvatar = require('../images/user.png');
      const user1Avatar = user1.avatarUrl
        ? {uri: user1.avatarUrl}
        : defaultAvatar;
      const user2Avatar = user2.avatarUrl
        ? {uri: user2.avatarUrl}
        : defaultAvatar;
      const friend = user1._id === currentUserId ? user2 : user1;
      setFriendUser(friend);

      const formatted = data.messages.map((msg: any) => ({
        id: msg._id ?? `${msg.sender}-${msg.sentAt}`, // fallback key
        message: msg.text,
        sender: msg.sender === currentUserId ? 'me' : 'friend',
        avatar: msg.sender === user1._id ? user1Avatar : user2Avatar,
        sentAt: msg.sentAt,
      }));

      setMessages(formatted);

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({animated: false});
      }, 500);

      await markAllMessagesRead(conversationId, currentUserId);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadMessages();
    didMount.current = true;
    return () => {
      didMount.current = false;
    };
  }, []);

  useEffect(() => {
    const handleChatUpdate = () => loadMessages();
    socket.on('chat:list:refresh', handleChatUpdate);
    return () => socket.off('chat:list:refresh', handleChatUpdate);
  }, [conversationId, currentUserId]);

  const handleSendMessage = async (newMessage: string) => {
    await sendMessage(conversationId, currentUserId, newMessage);
    loadMessages();
  };
  // 👉 reload friend info (onlineStatus) khi user online/offline
  useEffect(() => {
    const reloadFriendUser = async () => {
      try {
        if (friendUser?._id) {
          const updatedFriend = await getUserById(friendUser._id);
          setFriendUser(updatedFriend);
        }
      } catch (err) {
        console.error('Lỗi reload friendUser:', err);
      }
    };

    socket.on('user:online', reloadFriendUser);
    socket.on('user:offline', reloadFriendUser);

    return () => {
      socket.off('user:online', reloadFriendUser);
      socket.off('user:offline', reloadFriendUser);
    };
  }, [friendUser]);
  const renderContent = () => (
    <>
      {friendUser && <ChatDetailHeader user={friendUser} />}
      <View style={styles.todayLabelContainer}>
        <View style={styles.todaySeparator} />
      </View>
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item, index) => item.id ?? index.toString()}
        renderItem={({item, index}) => {
          const itemDate = new Date(item.sentAt);
          const currentDate = itemDate.toDateString();
          const prevDate =
            index > 0
              ? new Date(messages[index - 1].sentAt).toDateString()
              : null;
          const showDateSeparator = currentDate !== prevDate;

          // ✅ Check hôm nay
          const isToday = currentDate === new Date().toDateString();
          let dateLabel = '';
          if (isToday) {
            dateLabel = language === 'vi' ? 'Hôm nay' : 'Today';
          } else {
            dateLabel = itemDate.toLocaleDateString(
              language === 'vi' ? 'vi-VN' : 'en-US',
              {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              },
            );
          }

          return (
            <>
              {showDateSeparator && (
                <View style={styles.dateSeparator}>
                  <Text style={styles.dateText}>{dateLabel}</Text>
                </View>
              )}
              <MessageBubble
                message={item.message}
                sender={item.sender}
                avatar={item.avatar}
              />
            </>
          );
        }}
        contentContainerStyle={styles.messages}
        onLayout={() => {
          if (didMount.current)
            flatListRef.current?.scrollToEnd({animated: false});
        }}
        onContentSizeChange={() => {
          if (didMount.current)
            flatListRef.current?.scrollToEnd({animated: false});
        }}
      />
      <MessageInput onSend={handleSendMessage} />
    </>
  );

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      // tùy chỉnh nếu có header
    >
      {isDark ? (
        <ImageBackground
          source={require('../assets/images/BackGround.png')}
          style={styles.container}
          resizeMode="cover">
          {renderContent()}
        </ImageBackground>
      ) : (
        <View style={[styles.container, {backgroundColor: '#fff'}]}>
          {renderContent()}
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  dateSeparator: {
    alignItems: 'center',
    marginVertical: 8,
  },
  dateText: {
    fontSize: 13,
    color: '#888',
    backgroundColor: '#eee',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  todaySeparator: {
    height: 5,

    width: '100%',
  },
  container: {
    flex: 1,
  },
  messages: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  todayLabelContainer: {
    alignItems: 'center',
    marginVertical: 0,
  },
  todayLabelText: {
    fontSize: 22,
    color: '#000',
  },
});

export default ChatDetailScreen;
