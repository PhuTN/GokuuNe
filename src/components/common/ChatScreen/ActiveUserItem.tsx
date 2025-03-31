import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';

const users = [
  {
    id: 1,
    name: 'Isabelle',
    avatar: require('../../../assets/images/ChatScreen/avt1.png'),
    bgColor: '#F7DF56',
  },
  {
    id: 2,
    name: 'Ethan',
    avatar: require('../../../assets/images/ChatScreen/avt2.png'),
    bgColor: '#00A3FF',
  },
  {
    id: 3,
    name: 'Harper',
    avatar: require('../../../assets/images/ChatScreen/avt3.png'),
    bgColor: '#00D5C5',
  },
  {
    id: 4,
    name: 'Alexander',
    avatar: require('../../../assets/images/ChatScreen/avt4.png'),
    bgColor: '#00A3FF',
  },
];

export default function ActiveUserSection() {
  return (
    <View style={styles.wrapper}>
      {/* ScrollView avatar */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}>
        {users.map(user => (
          <View key={user.id} style={styles.userItem}>
            <View
              style={[styles.avatarWrapper, {backgroundColor: user.bgColor}]}>
              <Image
                source={user.avatar}
                style={styles.avatar}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.name}>{user.name}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 8,
    marginBottom: -1,
    paddingHorizontal: 16,
  },
  scroll: {
    gap: 16,
    paddingRight: 16,
  },
  userItem: {
    alignItems: 'center',
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
