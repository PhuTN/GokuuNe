import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function IconDot({name, size = 12, color = '#FFD700'}) {
  return <Icon name={name} size={size} color={color} />;
}
