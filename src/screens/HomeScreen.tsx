import React from 'react';
import { View, Text, Button } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen = ({ navigation }: Props) => {
  return (
    <View>
      <Text>Home Screen</Text>
      <Button title="Go to Chat" onPress={() => navigation.navigate('Chat')}/>
    </View>
  );
};

export default HomeScreen;
