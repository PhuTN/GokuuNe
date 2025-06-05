import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  useWindowDimensions,
  StyleSheet,
} from 'react-native';
import {useTheme} from '../asycnc_store/ThemeContext';
import {useIsFocused, useFocusEffect} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

import Header from '../components/common/Header';
import ZoomWrapper from '../components/ZoomWrapper';
import ChessBoard from '../components/common/MatchRankScreen/ChessBoard';
import GameResultCard from '../components/common/MatchRankScreen/MatchResultCard';
import {useLanguage} from '../asycnc_store/LanguageContext';
import {translations} from '../untils/i18n';
import ChessBoard3 from '../components/common/MatchRankScreen/ChessBoard3';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {startAIMatch} from '../api/aiApi';
import AIPlayerTag from '../components/common/AIScreen/AIPlayerTag';
import {getUserById} from '../api/userApi';

const default_avatar = require('../assets/images/default_avatar.jpg');
const messageIcon = require('../assets/images/message.png');
const noteIcon = require('../assets/images/note.png');

const AiMatchSoloScreen = ({navigation, route}) => {
  const {theme} = useTheme();
  const isDark = theme === 'dark';
  const styles = isDark ? darkStyles : whiteStyles;
  const isFocused = useIsFocused();
  const {height} = useWindowDimensions();
  const {language} = useLanguage();
  const t = translations[language];
  const [zoomMode, setZoomMode] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [user, setUser] = useState(null);
  const [isCurrentPlayerWhite, setIsCurrentPlayerWhite] = useState(false);
  const [whiteScore, setWhiteScore] = useState(6.5);
  const [blackScore, setBlackScore] = useState(0);
  const [isEnd, setIsEnd] = useState(false);
  const [surrender, setSurrender] = useState(0);
  const [isStart, setIsStart] = useState(true);
  const [flag, setFlag] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [accountLogin, setAccountLogin] = useState<any>(null);


    const {selectedPiece, selectedMode} = route.params || {};
console.log("HEE",selectedPiece, selectedMode)
    const [playerColor, setPlayerColor] = useState('B'); // mặc định là đen
  useEffect(() => {
    const loadAccountLogin = async () => {
      const acc = await AsyncStorage.getItem('currentUser');
      if (acc) setAccountLogin(JSON.parse(acc));
    };
    loadAccountLogin();
  }, []);
  useFocusEffect(
    useCallback(() => {
      const fetchUser = async () => {
        try {
          if (accountLogin?._id) {
            const freshUser = await getUserById(accountLogin._id);
            const userMapped = {
              userId: freshUser._id,
              userName: freshUser.displayName ?? 'Unknown',
              country: freshUser.nationality ?? 'VietNam',
              matches: Math.floor(Math.random() * 100) + 1,
              elo: freshUser.elo ?? 2200,
              userCountryImageURL:
                'https://www.shutterstock.com/image-vector/vietnam-flag-made-vectors-260nw-1928345522.jpg',
              userAvatarURL:
                freshUser.avatarUrl ?? 'https://example.com/default-avatar.jpg',
              rank: freshUser.rank ?? 4,
            };
            setUser(userMapped);
          }
        } catch (error) {
          console.error('❌ Lỗi khi tải lại user:', error);
        }
      };

      fetchUser();
    }, [accountLogin?._id]),
  );

  const resetGame = () => {
    navigation.replace('AiMatchSoloMatch'); // 👈 thay thế chính screen hiện tại
  };

  const [playerBlack, setPlayerBlack] = useState({
    userId: 'user0010',
    userName: 'Player B',
    country: '?????',
    matches: 1000,
    elo: '????',
    userCountryImageURL:
      'https://www.pngmart.com/files/13/American-Flag-Logo-PNG-Picture.png',
    userAvatarURL: default_avatar,
    rank: 10,
  });

  const [playerWhite, setPlayerWhite] = useState({
    userId: 'user0010',
    userName: 'Player W',
    country: '?????',
    matches: 1000,
    elo: '????',
    userCountryImageURL:
      'https://www.pngmart.com/files/13/American-Flag-Logo-PNG-Picture.png',
    userAvatarURL: default_avatar,
    rank: 10,
  });

  useEffect(() => {
  setWhiteScore(6.5);
  setBlackScore(0);
  setIsEnd(false);
  setSurrender(0);
  setIsStart(true);
  setIsCurrentPlayerWhite(selectedPiece === 'W'); // nếu người chơi là trắng thì bắt đầu là trắng

  const initAIMatch = async () => {
    try {
      const userStr = await AsyncStorage.getItem('currentUser');
      if (!userStr) return;

      const user = JSON.parse(userStr);
      const userId = 'guest_' + Math.floor(Math.random() * 1000000);
      setUserId(userId);

      // Gửi API tạo trận với AI
      await startAIMatch({
        userId,
        difficulty: selectedMode,
        playerColor: selectedPiece,
        boardSize: 19,
      });

      console.log('✅ Phiên AI đã bắt đầu cho', userId);

      // Cập nhật màu quân cho người chơi
      setPlayerColor(selectedPiece); // 'B' hoặc 'W'

      // Cờ sẵn sàng sau vài giây
      setTimeout(() => {
        setIsReady(true);
      }, 10000);
    } catch (err) {
      console.error('❌ Lỗi khi khởi tạo AI:', err);
    }
  };

  initAIMatch();
}, [isFocused]);


  const handleEvent = gameState => {
    setWhiteScore(gameState.whiteScore);
    setBlackScore(gameState.blackScore);
    setFlag(prev => !prev);
  };

  const handleIsEnd = gameState => {
    setWhiteScore(gameState.whiteScore);
    setBlackScore(gameState.blackScore);
    setIsEnd(true);
  };

  const handleSurrender = isWhite => {
    setSurrender(isWhite ? 1 : 2);
  };

  function RenderResultPopup(
    navigation,
    isCurrentPlayerWhite,
    isEnd,
    whiteScore,
    blackScore,
    surrender,
    playerBlack,
    playerWhite,
    resetGame,
    t,
  ) {
    if (!isEnd && surrender === 0) return null;

    let winner = null;
    if (isEnd) {
      winner = whiteScore > blackScore ? 'White' : 'Black';
    } else if (surrender === 1) {
      winner = 'Black';
    } else if (surrender === 2) {
      winner = 'White';
    }

    const trophyIcon = winner === 'White' ? '🏆' : '🏴‍☠️'; // hoặc dùng hình ảnh nếu thích

    return (
      <View style={styles.resultOverlay}>
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>
            {trophyIcon} {winner === 'White' ? t.whiteWin : t.blackWin}
          </Text>

          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>
              ⚪ {t.whiteScore}: {whiteScore.toFixed(1)}
            </Text>
            <Text style={styles.scoreText}>
              ⚫ {t.blackScore}: {blackScore.toFixed(1)}
            </Text>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}>
              <Text style={styles.backButtonText}>← {t.back}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, {flex: 1, position: 'relative'}]}>
      {!zoomMode && (
        <>
          <Header title="Ai Game" />
          {(isEnd || surrender !== 0) && (
            <View style={styles.resultOverlay}>
              {RenderResultPopup(
                navigation,
                isCurrentPlayerWhite,
                isEnd,
                whiteScore,
                blackScore,
                surrender,
                playerBlack,
                playerWhite,
                resetGame,
                t,
              )}
            </View>
          )}
        </>
      )}

      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <View style={[styles.mainView, {minHeight: height + 200}]}>
          <View
            style={{
              height: 700,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <ZoomWrapper isZoom={zoomMode}>
              <AIPlayerTag
                playerName={'AI'}
                avatar={'https://typli.ai/ai-text-generator.png'}></AIPlayerTag>
              <ChessBoard3
  handleEvent={handleEvent}
  flag={flag}
  handleIsEnd={handleIsEnd}
  handleSurrender={handleSurrender}
  isCurrentPlayerWhite={isCurrentPlayerWhite}
  isStart={isStart}
  playerColor={playerColor} // 👈 màu người chơi
 
  userId={userId}
  isReady={isReady}
/>
              <AIPlayerTag
                playerName={user?.userName}
                avatar={user?.userAvatarURL}></AIPlayerTag>
            </ZoomWrapper>
          </View>

          {!zoomMode && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.touchable}>
                <LinearGradient
                  colors={['#6B50F6', '#CC8FED']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.linearGradient}>
                  <Image source={messageIcon} />
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity style={styles.touchable}>
                <LinearGradient
                  colors={['#6B50F6', '#CC8FED']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
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
          style={styles.zoomInButton}
          onPress={() => setZoomMode(false)}>
          <Text style={styles.zoomText}>🔍➖</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const whiteStyles = StyleSheet.create({
  container: {},
  resultOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)', // làm mờ nền
    zIndex: 999,
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
  resultContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
    marginHorizontal: 40,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6B50F6',
    marginBottom: 10,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginVertical: 10,
  },
  winnerName: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 5,
    color: '#333',
  },
  winnerColor: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#999',
    marginBottom: 10,
  },
  backButton: {
    backgroundColor: '#6B50F6',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginTop: 10,
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
    width: '100%',
    paddingHorizontal: 10,
  },
  scoreContainer: {
    marginBottom: 10,
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#444',
    marginVertical: 2,
  },
});
const darkStyles = StyleSheet.create({
  container: {
    backgroundColor: '#535353',
  },
  resultContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    backgroundColor: '#2C2C2C', // 🌑 màu nền xám đậm
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
    marginHorizontal: 40,
  },
  scoreContainer: {
    marginBottom: 10,
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#444',
    marginVertical: 2,
  },
  resultOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)', // làm mờ nền
    zIndex: 999,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6B50F6',
    marginBottom: 10,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginVertical: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
    width: '100%',
    paddingHorizontal: 10,
  },

  winnerName: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 5,
    color: '#333',
  },
  winnerColor: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#999',
    marginBottom: 10,
  },
  backButton: {
    backgroundColor: '#6B50F6',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginTop: 10,
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
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

export default AiMatchSoloScreen;
