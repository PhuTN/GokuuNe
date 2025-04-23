import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';

type Props = {
  user: {
    id: string | number;
    name: string;
    avatar: any;
    bgColor?: string;
  };
};

export default function ActiveUserItem({user}: Props) {
  return (
    <View style={styles.userItem}>
      <View
        style={[
          styles.avatarWrapper,
          {backgroundColor: user.bgColor || '#00A3FF'},
        ]}>
        <Image
          source={user.avatar}
          style={styles.avatar}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.name}>{user.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  userItem: {
    alignItems: 'center',
    marginRight: 16,
  },
  avatarWrapper: {
    width: 80,
    height: 100,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatar: {
    width: 60,
    height: 60,
  },
  name: {
    marginTop: 6,
    fontSize: 12,
    color: '#999',
  },
});
