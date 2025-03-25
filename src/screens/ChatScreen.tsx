import React from 'react';
import { View, Text, Button } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen = ({ navigation }: Props) => {
  return (
    <View>
      <Text>Chat Screen</Text>
      <Button title="Back to home" onPress={() => navigation.navigate('Home')}/>
    </View>
  );
};

export default HomeScreen;
