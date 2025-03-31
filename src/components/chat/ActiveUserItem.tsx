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
    avatar: require('../../assets/images/avt1.png'),
    bgColor: '#F7DF56',
  },
  {
    id: 2,
    name: 'Ethan',
    avatar: require('../../assets/images/avt2.png'),
    bgColor: '#00A3FF',
  },
  {
    id: 3,
    name: 'Harper',
    avatar: require('../../assets/images/avt3.png'),
    bgColor: '#00D5C5',
  },
  {
    id: 4,
    name: 'Alexander',
    avatar: require('../../assets/images/avt4.png'),
    bgColor: '#00A3FF',
  },
];

export default function ActiveUserSection() {
  return (
    <View style={styles.wrapper}>
      {/* Label with dot */}
      <View style={styles.labelContainer}>
        <Text style={styles.label}>Currently Active</Text>
        <View style={styles.dot} />
      </View>

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
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B2CFF',
    alignSelf: 'flex-start',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 12,
  },
  label: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFD700',
    marginLeft: 8,
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
