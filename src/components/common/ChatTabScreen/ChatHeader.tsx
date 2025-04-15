import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';

const ChatHeader = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Nút back */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.leftIcon}>
        <Icon name="arrow-left" size={26} color="#fff" />
      </TouchableOpacity>

      {/* Tiêu đề ở giữa */}
      <View style={styles.centerTitleContainer}>
        <Text style={styles.title}>Chat</Text>
      </View>

      {/* Icon bên phải */}
      <View style={styles.rightIcons}>
        <TouchableOpacity style={styles.icon}>
          <Icon name="account-plus" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.icon}>
          <Icon name="alert-circle-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatHeader;

const styles = StyleSheet.create({
  container: {
    height: 55,
    backgroundColor: '#1a1a1a',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    position: 'relative',
  },
  leftIcon: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  centerTitleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  title: {
    fontSize: 24, // 👈 tăng cỡ chữ
    fontWeight: 'bold',
    color: '#fff',
  },
  rightIcons: {
    flexDirection: 'row',
    marginLeft: 'auto',
  },
  icon: {
    marginLeft: 16,
  },
});
