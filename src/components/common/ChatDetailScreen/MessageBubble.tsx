import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {useTheme} from '../../../asycnc_store/ThemeContext';

const MessageBubble = ({message, sender, avatar}) => {
  const {theme} = useTheme();
  const isDark = theme === 'light';
  return (
    <View
      style={[
        styles.bubble,
        sender === 'me'
          ? styles.meBubble
          : [styles.otherBubble, isDark && styles.darkOtherBubble],
      ]}>
      {sender === 'other' && avatar && (
        <View style={styles.avatarContainer}>
          <Image source={avatar} style={styles.avatar} />
        </View>
      )}
      <Text
        style={[
          styles.message,
          sender === 'me'
            ? styles.meMessage
            : [styles.otherMessage, isDark && styles.darkOtherMessage],
        ]}>
        {message}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  bubble: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 15,
    maxWidth: '80%',
    flexDirection: 'row', // Giữ cho avatar và tin nhắn nằm cạnh nhau
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10,
  },
  meBubble: {
    backgroundColor: '#8B2CFF',
    alignSelf: 'flex-end',
  },
  otherBubble: {
    backgroundColor: 'transparent',
    alignSelf: 'flex-start',
    borderWidth: 1, // Đặt viền đen cho tin nhắn của đối phương
    borderColor: '#000', // Màu viền đen
    marginLeft: 40, // Thêm khoảng cách từ bên trái để avatar không chồng lên tin nhắn
  },
  message: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 12, // Khoảng cách giữa avatar và tin nhắn
    marginRight: 26,
  },
  meMessage: {
    color: '#fff',
  },
  otherMessage: {
    color: '#333',
  },
  avatarContainer: {
    marginRight: 8, // Khoảng cách giữa avatar và tin nhắn
    marginLeft: -45, // Đưa avatar ra ngoài viền của tin nhắn
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15, // Giữ avatar hình tròn
  },
  darkOtherBubble: {
    backgroundColor: '#000',
    borderColor: 'transparent', // bỏ viền
  },

  darkOtherMessage: {
    color: '#fff',
  },
});

export default MessageBubble;
