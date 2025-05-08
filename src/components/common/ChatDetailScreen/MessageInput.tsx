import React, {useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Text,
} from 'react-native';
import {useTheme} from '../../../asycnc_store/ThemeContext';
import {useLanguage} from '../../../asycnc_store/LanguageContext';
import {translations} from '../../../untils/i18n';

// 👉 emoji list (100+ phổ biến)
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

export default function MessageInput({
  onSend,
}: {
  onSend: (msg: string) => void;
}) {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const {theme} = useTheme();
  const isDark = theme === 'dark';
  const {language} = useLanguage();
  const t = translations[language];

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage('');
      setShowEmojiPicker(false);
    }
  };

  const renderEmoji = ({item}: {item: string}) => (
    <TouchableOpacity
      style={styles.emojiBox}
      onPress={() => {
        setMessage(prev => prev + item);
        setShowEmojiPicker(false);
      }}>
      <Text style={styles.emoji}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={80}>
        <View
          style={[
            styles.container,
            isDark && {backgroundColor: '#1E1E1E', borderTopColor: '#333'},
          ]}>
          <TouchableOpacity style={styles.iconButton}>
            <Image
              source={require('../../../assets/images/ChatDetailScreen/attach.png')}
              style={styles.icon}
            />
          </TouchableOpacity>

          <View
            style={[
              styles.inputContainer,
              isDark && {
                backgroundColor: '#2A2A2A',
                borderColor: '#444',
              },
            ]}>
            <TextInput
              style={[styles.textInput, isDark && {color: '#fff'}]}
              placeholder={t.type_message}
              placeholderTextColor={isDark ? '#999' : '#9B8F8F'}
              value={message}
              onChangeText={setMessage}
            />
            <TouchableOpacity
              style={styles.reactIconButton}
              onPress={() => setShowEmojiPicker(prev => !prev)}>
              <Image
                source={require('../../../assets/images/ChatDetailScreen/reactIcon.png')}
                style={styles.iconReact}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.iconButton} onPress={handleSend}>
            <Image
              source={require('../../../assets/images/ChatDetailScreen/sendIcon.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {showEmojiPicker && (
        <View style={styles.emojiPickerContainer}>
          <FlatList
            data={emojiList}
            keyExtractor={(_, index) => index.toString()}
            numColumns={8}
            renderItem={renderEmoji}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'transparent',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  iconButton: {
    marginRight: 12,
  },
  icon: {
    width: 36,
    height: 36,
  },
  iconReact: {
    width: 30,
    height: 28,
  },
  inputContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'transparent',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  reactIconButton: {
    marginLeft: 8,
  },
  emojiPickerContainer: {
    height: 280,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  emojiBox: {
    width: '12.5%',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 16,
  },
});
