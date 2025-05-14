import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

type Props = {
  user: {
    _id: string;
    username: string;
    avatarUrl?: string;
  };
};

export default function ActiveUserItem({ user }: Props) {
  return (
    <View style={styles.userItem}>
      <Image
        source={
          user.avatarUrl
            ? { uri: user.avatarUrl }
            : require('../../../images/user.png')
        }
        style={styles.avatar}
        resizeMode="cover"
      />
      <Text style={styles.name}>{user.displayName}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  userItem: {
    alignItems: 'center',
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,                       // 🟢 Bo tròn hoàn hảo
    borderWidth: 3,                         // 🟢 Viền dày
    borderColor: '#8B2CFF',                 // 🟣 Viền màu tím
  },
  name: {
    marginTop: 6,
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});
