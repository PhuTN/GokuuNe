import React from 'react';
import { View, Text, Button, StyleSheet ,ScrollView} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

import UserView from '../components/common/RankingScreen/UserView';
import PlayButton from '../components/common/PlayButton';
import Top1Avatar from '../components/common/RankingScreen/Top1Avatar';
import TopInfo from '../components/common/RankingScreen/TopInfo';
import LeaderBoardInfo from '../components/common/RankingScreen/LeaderBoardInfo';
import LeaderBoard from '../components/common/RankingScreen/LeaderBoard';
type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;
const listLeaderBoard = [
  {name:"Alex White",elo:3900},
  {name:"Alex White",elo:3900},
  {name:"Alex White",elo:3900},
  {name:"Alex White",elo:3900},
  {name:"Alex White",elo:3900},
  {name:"Alex White",elo:3900},
  {name:"Alex White",elo:3900}
]
const playerPosition=5;
const RankingScreen = ({ navigation }: Props) => {
  return (
    <ScrollView>
      <Text style={style.heading}>Ranking</Text>
      <UserView></UserView> 
      <PlayButton></PlayButton>
      <View style={style.topContainer}>
        <View>
        <TopInfo topInfo={{rank:2,name:"Sergate Inhakovic",elo:4300}}></TopInfo> 
        </View>
        <View style={style.top1View}>
        <TopInfo topInfo={{rank:1,name:"Bryan Wolf",elo:4500}}></TopInfo> 
        </View>
        <View>
        <TopInfo topInfo={{rank:3,name:"Alex Turner",elo:4000}}></TopInfo> 
        </View>
      </View> 
      <LeaderBoard listLeaderBoard={listLeaderBoard} playerPosition={playerPosition}></LeaderBoard>
    </ScrollView>
  );
};
const style= StyleSheet.create( {
  heading:{
    textAlign:'center'
  },
  topContainer: {
    height:100,
    paddingHorizontal:40,
    marginTop:100,
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center'
  },
  top1View: {
    alignSelf:'flex-end'
  }
})
export default RankingScreen;
