import React, {useState} from 'react';
import {View, FlatList, StyleSheet, Text} from 'react-native';
import ChatDetailHeader from '../components/common/ChatDetailScreen/ChatDetailHeader';
import MessageBubble from '../components/common/ChatDetailScreen/MessageBubble';
import MessageInput from '../components/common/ChatDetailScreen/MessageInput';
import {fakeMessages} from '../fake_data/Phuc/fake_data'; // Import fake data

const ChatDetailScreen = () => {
  const [messages, setMessages] = useState(fakeMessages);

  // Handle sending a new message
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

  return (
    <View style={styles.container}>
      <ChatDetailHeader />
      {/* Add "Today" label below the header */}
      <View style={styles.todayLabelContainer}>
        <Text style={styles.todayLabelText}>Today</Text>
      </View>
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <MessageBubble
            message={item.message}
            sender={item.sender}
            avatar={item.avatar} // Truyền avatar vào đây
          />
        )}
        contentContainerStyle={styles.messages}
      />
      <MessageInput onSend={handleSendMessage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  messages: {paddingTop: 10, paddingBottom: 60}, // Add space for input
  todayLabelContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  todayLabelText: {
    fontSize: 22,
  },
});

export default ChatDetailScreen;
