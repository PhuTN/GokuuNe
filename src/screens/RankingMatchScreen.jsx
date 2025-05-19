import React, {useEffect, useMemo, useRef, useState} from 'react';
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
import ChessBoard from '../components/common/MatchRankScreen/ChessBoard';
import ScreenHeader from '../components/common/ScreenHeader';
import {Matches} from '../fake_data/Binh/fake_data';
import LinearGradient from 'react-native-linear-gradient';
import {useTheme} from '../asycnc_store/ThemeContext';
import SearchMatchPopup from '../components/common/MatchRankScreen/SearchMatchPopup';
import GameState from '../game_logic/GameState';
import ResultPopup from '../components/common/MatchRankScreen/ResultPopup';
import {useIsFocused} from '@react-navigation/native';
import FindMatch from '../untils/FindMatch';
import GameResultCard from '../components/common/MatchRankScreen/MatchResultCard';
import Header from '../components/common/Header';
import ZoomWrapper from '../components/ZoomWrapper';

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
) {
  const yoursCore = isCurrentPlayerWhite ? whiteScore : blackScore;
  const opponentScore = isCurrentPlayerWhite ? blackScore : whiteScore;
  const gameResult = {
    blackScore: blackScore,
    whiteScore: whiteScore,
    resultText: '',
    playerBlack: playerBlack,
    playerWhite: playerWhite,
  };
  if (timeWhite == '0:00') {
    clearInterval(currentIntervalId);
    if (!isCurrentPlayerWhite) {
      gameResult.resultText = 'Victory';

      return (
        <GameResultCard
          gameResult={gameResult}
          navigation={navigation}></GameResultCard>
      );
      //return <ResultPopup result={"YOU WIN"} navigation={navigation} yourScore={yoursCore} opponentScore={opponentScore} state={1}></ResultPopup>
    }
    //return <ResultPopup result={"YOU LOSE"} navigation={navigation} yourScore={yoursCore} opponentScore={opponentScore} state={0}></ResultPopup>
    gameResult.resultText = 'Defeat';
    return (
      <GameResultCard
        gameResult={gameResult}
        navigation={navigation}></GameResultCard>
    );
  }
  if (timeBlack == '0:00') {
    clearInterval(currentIntervalId);
    if (isCurrentPlayerWhite) {
      gameResult.resultText = 'Victory';
      return (
        <GameResultCard
          gameResult={gameResult}
          navigation={navigation}></GameResultCard>
      );
      //return <ResultPopup result={"YOU WIN"} navigation={navigation} yourScore={yoursCore} opponentScore={opponentScore} state={1}></ResultPopup>
    }
    //return <ResultPopup result={"YOU LOSE"} navigation={navigation} yourScore={yoursCore} opponentScore={opponentScore} state={0}></ResultPopup>
    gameResult.resultText = 'Defeat';
    return (
      <GameResultCard
        gameResult={gameResult}
        navigation={navigation}></GameResultCard>
    );
  }
  if (isEnd) {
    clearInterval(currentIntervalId);
    if (
      (whiteScore > blackScore && isCurrentPlayerWhite) ||
      (whiteScore < blackScore && !isCurrentPlayerWhite)
    ) {
      gameResult.resultText = 'Victory';
      return (
        <GameResultCard
          gameResult={gameResult}
          navigation={navigation}></GameResultCard>
      );
      //return <ResultPopup result={"YOU WIN"} navigation={navigation} yourScore={yoursCore} opponentScore={opponentScore} state={2}></ResultPopup>
    }
    if (
      (whiteScore < blackScore && isCurrentPlayerWhite) ||
      (whiteScore > blackScore && !isCurrentPlayerWhite)
    ) {
      gameResult.resultText = 'Defeat';
      return (
        <GameResultCard
          gameResult={gameResult}
          navigation={navigation}></GameResultCard>
      );
      //return <ResultPopup result={"YOU LOSE"} navigation={navigation} yourScore={yoursCore} opponentScore={opponentScore} state={3}></ResultPopup>
    }
  }
  if (
    (surrender == 1 && isCurrentPlayerWhite) ||
    (surrender == 2 && !isCurrentPlayerWhite)
  ) {
    clearInterval(currentIntervalId);
    gameResult.resultText = 'Defeat';
    console.log(gameResult.playerBlack);
    return (
      <GameResultCard
        gameResult={gameResult}
        navigation={navigation}></GameResultCard>
    );
    //return <ResultPopup result={"YOU LOSE"} navigation={navigation} yourScore={yoursCore} opponentScore={opponentScore} state={4}></ResultPopup>
  }
  if (
    (surrender == 1 && !isCurrentPlayerWhite) ||
    (surrender == 2 && isCurrentPlayerWhite)
  ) {
    clearInterval(currentIntervalId);
    gameResult.resultText = 'Victory';
    console.log(gameResult.playerBlack);
    return (
      <GameResultCard
        gameResult={gameResult}
        navigation={navigation}></GameResultCard>
    );
    //return <ResultPopup result={"YOU WIN"} navigation={navigation} yourScore={yoursCore} opponentScore={opponentScore} state={5}></ResultPopup>
  }
}
const RankingMatchScreen = ({navigation}) => {
  const {theme, toggleTheme} = useTheme();
  const isDark = theme === 'dark';
  const styles = isDark ? darkStyles : whiteStyles;
  const isFocuse = useIsFocused();
  const messageIcon = require('../assets/images/message.png');
  const noteIcon = require('../assets/images/note.png');
  const [timeBlack, setTimeBlack] = useState('5:00');
  const [timeWhite, setTimeWhite] = useState('5:00');
  const [currentIntervalId, setCurrentIntervalId] = useState();
  const [isCurrentPlayerWhite, setIsCurrentPlayerWhite] = useState(true);
  const [whiteScore, setWhiteScore] = useState(2.5);
  const [blackScore, setBlackScore] = useState(0);
  const [isEnd, setIsEnd] = useState(false);
  const [surrender, setSurrender] = useState(0); //0 new ko ai dau hang, 1 neu trang dau hang, 2 neu den dau hang;
  const [isStart, setIsStart] = useState(false);
  const {height} = useWindowDimensions();
  const [zoomMode, setZoomMode] = useState(false); // 👈 trạng thái zoom
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

  useEffect(() => {
    console.log('Height', height);
    const setUp = new Promise(function (resolve, reject) {
      setTimeout(() => {
        const matchResult = FindMatch();
        setIsCurrentPlayerWhite(matchResult.isCurrentPlayerWhite);
        setPlayerBlack(matchResult.matchResult[1]);
        setPlayerWhite(matchResult.matchResult[0]);
        resolve();
      }, 10000);
    });
    setFlag(false);
    setWhiteScore(6.5);
    setBlackScore(0);
    setIsEnd(false);
    setSurrender(0);
    setIsStart(false);
    setUp.then(() => {
      setIsStart(true);
      setCurrentIntervalId(
        setInterval(() => {
          setTimeBlack(prevTimeBlack => decreaseTime(prevTimeBlack));
        }, 1000),
      );
    });
  }, [isFocuse]);

  const handleEvent = gameState => {
    clearInterval(currentIntervalId);

    if (flag) {
      setCurrentIntervalId(
        setInterval(() => {
          setTimeBlack(prevTimeBlack => decreaseTime(prevTimeBlack));
        }, 1000),
      );
    } else {
      setCurrentIntervalId(
        setInterval(() => {
          setTimeWhite(prevTimeWhite => decreaseTime(prevTimeWhite));
        }, 1000),
      );
    }
    setFlag(prevF => !prevF);
    setWhiteScore(gameState.whiteScore);
    setBlackScore(gameState.blackScore);
  };

  const handleIsEnd = gameState => {
    setWhiteScore(gameState.whiteScore);
    setBlackScore(gameState.blackScore);
    console.log('Black Score', gameState.blackScore);
    setIsEnd(true);
  };
  const handleSurrender = isWhite => {
    if (isWhite) {
      setSurrender(1);
    } else {
      setSurrender(2);
    }
  };
const chessBoardRef = useRef(
  <ChessBoard
    handleEvent={handleEvent}
    flag={flag}
    handleIsEnd={handleIsEnd}
    handleSurrender={handleSurrender}
    isCurrentPlayerWhite={isCurrentPlayerWhite}
    isStart={isStart}
  />
);
 return (
  <View style={[styles.container, { flex: 1, position: 'relative' }]}>
    {!zoomMode && (
      <>
        <Header title="Gokuu" />
        {RenderSearchPopup(playerBlack.userName)}
        {RenderResultPopup(
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
        )}
      </>
    )}

    <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={true}>
    <View style={[styles.mainView, { minHeight: height + 200 }]}>

        {!zoomMode && (
          <Player
            user={playerBlack}
            isWhite={false}
            time={timeBlack}
            score={blackScore}
          />
        )}

<View style={{ height: 600, alignItems: 'center', justifyContent: 'center' }}>
  <ZoomWrapper isZoom={zoomMode}>
    <ChessBoard
      handleEvent={handleEvent}
      flag={flag}
      handleIsEnd={handleIsEnd}
      handleSurrender={handleSurrender}
      isCurrentPlayerWhite={isCurrentPlayerWhite}
      isStart={isStart}
    />
  </ZoomWrapper>
</View>


        {!zoomMode && (
          <Player
            user={playeWhite}
            isWhite={true}
            time={timeWhite}
            score={whiteScore}
          />
        )}

        {!zoomMode && (
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
        )}

        
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
  container: {},
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
    backgroundColor: 'black',
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
