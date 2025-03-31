import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import IconDot from './IconDot';

export default function SectionLabel({label, iconName, iconColor}) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{label}</Text>
      <IconDot name={iconName} size={12} color={iconColor} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    backgroundColor: '#9B30FF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 20,
    marginTop: 18,
  },
  text: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 6,
  },
});
