// components/common/SectionLabel.tsx
import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';

type Props = {
  label: string;
  iconType: 'dot' | 'clock';
};

export default function SectionLabel({label, iconType}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      {iconType === 'dot' ? (
        <View style={styles.dot} />
      ) : (
        <Image
          source={require('../../../assets/images/ChatScreen/TimeSquare.png')}
          style={styles.clock}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#8B2CFF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 15,
    marginLeft: 15,
  },
  label: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFD700',
    marginLeft: 8,
  },
  clock: {
    width: 14,
    height: 14,
    marginLeft: 6,
    resizeMode: 'contain',
  },
});
