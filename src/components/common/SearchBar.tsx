import React from 'react';
import {View, TextInput, StyleSheet, Image, Dimensions} from 'react-native';

const {width} = Dimensions.get('window');

export default function SearchBar() {
  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search..."
        placeholderTextColor="#FFD700"
        style={styles.input}
      />
      <Image
        source={require('../../assets/images/SearchIcon.png')}
        style={styles.icon}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width * 0.9,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#00000033',
    alignSelf: 'center',
    marginVertical: 16,
  },
  input: {
    flex: 1,
    fontSize: 20, // ← to hơn
    color: '#FFD700',
    paddingVertical: 6,
  },
  icon: {
    width: 50, // ← tăng từ 20 → 24
    height: 24,
    marginLeft: 10,
  },
});
