import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ChatFloatingBar = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.iconCircle}>
        <View style={styles.redDot} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.icon}>
        <Icon name="folder" size={20} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.icon}>
        <Icon name="cog-outline" size={20} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.icon}>
        <Icon name="close" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default ChatFloatingBar;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 300, // cao hơn footer
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 24,
    paddingVertical: 6,
    paddingHorizontal: 10,
    elevation: 5,
    zIndex: 10,
  },
  icon: {
    marginHorizontal: 4,
  },
  iconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  redDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'red',
  },
});
