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
import ScreenHeader from '../components/common/ScreenHeader';
import { User,Top10 } from '../fake_data/Binh/fake_data';

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
    <>
    <ScreenHeader screenName={"Ranking"}></ScreenHeader>
    <ScrollView>
      
      <UserView user={User}></UserView> 
      <PlayButton></PlayButton>
      <View style={style.topContainer}>
        <View>
        <TopInfo topInfo={Top10[1]}></TopInfo> 
        </View>
        <View style={style.top1View}>
        <TopInfo topInfo={Top10[0]}></TopInfo> 
        </View>
        <View>
        <TopInfo topInfo={Top10[2]}></TopInfo> 
        </View>
      </View> 
      <LeaderBoard listLeaderBoard={Top10.slice(3,10)} user={User}></LeaderBoard>
    </ScrollView> 
    </>
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
