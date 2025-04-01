import React, {useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';

export default function MessageInput({onSend}) {
  const [message, setMessage] = useState(''); // State to store the message

  // Handle sending the message
  const handleSend = () => {
    if (message.trim()) {
      onSend(message); // Send the message to the parent component
      setMessage(''); // Clear the input after sending
    }
  };

  return (
    <View style={styles.container}>
      {/* Attach Icon */}
      <TouchableOpacity style={styles.iconButton}>
        <Image
          source={require('../../../assets/images/ChatDetailScreen/attach.png')}
          style={styles.icon}
        />
      </TouchableOpacity>

      {/* Text Input with React Icon inside */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Type your message"
          placeholderTextColor="#9B8F8F"
          value={message} // Bind the input to the state
          onChangeText={setMessage} // Update the message state as user types
        />
        <TouchableOpacity style={styles.reactIconButton}>
          <Image
            source={require('../../../assets/images/ChatDetailScreen/reactIcon.png')}
            style={styles.iconReact}
          />
        </TouchableOpacity>
      </View>

      {/* Send Icon */}
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
