import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';

export default function ChatCardItem({chat}) {
  return (
    <View style={styles.card}>
      <Image source={chat.avatar} style={styles.avatar} />
      <View style={{flex: 1}}>
        <Text style={styles.name}>{chat.user}</Text>
        <Text style={styles.message}>{chat.message}</Text>
      </View>
      <View style={{alignItems: 'flex-end'}}>
        <Text style={styles.time}>{chat.time}</Text>
        {chat.unreadCount > 0 && (
          <View style={styles.unreadBubble}>
            <Text style={styles.unreadText}>{chat.unreadCount}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#C182FF',
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 14,
    padding: 12,
    alignItems: 'center',
  },
  avatar: {width: 50, height: 50, borderRadius: 25, marginRight: 12},
  name: {fontWeight: 'bold', color: '#FFD700', fontSize: 13},
  message: {color: '#fff', fontSize: 13, marginTop: 2},
  time: {fontSize: 11, color: '#fff'},
  unreadBubble: {
    backgroundColor: '#6A00FF',
    borderRadius: 10,
    paddingHorizontal: 6,
    marginTop: 6,
  },
  unreadText: {fontSize: 12, color: '#fff', fontWeight: 'bold'},
});
