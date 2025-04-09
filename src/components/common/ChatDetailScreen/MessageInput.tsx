import React, {useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import {useTheme} from '../../../asycnc_store/ThemeContext';
import {useLanguage} from '../../../asycnc_store/LanguageContext';
import {translations} from '../../../untils/i18n';

export default function MessageInput({onSend}) {
  const [message, setMessage] = useState(''); // State to store the message
  const {theme} = useTheme();
  const isDark = theme === 'light';
  const {language} = useLanguage();
  const t = translations[language];

  // Handle sending the message
  const handleSend = () => {
    if (message.trim()) {
      onSend(message); // Send the message to the parent component
      setMessage(''); // Clear the input after sending
    }
  };

  return (
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
          style={[
            styles.textInput,
            isDark && {color: '#fff', placeholderTextColor: '#999'},
          ]}
          placeholder={t.type_message}
          placeholderTextColor={isDark ? '#999' : '#9B8F8F'}
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity style={styles.reactIconButton}>
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
    borderColor: '#000', // Black border
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'transparent',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    backgroundColor: 'transparent',
    borderWidth: 0, // No border on TextInput itself
  },
  reactIconButton: {
    marginLeft: 8,
  },
});
