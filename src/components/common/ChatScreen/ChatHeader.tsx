import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';

export default function ChatHeader() {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Image
          source={require('../../../assets/images/ChatScreen/backIcon.png')}
          style={styles.icon}
          resizeMode="contain"
        />
        <Text style={styles.title}>CHAT</Text>
        <Image
          source={require('../../../assets/images/ChatScreen/settingIcon.png')}
          style={styles.icon}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E5A8FF',
    height: 120,
    borderBottomLeftRadius: 300,
    borderBottomRightRadius: 200,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    paddingBottom: 30,
    marginBottom: 30,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 35, // ← đẩy icon vào giữa
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#FFD700',
    letterSpacing: 1,
  },
  icon: {
    width: 30,
    height: 30,
  },
});
