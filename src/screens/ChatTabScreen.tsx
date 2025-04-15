import React from 'react';
import {View, StyleSheet, Platform, StatusBar} from 'react-native';
import ChatHeader from '../components/common/ChatTabScreen/ChatHeader';
import ChatMainTabs from '../components/common/ChatTabScreen/ChatMainTabs';

const ChatTabScreen = () => {
  return (
    <View style={styles.container}>
      {/* Safe area + Header */}
      <View style={styles.safeArea}>
        <ChatHeader />
      </View>

      {/* Content + Footer chia riêng */}
      <View style={styles.body}>
        <View style={styles.chatContent}>
          <ChatMainTabs />
        </View>

        {/* Footer cố định đáy */}
        <View style={styles.footer}>{/* Sẽ có TextInput, icon sau */}</View>
      </View>
    </View>
  );
};

export default ChatTabScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2e2b2b',
  },
  safeArea: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: '#1a1a1a',
  },
  body: {
    flex: 1, // 👈 phần chiếm toàn bộ còn lại
    justifyContent: 'space-between', // 👈 đẩy footer xuống
  },
  chatContent: {
    flex: 1,
    // backgroundColor: 'transparent', // tùy mày thêm gì ở đây
  },
  footer: {
    height: 120,
    backgroundColor: '#000',
    width: '100%',
  },
});
