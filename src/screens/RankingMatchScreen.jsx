import React, { useEffect, useState } from 'react';
import { View, Text, Button, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import Player from '../components/common/MatchRankScreen/Player';
import ChessBoard from '../components/common/MatchRankScreen/ChessBoard';
import ScreenHeader from '../components/common/ScreenHeader';
import { Matches } from '../fake_data/Binh/fake_data';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '@react-navigation/native';



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
  const {theme,toggleTheme} = useTheme();
  const isDark=theme==='dark';
  const styles = isDark?whiteStyles:darkStyles;
  
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
    <View style={styles.container}>
      <ScreenHeader screenName={"Gokuu"} navigation={navigation}></ScreenHeader>
      
    <Player user = {Matches.playerBlack} isWhite={false} time={timeBlack}></Player>
    <ChessBoard handleEvent={handleEvent} ></ChessBoard>
    <Player user={Matches.playerWhite} isWhite={true} time={timeWhite} ></Player>
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.touchable}>
      <LinearGradient colors={['#6B50F6', '#CC8FED']} // Colors for gradient
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}  
    style={styles.linearGradient}>
        <Image source={messageIcon}></Image>
        </LinearGradient>
      </TouchableOpacity>
      <TouchableOpacity style={styles.touchable}>
        <LinearGradient colors={['#6B50F6', '#CC8FED']} // Colors for gradient
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}  
    style={styles.linearGradient}>
        <Image source={noteIcon}></Image>
        </LinearGradient>
      </TouchableOpacity>
    </View>
    </View>
    
  );
};
const whiteStyles = StyleSheet.create({
  container:{},
   buttonContainer: {
     display:'flex',
     flexDirection:'row',
     alignSelf:'center',
     gap:50,
     padding:50
   },
   linearGradient: {
    width:'100%',
    height:'100%',
    alignItems:'center',
    justifyContent:'center',
    borderRadius:20
   },
   touchable: {
    width:53,
    height:53,
    
    
   }
});
const darkStyles = StyleSheet.create({
  container:{
    backgroundColor:'black'
  },
   buttonContainer: {
     display:'flex',
     flexDirection:'row',
     alignSelf:'center',
     gap:50,
     padding:50
   },
   linearGradient: {
    width:'100%',
    height:'100%',
    alignItems:'center',
    justifyContent:'center',
    borderRadius:20
   },
   touchable: {
    width:53,
    height:53,
    
    
   }
});
export default RankingMatchScreen;
