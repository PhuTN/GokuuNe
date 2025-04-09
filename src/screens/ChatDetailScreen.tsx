import React, {useState} from 'react';
import {View, FlatList, StyleSheet, Text, ImageBackground} from 'react-native';
import ChatDetailHeader from '../components/common/ChatDetailScreen/ChatDetailHeader';
import MessageBubble from '../components/common/ChatDetailScreen/MessageBubble';
import MessageInput from '../components/common/ChatDetailScreen/MessageInput';
import {fakeMessages} from '../fake_data/Phuc/fake_data';
import {useTheme} from '../asycnc_store/ThemeContext';
import {useLanguage} from '../asycnc_store/LanguageContext';
import {translations} from '../untils/i18n';

const ChatDetailScreen = () => {
  const [messages, setMessages] = useState(fakeMessages);
  const {theme} = useTheme();
  const isDark = theme === 'light';
  const {language} = useLanguage();
  const t = translations[language];

  const handleSendMessage = newMessage => {
    setMessages([
      ...messages,
      {
        id: String(messages.length + 1),
        message: newMessage,
        sender: 'me',
        time: 'Just now',
      },
    ]);
  };

  const renderContent = () => (
    <>
      <ChatDetailHeader />
      <View style={styles.todayLabelContainer}>
        <Text style={[styles.todayLabelText, isDark && {color: '#fff'}]}>
          {t.today_label}
        </Text>
      </View>
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <MessageBubble
            message={item.message}
            sender={item.sender}
            avatar={item.avatar}
          />
        )}
        contentContainerStyle={styles.messages}
      />
      <MessageInput onSend={handleSendMessage} />
    </>
  );

  return isDark ? (
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messages: {
    paddingTop: 10,
    paddingBottom: 60,
  },
  todayLabelContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  todayLabelText: {
    fontSize: 22,
    color: '#000',
  },
});

export default ChatDetailScreen;
