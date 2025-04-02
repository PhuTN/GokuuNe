import React, { useEffect, useState } from 'react';
import { View, Text, Button, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import Player from '../components/common/MatchRankScreen/Player';
import ChessBoard from '../components/common/MatchRankScreen/ChessBoard';
import ScreenHeader from '../components/common/ScreenHeader';
import { Matches } from '../fake_data/Binh/fake_data';



function decreaseTime(timeString) {
   const minuteAndSecond = timeString.split(':');
   let minute = parseInt(minuteAndSecond[0]);
   let second = parseInt(minuteAndSecond[1]);
   second--;
   if(minute==0&&second==0) {
      return "0:00";
   }
   if(second<0) {
      second=59;
      minute--;
   }
   let res = minute+":";
   if(second<10) {
      res+="0";
   } 
   res+=second;
   return res;
}
const RankingMatchScreen = ({ navigation }) => {
  
  const messageIcon = require("../assets/images/message.png");
  const noteIcon = require("../assets/images/note.png");
  const [timeBlack, setTimeBlack] = useState("10:00");
  const [timeWhite, setTimeWhite] = useState("10:00");
  const [currentIntervalId,setCurrentIntervalId]= useState();
  const [flag,setFlag] = useState(true);
  useEffect(()=>{
    setCurrentIntervalId(setInterval(()=>{
      setTimeWhite(prevTimeWhite=>decreaseTime(prevTimeWhite));
    },1000));
  },[])
  const handleEvent = ()=>{
      clearInterval(currentIntervalId);
      if(flag) {
         setTimeWhite("10:00");
          setCurrentIntervalId(setInterval(()=>{
            setTimeBlack(prevTimeBlack=>decreaseTime(prevTimeBlack));
          },1000));
      }
      else {
        setTimeBlack("10:00");
        setCurrentIntervalId( setInterval(()=>{
          setTimeWhite(prevTimeWhite=>decreaseTime(prevTimeWhite));
        },1000));
      }
      setFlag(prevF=>!prevF);
      
      
      
  }
  return (
    <View>
      <ScreenHeader screenName={"Gokuu"}></ScreenHeader>
      
    <Player user = {Matches.playerBlack} isWhite={false} time={timeBlack}></Player>
    <ChessBoard handleEvent={handleEvent} ></ChessBoard>
    <Player user={Matches.playerWhite} isWhite={true} time={timeWhite} ></Player>
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
