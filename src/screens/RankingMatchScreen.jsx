import React, { useEffect, useState } from 'react';
import { View, Text, Button, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import Player from '../components/common/MatchRankScreen/Player';
import ChessBoard from '../components/common/MatchRankScreen/ChessBoard';
import ScreenHeader from '../components/common/ScreenHeader';
import { Matches } from '../fake_data/Binh/fake_data';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../asycnc_store/ThemeContext';
import SearchMatchPopup from '../components/common/MatchRankScreen/SearchMatchPopup';
import GameState from '../game_logic/GameState';
import ResultPopup from '../components/common/MatchRankScreen/ResultPopup';
import { useIsFocused } from '@react-navigation/native';
import FindMatch from '../untils/FindMatch';


const default_avatar = require("../assets/images/default_avatar.jpg");

function decreaseTime(timeString) {
   const minuteAndSecond = timeString.split(':');
   let minute = parseInt(minuteAndSecond[0]);
   let second = parseInt(minuteAndSecond[1]);
   second--;
   if(minute<=0&&second<=0) {
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
function RenderSearchPopup(userName) {
  if(userName=='Searching') {
    return <SearchMatchPopup></SearchMatchPopup>
  } 
  return <></>
}
function RenderResultPopup( timeWhite,timeBlack,navigation, isCurrentPlayerWhite,isEnd,whiteScore, blackScore,surrender) {
  
   if(timeWhite=='0:00') {
    if(!isCurrentPlayerWhite) {
      return <ResultPopup result={"YOU WIN"} navigation={navigation}></ResultPopup>
    }
      return <ResultPopup result={"YOU LOSE"} navigation={navigation}></ResultPopup>
   }
   if(timeBlack=='0:00') {
      if(isCurrentPlayerWhite) {
        return <ResultPopup result={"YOU WIN"} navigation={navigation}></ResultPopup>
      }
      return <ResultPopup result={"YOU LOSE"} navigation={navigation}></ResultPopup>
    }
  if(isEnd) {
      if((whiteScore>blackScore&&isCurrentPlayerWhite)||(whiteScore<blackScore&&!isCurrentPlayerWhite)) {
        return <ResultPopup result={"YOU WIN"} navigation={navigation}></ResultPopup>
      }
      if((whiteScore<blackScore&&isCurrentPlayerWhite)||(whiteScore>blackScore&&!isCurrentPlayerWhite)) {
        return <ResultPopup result={"YOU LOSE"} navigation={navigation}></ResultPopup>
      }
      
  }
  if((surrender==1&&isCurrentPlayerWhite)||(surrender==2&&!isCurrentPlayerWhite)) {
    return <ResultPopup result={"YOU LOSE"} navigation={navigation}></ResultPopup>
  }
  if((surrender==1&&!isCurrentPlayerWhite)||(surrender==2&&isCurrentPlayerWhite)) {
    return <ResultPopup result={"YOU WIN"} navigation={navigation}></ResultPopup>
  }   
   
}
const RankingMatchScreen = ({ navigation }) => {
  const {theme,toggleTheme} = useTheme();
  const isDark=theme==='dark';
  const styles = isDark?darkStyles:whiteStyles;
  const isFocuse = useIsFocused();
  const messageIcon = require("../assets/images/message.png");
  const noteIcon = require("../assets/images/note.png");
  const [timeBlack, setTimeBlack] = useState("10:10");
  const [timeWhite, setTimeWhite] = useState("10:10");
  const [currentIntervalId,setCurrentIntervalId]= useState();
  const [isCurrentPlayerWhite,setIsCurrentPlayerWhite] = useState(true);
  const [whiteScore,setWhiteScore] = useState(2.5);
  const [blackScore,setBlackScore]= useState(0);
  const [isEnd, setIsEnd] = useState(false);
  const [surrender, setSurrender] = useState(0); //0 new ko ai dau hang, 1 neu trang dau hang, 2 neu den dau hang;
  const [playerBlack, setPlayerBlack] = useState({
    userId:"user0010",
    userName:"Searching",
        country:"?????",
        matches:1000,
        elo:"????",
        userCountryImageURL:"https://www.pngmart.com/files/13/American-Flag-Logo-PNG-Picture.png",
        userAvatarURL:default_avatar,
        rank:10
  });
  const [playeWhite, setPlayerWhite] = useState({
    userId:"user0010",
    userName:"Searching",
        country:"?????",
        matches:1000,
        elo:"????",
        userCountryImageURL:"https://www.pngmart.com/files/13/American-Flag-Logo-PNG-Picture.png",
        userAvatarURL:default_avatar,
        rank:10
  })
  const [result,setResult] = useState(0);//1:win,-1:lose
  const [flag,setFlag] = useState(false);
  
  useEffect(()=>{
    
    const setUp= new Promise(function(resolve,reject) {
      setTimeout(()=>{
        const matchResult = FindMatch();
        setIsCurrentPlayerWhite(matchResult.isCurrentPlayerWhite);
        setPlayerBlack(matchResult.matchResult[1]);
        setPlayerWhite(matchResult.matchResult[0]);
        resolve();
      },10000);
      
    });
    setFlag(false);
    setWhiteScore(2.5);
    setBlackScore(0);
    setIsEnd(false);
    setSurrender(0);
    setUp.then(()=>{
      setCurrentIntervalId(setInterval(()=>{
        
        setTimeBlack(prevTimeBlack=>decreaseTime(prevTimeBlack));
      },1000));
    });
    
    
    
  },[isFocuse])
  const handleEvent = (gameState)=>{
      clearInterval(currentIntervalId);
      
      if(flag) {
         
          setCurrentIntervalId(setInterval(()=>{
            setTimeBlack(prevTimeBlack=>decreaseTime(prevTimeBlack));
          },1000));
      }
      else {
        
        setCurrentIntervalId( setInterval(()=>{
          setTimeWhite(prevTimeWhite=>decreaseTime(prevTimeWhite));
        },1000));
      }
      setFlag(prevF=>!prevF);
      setWhiteScore(gameState.whiteScore);
      setBlackScore(gameState.blackScore);
      
      
  }
  const handleIsEnd=()=>{
    setIsEnd(true);
  }
  const handleSurrender = (isWhite)=> {
    if(isWhite) {
      setSurrender(1);

    } 
    else {
      setSurrender(2);
    }
  }

  
  return (
    <View style={styles.container}>
      
      <ScreenHeader screenName={"Gokuu"} navigation={navigation}></ScreenHeader>
      {RenderSearchPopup(playerBlack.userName)}
      {RenderResultPopup(timeWhite,timeBlack,navigation,isCurrentPlayerWhite,isEnd,whiteScore,blackScore,surrender)}
      <View style={styles.mainView}>
      
    <Player user = {playerBlack} isWhite={false} time={timeBlack} score={blackScore}></Player>
    <ChessBoard handleEvent={handleEvent} flag={flag} handleIsEnd={handleIsEnd} handleSurrender={handleSurrender}  ></ChessBoard>
    <Player user={playeWhite} isWhite={true} time={timeWhite}  score={whiteScore}></Player>
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
     padding:50,
     paddingVertical:0
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
    
    
   },
   mainView: {
    marginTop:20
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
    
    
   },
   mainView: {
    marginTop:20
   }
});
export default RankingMatchScreen;
