import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const emojiList = [
  '😀',
  '😃',
  '😄',
  '😁',
  '😆',
  '😅',
  '🤣',
  '😂',
  '🙂',
  '🙃',
  '😉',
  '😊',
  '😇',
  '😍',
  '🥰',
  '😘',
  '😗',
  '😚',
  '😙',
  '😋',
  '😛',
  '😜',
  '🤪',
  '😝',
  '🤑',
  '🤗',
  '🤭',
  '🤫',
  '🤔',
  '🤐',
  '🤨',
  '😐',
  '😑',
  '😶',
  '😏',
  '😒',
  '🙄',
  '😬',
  '🤥',
  '😌',
  '😔',
  '😪',
  '🤤',
  '😴',
  '😷',
  '🤒',
  '🤕',
  '🤢',
  '🤮',
  '🤧',
  '🥵',
  '🥶',
  '🥴',
  '😵',
  '🤯',
  '🤠',
  '🥳',
  '😎',
  '🤓',
  '🧐',
  '😕',
  '😟',
  '🙁',
  '☹️',
  '😮',
  '😯',
  '😲',
  '😳',
  '🥺',
  '😦',
  '😧',
  '😨',
  '😰',
  '😥',
  '😢',
  '😭',
  '😱',
  '😖',
  '😣',
  '😞',
  '😓',
  '😩',
  '😫',
  '🥱',
  '😤',
  '😡',
  '😠',
  '🤬',
  '😈',
  '👿',
  '💀',
  '☠️',
  '💩',
  '🤡',
  '👹',
  '👺',
  '👻',
  '👽',
  '👾',
  '🤖',
  '😺',
  '😸',
  '😹',
  '😻',
  '😼',
  '😽',
  '🙀',
  '😿',
  '😾',
  '🙈',
  '🙉',
  '🙊',
  '💋',
  '💌',
];

const ChatMainTabs = () => {
  const [activeTab, setActiveTab] = useState<'Chat' | 'Quick'>('Chat');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleSend = (text: string) => {
    if (text.trim()) {
      setMessages(prev => [...prev, text.trim()]);
      setMessage('');
    }
  };

  const emojis = {
    GENERAL: [
      '😀',
      '😁',
      '😂',
      '😢',
      '😡',
      '😎',
      '🤮',
      '🥶',
      '😴',
      '🤯',
      '😳',
      '🤓',
      '😭',
      '😍',
      '😆',
      '😅',
      '😐',
      '😤',
      '🤬',
      '😇',
      '😱',
      '🥹',
      '😬',
      '🤡',
      '😶',
      '🤔',
      '🤫',
      '😪',
      '😷',
      '🥴',
      '🤢',
      '😈',
      '😵',
      '🥳',
      '🙄',
      '😕',
      '👋',
      '👏',
      '👍',
      '👎',
      '🙏',
      '💪',
      '🇺🇦',
      '☕',
      '🍩',
      '🌍',
      '🌈',
      '🐼',
    ],
    CHESS: [
      '♔',
      '♕',
      '♖',
      '♗',
      '♘',
      '♙',
      '♚',
      '♛',
      '♜',
      '♝',
      '♞',
      '♟',
      '🏁',
      '🤝',
      '🔢',
      '#',
      '⏱',
      '⚡',
      '📅',
      '🎯',
      '🏆',
      '🎖️',
      '🔫',
      '🧩',
      '🗡️',
      '🧠',
      '🛡️',
      '🎲',
      '👑',
      '📈',
      '📉',
      '📤',
      '🪙',
      '🏅',
      '📬',
      '🚩',
    ],
  };

  const quickReplies = [
    'Hello',
    'Good luck',
    'Thanks',
    'Oops',
    'Good move',
    'Sorry',
    'Good game',
    'Interesting',
    'Nice try',
    'Wow',
    'Let’s play again',
    'Well done',
  ];

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabBar}>
        {['Chat', 'Quick'].map(tab => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab as any)}
            style={styles.tabItem}>
            <Text
              style={[styles.tabText, activeTab === tab && styles.activeTab]}>
              {tab}
            </Text>
            {activeTab === tab && <View style={styles.activeLine} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Chat Tab */}
      {activeTab === 'Chat' ? (
        <View style={styles.chatView}>
          <ScrollView style={styles.messageArea}>
            {messages.map((msg, idx) => (
              <View key={idx} style={styles.messageBubble}>
                <Text style={styles.messageText}>{msg}</Text>
              </View>
            ))}
          </ScrollView>

          {showEmojiPicker && (
            <View style={styles.emojiPicker}>
              <ScrollView contentContainerStyle={styles.emojiGrid}>
                {emojiList.map((e, i) => (
                  <TouchableOpacity
                    key={i}
                    onPress={() => setMessage(prev => prev + e)}>
                    <Text style={styles.emoji}>{e}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          <Text style={styles.chatNotice}>
            Please be kind and respectful in your messages. You can block and
            report unfriendly messages.
          </Text>

          <View style={styles.inputBar}>
            <TouchableOpacity onPress={() => setShowEmojiPicker(prev => !prev)}>
              <Icon
                name="emoticon-outline"
                size={20}
                color="#fff"
                style={{marginHorizontal: 6}}
              />
            </TouchableOpacity>
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Send a message..."
              placeholderTextColor="#aaa"
              style={styles.textInput}
            />
            <View style={styles.chatActions}>
              <Icon
                name="paperclip"
                size={20}
                color="#fff"
                style={{marginHorizontal: 6}}
              />
              <TouchableOpacity onPress={() => handleSend(message)}>
                <Icon
                  name="send"
                  size={20}
                  color="#fff"
                  style={{marginHorizontal: 6}}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        <ScrollView style={styles.quickView}>
          <Text style={styles.category}>GENERAL</Text>
          <View style={styles.emojiGrid}>
            {emojis.GENERAL.map((e, i) => (
              <TouchableOpacity key={i} onPress={() => handleSend(e)}>
                <Text style={styles.emoji}>{e}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.category}>CHESS</Text>
          <View style={styles.emojiGrid}>
            {emojis.CHESS.map((e, i) => (
              <TouchableOpacity key={i} onPress={() => handleSend(e)}>
                <Text style={styles.emoji}>{e}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.quickReplyGrid}>
            {quickReplies.map((txt, i) => (
              <TouchableOpacity
                key={i}
                style={styles.quickReply}
                onPress={() => handleSend(txt)}>
                <Text>{txt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default ChatMainTabs;

const styles = StyleSheet.create({
  container: {flex: 1},
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomColor: '#555',
    borderBottomWidth: 1,
    backgroundColor: '#1a1a1a',
  },
  tabItem: {alignItems: 'center', paddingVertical: 12},
  tabText: {fontSize: 16, color: '#aaa'},
  activeTab: {color: '#fff', fontWeight: 'bold'},
  activeLine: {
    height: 2,
    backgroundColor: '#fff',
    width: '100%',
    marginTop: 5,
  },
  chatView: {
    flex: 1,
    padding: 10,
    backgroundColor: '#2e2b2b',
    justifyContent: 'flex-end',
  },
  messageArea: {flexGrow: 0},
  messageBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#444',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginBottom: 8,
    maxWidth: '80%',
  },
  messageText: {color: '#fff', fontSize: 14},
  chatNotice: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 10,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  textInput: {flex: 1, color: '#fff', fontSize: 14},
  chatActions: {flexDirection: 'row', alignItems: 'center'},
  quickView: {
    flex: 1,
    padding: 10,
    backgroundColor: '#2e2b2b',
  },
  category: {
    color: '#eee',
    fontSize: 14,
    marginVertical: 10,
  },
  emojiPicker: {
    maxHeight: 200,
    backgroundColor: '#1a1a1a',
    borderTopWidth: 1,
    borderColor: '#444',
    marginVertical: 8,
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  emoji: {
    fontSize: 24,
    margin: 6,
  },
  quickReplyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  quickReply: {
    backgroundColor: '#ccc',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    margin: 5,
  },
});
