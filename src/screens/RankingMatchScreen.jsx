import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/AppNavigator';
import Player from '../components/common/MatchRankScreen/Player';
import ChessBoard2 from '../components/common/MatchRankScreen/ChessBoard2';
import ScreenHeader from '../components/common/ScreenHeader';
import {Matches} from '../fake_data/Binh/fake_data';
import LinearGradient from 'react-native-linear-gradient';
import {useTheme} from '../asycnc_store/ThemeContext';
import SearchMatchPopup from '../components/common/MatchRankScreen/SearchMatchPopup';
import GameState from '../game_logic/GameState';
import ResultPopup from '../components/common/MatchRankScreen/ResultPopup';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import FindMatch from '../untils/FindMatch';
import GameResultCard from '../components/common/MatchRankScreen/MatchResultCard';
import Header from '../components/common/Header';
import ZoomWrapper from '../components/ZoomWrapper';

import { connectSocket, socket } from '../untils/socket';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserById } from '../api/userApi';

const default_avatar = require('../assets/images/default_avatar.jpg');

function decreaseTime(timeString) {
  const minuteAndSecond = timeString.split(':');
  let minute = parseInt(minuteAndSecond[0]);
  let second = parseInt(minuteAndSecond[1]);
  second--;
  if (minute <= 0 && second <= 0) {
    return '0:00';
  }
  if (second < 0) {
    second = 59;
    minute--;
  }
  let res = minute + ':';
  if (second < 10) {
    res += '0';
  }
  res += second;
  return res;
}
function RenderSearchPopup(userName) {
  if (userName == 'Searching') {
    return <SearchMatchPopup></SearchMatchPopup>;
  }
  return <></>;
}
function calculateDeltaElo(yourElo, opponentElo, result, k = 32) {
  const expected = 1 / (1 + Math.pow(10, (opponentElo - yourElo) / 400));
  const delta = Math.round(k * (result - expected));
  console.log('📊 Elo Debug Info:');
console.log('Your Elo:', yourElo);
console.log('Opponent Elo:', opponentElo);
console.log('Expected Score:', expected.toFixed(4));
console.log('Result (1=win, 0=lose, 0.5=draw):', result);
console.log('Delta Elo:', delta);
  return delta;
}

function RenderResultPopup(
  timeWhite,
  timeBlack,
  navigation,
  isCurrentPlayerWhite,
  isEnd,
  whiteScore,
  blackScore,
  surrender,
  playerBlack,
  playerWhite,
  currentIntervalId,
   setTimeWhite, // 👈 thêm
  setTimeBlack , // 👈 thêm
   hasSetTimeZero, 
   setFinalResult,
   realEnd
) { 
  /*console.log("🧩 surrender =", surrender);
console.log("🧩 isCurrentPlayerWhite =", isCurrentPlayerWhite);
console.log("🧩 Máy hiện tại là:", isCurrentPlayerWhite ? "Trắng" : "Đen");
console.log("🧩 Đầu hàng là:", surrender === 1 ? "Trắng" : surrender === 2 ? "Đen" : "Không ai");
console.log("Is End",isEnd);
console.log("Time Black",timeBlack);
console.log("Time White", timeWhite);*/
 
  const yoursCore = isCurrentPlayerWhite ? whiteScore : blackScore;
  const opponentScore = isCurrentPlayerWhite ? blackScore : whiteScore;
  const gameResult = {
    blackScore: blackScore,
    whiteScore: whiteScore,
    resultText: '',
    playerBlack: playerBlack,
    playerWhite: playerWhite,
  };

  const yourElo = parseFloat(isCurrentPlayerWhite ? playerWhite.elo : playerBlack.elo);
const opponentElo = parseFloat(isCurrentPlayerWhite ? playerBlack.elo : playerWhite.elo);

const isPlayerWin = (() => {
  if (surrender === 1) return !isCurrentPlayerWhite; // Trắng đầu hàng → đen thắng
  if (surrender === 2) return isCurrentPlayerWhite;  // Đen đầu hàng → trắng thắng
  if (timeWhite === '0:00') return !isCurrentPlayerWhite;
  if (timeBlack === '0:00') return isCurrentPlayerWhite;
  if (!isEnd) return false;

  // Kết thúc do hết lượt chơi
  console.log("End by pass---------------------------------------"); 
  if (whiteScore > blackScore) return isCurrentPlayerWhite;
  if (blackScore > whiteScore) return !isCurrentPlayerWhite;

  return false; // Hoà → không ai thắng
})();
let result; 
result= !isPlayerWin ? 1 : whiteScore === blackScore ? 0.5 : 0; 
if(surrender!=0) {
  result = isPlayerWin ? 1 : whiteScore === blackScore ? 0.5 : 0;
}
const deltaElo = calculateDeltaElo(yourElo, opponentElo, result);
gameResult.deltaElo = deltaElo;

gameResult.currentElo = yourElo + deltaElo;

    const setTimesOnce = () => {
    if (!hasSetTimeZero.current) {
      setTimeWhite('0:00');
      setTimeBlack('0:00');
      hasSetTimeZero.current = true;
    }
  }; 
  console.log("Is Player win",isPlayerWin); 
  if (surrender === 1 || surrender === 2) {
  clearInterval(currentIntervalId);
  
  gameResult.resultText = isPlayerWin ? 'Victory' : 'Defeat';
  setTimesOnce();
  setFinalResult(gameResult);
  
  realEnd.current=true;
  console.log("Game Result.....................", gameResult);
  return;
} 
if (isEnd) {
    clearInterval(currentIntervalId);
    if (
      (whiteScore > blackScore && isCurrentPlayerWhite) ||
      (whiteScore < blackScore && !isCurrentPlayerWhite)
    ) {
      gameResult.resultText = 'Victory';
      setTimesOnce();
      setFinalResult(gameResult); 
      realEnd.current=true;
      
      console.log("Is end setted!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
      console.log(whiteScore,blackScore);
      return; /*(
        <GameResultCard
          gameResult={gameResult}
          navigation={navigation}></GameResultCard>
      );*/
      //return <ResultPopup result={"YOU WIN"} navigation={navigation} yourScore={yoursCore} opponentScore={opponentScore} state={2}></ResultPopup>
    }
    if (
      (whiteScore < blackScore && isCurrentPlayerWhite) ||
      (whiteScore > blackScore && !isCurrentPlayerWhite)
    ) {
      gameResult.resultText = 'Defeat';
      setTimesOnce();
      setFinalResult(gameResult); 
      realEnd.current=true;
      return;/* (
        <GameResultCard
          gameResult={gameResult}
          navigation={navigation}></GameResultCard>
      );*/
      //return <ResultPopup result={"YOU LOSE"} navigation={navigation} yourScore={yoursCore} opponentScore={opponentScore} state={3}></ResultPopup>
    }
  }
  if (timeWhite == '0:00') {
    clearInterval(currentIntervalId);
    if (!isCurrentPlayerWhite) {
      gameResult.resultText = 'Victory';
setTimesOnce();
setFinalResult(gameResult); 
realEnd.current=true;
console.log("Set Time Blackkkkkkkkkkkkkkkkkkkkkkkkkkkkkk");
      return 
        {/*<GameResultCard
          gameResult={gameResult}
          navigation={navigation}></GameResultCard>*/}
      
      //return <ResultPopup result={"YOU WIN"} navigation={navigation} yourScore={yoursCore} opponentScore={opponentScore} state={1}></ResultPopup>
    }
    //return <ResultPopup result={"YOU LOSE"} navigation={navigation} yourScore={yoursCore} opponentScore={opponentScore} state={0}></ResultPopup>
    gameResult.resultText = 'Defeat';
    setTimesOnce(); 
    setFinalResult(gameResult); 
    realEnd.current=true; 
    return; /*(
      <GameResultCard
        gameResult={gameResult}
        navigation={navigation}></GameResultCard>
    );*/
  } 
  
  if (timeBlack == '0:00') {
    clearInterval(currentIntervalId);
    if (isCurrentPlayerWhite) {
      gameResult.resultText = 'Victory';
      setTimesOnce();
      setFinalResult(gameResult);  
      realEnd.current=true;
      console.log("Set Time Whiteeeeeeeeeeeeeeeeeeeeeeeeee");
      return /*(
        <GameResultCard
          gameResult={gameResult}
          navigation={navigation}></GameResultCard>
      );*/
      //return <ResultPopup result={"YOU WIN"} navigation={navigation} yourScore={yoursCore} opponentScore={opponentScore} state={1}></ResultPopup>
    }
    //return <ResultPopup result={"YOU LOSE"} navigation={navigation} yourScore={yoursCore} opponentScore={opponentScore} state={0}></ResultPopup>
    gameResult.resultText = 'Defeat';
    setTimesOnce();
    setFinalResult(gameResult); 
    realEnd.current=true;
    return ;/*(
      <GameResultCard
        gameResult={gameResult}
        navigation={navigation}></GameResultCard>
    );*/
  } 
  
  
  
}
const RankingMatchScreen = ({navigation}) => {
  const {theme, toggleTheme} = useTheme();
  const isDark = theme === 'dark';
  const styles = isDark ? darkStyles : whiteStyles;
  const isFocuse = useIsFocused();
  const messageIcon = require('../assets/images/message.png');
  const noteIcon = require('../assets/images/note.png');
  const [timeBlack, setTimeBlack] = useState('15:00');
  const [timeWhite, setTimeWhite] = useState('15:00');
  const [userId, setUserId] = useState(null); 
  const [opponentId, setOpponentId] = useState(null); 
  const currentIntervalId= useRef(null);
  const [isCurrentPlayerWhite, setIsCurrentPlayerWhite] = useState(true);
  const [whiteScore, setWhiteScore] = useState(2.5);
  const [blackScore, setBlackScore] = useState(0);
  const [isEnd, setIsEnd] = useState(false);
  const [surrender, setSurrender] = useState(0); //0 new ko ai dau hang, 1 neu trang dau hang, 2 neu den dau hang;
  const [isStart, setIsStart] = useState(false);
  const {height} = useWindowDimensions();
  const [zoomMode, setZoomMode] = useState(false); // 👈 trạng thái zoom
  const hasSetTimeZero = useRef(false);
  const [accountLogin, setAccountLogin] = useState(null);
  const [finalResult, setFinalResult] = useState(null);
  const realEnd = useRef(false);
  
  const [resultKey, setResultKey] = useState(0); // 👈 NEW
  
  const [playerBlack, setPlayerBlack] = useState({
    userId: 'user0010',
    userName: 'Searching',
    country: '?????',
    matches: 1000,
    elo: '????',
    userCountryImageURL:
      'https://www.pngmart.com/files/13/American-Flag-Logo-PNG-Picture.png',
    userAvatarURL: default_avatar,
    rank: 10,
  });
  
  const [playeWhite, setPlayerWhite] = useState({
    userId: 'user0010',
    userName: 'Searching',
    country: '?????',
    matches: 1000,
    elo: '????',
    userCountryImageURL:
      'https://www.pngmart.com/files/13/American-Flag-Logo-PNG-Picture.png',
    userAvatarURL: default_avatar,
    rank: 10,
  });

  const [flag, setFlag] = useState(false);
  const flagRef = useRef(false);
useEffect(() => {
  return () => {
    // Khi rời khỏi màn hình (unmount)
    if(realEnd.current==true) {
      return;
    }
    if (!isEnd && surrender === 0 && userId && opponentId) {
      console.log("👋 Người chơi đã thoát khỏi màn hình, gửi surrender");
      console.log(isEnd,surrender,userId,opponentId);
      // Gửi tín hiệu đầu hàng cho người kia
      const surrenderMove = {
        fromUser: userId,
        move: "surrender",
      };
      socket.emit("move:send", surrenderMove);
    }
  };
}, [ userId, opponentId]);

useEffect(()=>{
  
  if(surrender!=0||isEnd) {
  console.log("Render Result Popup");} 
 
  RenderResultPopup(
          timeWhite,
          timeBlack,
          navigation,
          isCurrentPlayerWhite,
          isEnd,
          whiteScore,
          blackScore,
          surrender,
          playerBlack,
          playeWhite,
          currentIntervalId,
          setTimeWhite, // 👈 thêm
  setTimeBlack,  // 👈 thêm,
   hasSetTimeZero,
   setFinalResult,
   realEnd
        );
  
},[timeWhite,timeBlack,isEnd,surrender]);

function createMatchData(user, opponent) {
  const isCurrentPlayerWhite = opponent._id > user._id;

  const playerWhiteData = {
    userId: isCurrentPlayerWhite ? user._id : opponent._id,
    userName: isCurrentPlayerWhite ? user.displayName : opponent.displayName,
    country: "",
    matches: (isCurrentPlayerWhite ? user.matchHistory : opponent.matchHistory)?.length || 0,
    elo: isCurrentPlayerWhite ? user.elo : opponent.elo,
    userCountryImageURL: { uri: "" },
    userAvatarURL: {
      uri: isCurrentPlayerWhite
        ? user.avatarUrl || ""
        : opponent.avatarUrl || ""
    },
    rank: 0
  };

  const playerBlackData = {
    userId: !isCurrentPlayerWhite ? user._id : opponent._id,
    userName: !isCurrentPlayerWhite ? user.displayName : opponent.displayName,
    country: "",
    matches: (!isCurrentPlayerWhite ? user.matchHistory : opponent.matchHistory)?.length || 0,
    elo: !isCurrentPlayerWhite ? user.elo : opponent.elo,
    userCountryImageURL: { uri: "" },
    userAvatarURL: {
      uri: !isCurrentPlayerWhite
        ? user.avatarUrl || ""
        : opponent.avatarUrl || ""
    },
    rank: 0
  };

  return {
    playerWhite: playerWhiteData,
    playerBlack: playerBlackData
  };
}
useFocusEffect(
  useCallback(() => {
    const fetchUser = async () => {
      try {
        const local = await AsyncStorage.getItem("currentUser");
        if (!local) return;
        const user = JSON.parse(local);
        const freshUser = await getUserById(user._id);
        setAccountLogin(freshUser);
        console.log("MA",freshUser)
      } catch (error) {
        console.error('❌ Lỗi khi reload user:', error);
      }
    };

    fetchUser();
  }, [])
);
useEffect(() => {
   if (!accountLogin?._id) return; // ❗ Tránh chạy khi chưa có user
  const setUp = async () => {
    try {
      console.log("🚀 Bắt đầu setUp tìm trận...");

     const user = accountLogin; // ✅ Sử dụng user mới nhất
     console.log("MA2",accountLogin)
      const userId = user?._id;
setUserId(userId);
      if (!userId) {
        console.warn("⚠️ Không tìm thấy userId");
        return;
      }

      console.log("🟢 Nối socket với userId:", userId);
      connectSocket(userId);

      console.log("🔍 Gửi yêu cầu tìm trận...");
      const opponent = await FindMatch(userId);
      console.log("✅ Ghép cặp với:", opponent);

      const matchInfo = createMatchData(user, opponent);
      console.log("🎮 Match Info:", matchInfo);

      setPlayerWhite(matchInfo.playerWhite);
      setPlayerBlack(matchInfo.playerBlack);

      setIsCurrentPlayerWhite(matchInfo.playerWhite.userId === userId);
      const opponentIdCalc = matchInfo.playerWhite.userId === userId
  ? matchInfo.playerBlack.userId
  : matchInfo.playerWhite.userId;
setOpponentId(opponentIdCalc); // ✅ lưu lại opponentId
      setFlag(false);
      flagRef.current=false;
      setWhiteScore(6.5);
      setBlackScore(0);
      setIsEnd(false);
      setSurrender(0);
      realEnd.current=false;
      
  setIsStart(true);
  currentIntervalId.current = setInterval(() => {
          setTimeBlack((prev) => {
            const next = decreaseTime(prev);
            //console.log("⏱️ Đếm ngược đen:", next);
            return next;
          });
        }, 1000);

        
      console.log("⏳ Chờ 10s trước khi bắt đầu trận...");
      setTimeout(() => {
        console.log("🎯 Trận đấu bắt đầu!");

        

        
      }, 1000);
    } catch (err) {
      console.error("❌ Lỗi trong quá trình ghép cặp:", err);
    }
  };

  setUp();
}, [isFocuse,accountLogin]);


  const handleEvent = gameState => { 
    console.log("Handle Event--------------------------------------------");
    console.log(currentIntervalId.current);
    clearInterval(currentIntervalId.current);
    
    
    
    if (flagRef.current) {
      console.log("It is black turn");
      
      
       currentIntervalId.current= setInterval(() => {
          setTimeBlack(prevTimeBlack => decreaseTime(prevTimeBlack));
        }, 1000);
      
    } else {
      console.log("It is white turn"); 
      
      
        currentIntervalId.current=setInterval(() => {
          setTimeWhite(prevTimeWhite => decreaseTime(prevTimeWhite));
        }, 1000);
      
    }
    flagRef.current=!flagRef.current;
    setFlag(prevF => !prevF);
    setWhiteScore(gameState.whiteScore);
    setBlackScore(gameState.blackScore);
  };
             const [renderTrigger, setRenderTrigger] = useState(0);                                           
  const handleIsEnd = gameState => {
    console.log("CALLL HANDLE IS END");
    gameState.calculateScore(realEnd);
    setWhiteScore(gameState.whiteScore);
    setBlackScore(gameState.blackScore);                   
    console.log('Black Score', gameState.blackScore);
     setRenderTrigger(prev => prev + 1);
    setIsEnd(true);
 RenderResultPopup(
          timeWhite,
          timeBlack,
          navigation,
          isCurrentPlayerWhite,
          isEnd,
          whiteScore,
          blackScore,
          surrender,
          playerBlack,
          playeWhite,
          currentIntervalId,
          setTimeWhite, // 👈 thêm
  setTimeBlack,  // 👈 thêm,
   hasSetTimeZero,
   setFinalResult,
   realEnd
        );
    
  };
  const handleSurrender = isWhite => {
    console.log("Handle surrender",isWhite);
    if (isWhite) {
      setSurrender(1);
    } else {
      console.log("Black Surrender");
      setSurrender(2);
    }
  };

  
const ChessBoard2Ref = useRef(
  <ChessBoard2
    handleEvent={handleEvent}
   
    handleIsEnd={handleIsEnd}
    handleSurrender={handleSurrender}
   
    isStart={isStart}
      userId={userId}
  />
);
 return (
  <View style={[styles.container, { flex: 1, position: 'relative' }]}>
    {!zoomMode && (
      <>
        <Header title="Gokuu" />
        {RenderSearchPopup(playerBlack.userName)}
        {finalResult?<GameResultCard   key={renderTrigger} gameResult={finalResult} navigation={navigation} surrender={surrender}></GameResultCard>:<></>}
      </>
    )}

    <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={true}>
    <View style={[styles.mainView, { minHeight: height + 200 }]}>
{!zoomMode && (
  isCurrentPlayerWhite ? (
    <>
      <Player
        user={playerBlack}
        isWhite={false}
        time={timeBlack}
        score={blackScore}
      />
    </>
  ) : (
    <>
      <Player
        user={playeWhite}
        isWhite={true}
        time={timeWhite}
        score={whiteScore}
      />
    </>
  )
)}

{isStart && userId && (
  <View style={{ height: 600, alignItems: 'center', justifyContent: 'center' }}>
    <ZoomWrapper isZoom={zoomMode}>
      <ChessBoard2
        handleEvent={handleEvent}
        flag={flag}
        handleIsEnd={handleIsEnd}
        handleSurrender={handleSurrender} 
        isCurrentPlayerWhite={isCurrentPlayerWhite}
        isStart={isStart}
        playerColor={isCurrentPlayerWhite ? "W" : "B"}
        userId={userId}
        opponentId={opponentId}
      />
    </ZoomWrapper>
  </View>
)}



       {!zoomMode && (
  isCurrentPlayerWhite ? (
    <>
      <Player
        user={playeWhite}
        isWhite={true}
        time={timeWhite}
        score={whiteScore}
      />
    </>
  ) : (
    <>
      <Player
        user={playerBlack}
        isWhite={false}
        time={timeBlack}
        score={blackScore}
      />
    </>
  )
)}

        {/* {!zoomMode && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.touchable}>
              <LinearGradient
                colors={['#6B50F6', '#CC8FED']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.linearGradient}>
                <Image source={messageIcon} />
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={styles.touchable}>
              <LinearGradient
                colors={['#6B50F6', '#CC8FED']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.linearGradient}>
                <Image source={noteIcon} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )} */}

        
      </View>
    </ScrollView>

    {!zoomMode && (
      <TouchableOpacity
        style={styles.zoomInButton}
        onPress={() => setZoomMode(true)}>
        <Text style={styles.zoomText}>🔍+</Text>
      </TouchableOpacity>
    )}
    {zoomMode && (
  <TouchableOpacity
    style={styles.zoomInButton} // 👈 dùng lại style zoomIn
    onPress={() => setZoomMode(false)}>
    <Text style={styles.zoomText}>🔍➖</Text>
  </TouchableOpacity>
)}
  </View>
);



};
const whiteStyles = StyleSheet.create({
  container: {
    
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'center',
    gap: 50,
    padding: 50,
    paddingVertical: 0,
  },
  linearGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  touchable: {
    width: 53,
    height: 53,
  },
  mainView: {
    marginTop: 20,
  },
  zoomInButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#6B50F6',
    borderRadius: 30,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  zoomOutButton: {
    marginTop: 20,
    alignSelf: 'center',
    backgroundColor: '#6B50F6',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  zoomText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
const darkStyles = StyleSheet.create({
  container: {
    backgroundColor: '#535353',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'center',
    gap: 50,
    padding: 10,
    marginBottom: 100,
  },
  linearGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  touchable: {
    width: 53,
    height: 53,
  },
  mainView: {
    marginTop: 20,
  },
  zoomInButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#6B50F6',
    borderRadius: 30,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  zoomOutButton: {
    marginTop: 20,
    alignSelf: 'center',
    backgroundColor: '#6B50F6',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  zoomText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RankingMatchScreen;
