import React from 'react';
import { View, Text, Button, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import Player from '../components/common/MatchRankScreen/Player';
import ChessBoard from '../components/common/MatchRankScreen/ChessBoard';
import ScreenHeader from '../components/common/ScreenHeader';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const RankingMatchScreen = ({ navigation }: Props) => {
  const messageIcon = require("../assets/images/message.png");
  const noteIcon = require("../assets/images/note.png");
  return (
    <View>
      <ScreenHeader screenName={"Gokuu"}></ScreenHeader>
    <Player></Player>
    <ChessBoard></ChessBoard>
    <Player></Player>
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.touchable}>
        <Image source={messageIcon}></Image>
      </TouchableOpacity>
      <TouchableOpacity style={styles.touchable}>
        <Image source={noteIcon}></Image>
      </TouchableOpacity>
    </View>
    </View>
    
  );
};
const styles = StyleSheet.create({
   buttonContainer: {
     display:'flex',
     flexDirection:'row',
     alignSelf:'center',
     gap:50,
     padding:50
   },
   touchable: {
    width:53,
    height:53,
    backgroundColor:'#6B50F6',
    alignItems:'center',
    justifyContent:'center',
    borderRadius:20
   }
});
export default RankingMatchScreen;
