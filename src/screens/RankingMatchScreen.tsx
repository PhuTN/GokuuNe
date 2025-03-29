import React from 'react';
import { View, Text, Button } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import Player from '../components/common/MatchRankScreen/Player';
import ChessBoard from '../components/common/MatchRankScreen/ChessBoard';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const RankingMatchScreen = ({ navigation }: Props) => {
  return (
    <View>
    <Player></Player>
    <ChessBoard></ChessBoard>
    <Player></Player>
    </View>
    
  );
};

export default RankingMatchScreen;
