import React, {useEffect, useRef, useState} from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  DeviceEventEmitter,
  Alert,
} from 'react-native';
import Dot from './Dot';
import {playAttackSound, playCaptureSound} from '../../../untils/SoundEffects';
import {useSoundEffect} from '../../../asycnc_store/SoundAndMusicContext';
import {playVictorySound} from '../../../untils/VictorySound';
import {useIsFocused} from '@react-navigation/native';
import {useLanguage} from '../../../asycnc_store/LanguageContext';
import {translations} from '../../../untils/i18n';
import {GameState} from '../../../logic/GameLogic';
import {Animated} from 'react-native';
import {opacity} from 'react-native-reanimated/lib/typescript/Colors';
import {AnimatedImage} from 'react-native-reanimated/lib/typescript/component/Image';
import ZoomWrapper from '../../ZoomWrapper';
import {createMatch} from '../../../api/matchApi';
import {playMoveWithAI} from '../../../api/aiApi';

const blackPiece = require('../../../assets/images/pieceBlack.png');
const whitePiece = require('../../../assets/images/pieceWhite.png');
const blackDot = require('../../../assets/images/black_piece_dot.png');
const whiteDot = require('../../../assets/images/white_piece_dot.png');
let pieceArray = [];
for (let i = 0; i < 19 * 19; i++) {
  pieceArray.push(null);
}
const arrayNum = new Array(19 * 4).fill(0);
function fromIndexToView(index) {
  const positionData = {
    top: 0,
    left: 0,
    character: '',
  };
  if (index >= 0 && index <= 18) {
    positionData.left = 18 * index + 13;
    positionData.character = String.fromCharCode(65 + index);
  }
  if (index >= 19 && index <= 37) {
    positionData.left = 19 * 18;
    positionData.top = 18 * (38 - index) - 9;
    positionData.character = index - 18;
  }
  if (index >= 38 && index <= 56) {
    positionData.top = 19 * 18;
    positionData.left = 18 * (index - 38) + 9;
    positionData.character = String.fromCharCode(27 + index);
  }
  if (index >= 57 && index <= 75) {
    positionData.top = 18 * (76 - index) - 4;
    positionData.left = -2;
    positionData.character = index - 56;
  }
  return (
    <View
      key={index}
      style={{
        position: 'absolute',
        top: positionData.top,
        left: positionData.left,
        width: 18,
        height: 18,
      }}>
      <Text
        style={{
          textAlign: 'center',
          fontSize: 12,
        }}>
        {positionData.character}
      </Text>
    </View>
  );
}
export default function ChessBoard3({
  handleEvent,
  flag,
  handleIsEnd,
  handleSurrender,
  isCurrentPlayerWhite,
  isStart,
  playerColor = 'B',
  userId,
  isReady,
}) {
  const isMyTurnSelf =
    (playerColor === 'B' && !flag) || (playerColor === 'W' && flag);
  const isMyTurnOpponent = !isMyTurnSelf;

  const [isEnd, setIsEnd] = useState(false);
  const [surrender, setSurrender] = useState(0); // 0: chưa đầu hàng, 1: trắng đầu hàng, 2: đen đầu hàng
  const [moveHistory, setMoveHistory] = useState([]);
  const isFocuse = useIsFocused();
  const [pArr, setPArr] = useState(pieceArray);
  const [animatedParr, setAnimatedParr] = useState(pieceArray);
  const {language, toggleLanguage} = useLanguage();
  const t = translations[language];
  const [gameState, setGameState] = useState(new GameState());
  const [whiteSkip, setWhiteSkip] = useState(false);
  const [blackSkip, setBlackSkip] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [newPosition, setNewPosition] = useState([-1, -1]);
  const fadeAnimArr = useRef(
    Array.from({length: 19 * 19}, () => new Animated.Value(1)),
  ).current;
  useEffect(() => {
    setGameState(new GameState());
    setPArr(pieceArray);
    const aniPArr = new Array(19);
    for (let i = 0; i < 19 * 19; i++) {
      aniPArr.push(null);
    }
    setAnimatedParr(aniPArr);
    loadBoardFromGameState(gameState);
    setBlackSkip(false);
    setWhiteSkip(false);
  }, [isFocuse]);

  /*useEffect(()=>{
        if(isStart==true) {
            if(isCurrentPlayerWhite!=flag) {
                
                ListenOpponentMove();
                
                return;
            }
            else {
                
            }
            console.log("Start");
        }
    },[isStart,flag])*/
  function renderSkipSurrenderButtons(isCurrentPlayerWhite, canSkip) {
    return (
      <View style={style.container}>
        <TouchableOpacity
          style={[style.button, {opacity: canSkip ? 1 : 0.5}]}
          disabled={!canSkip}
          onPress={e => {
            e.preventDefault();
            onSkip(isCurrentPlayerWhite);
          }}>
          <Text style={style.text}>{t.skip_text}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={style.button}
          onPress={e => {
            e.preventDefault();
            onSurrender(isCurrentPlayerWhite);
          }}>
          <Text style={style.text}>{t.surrender_text}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function renderCellInRow(index) {
    let res = [];
    for (let i = 0; i < 18; i++) {
      res.push(
        <View style={style.cell} key={'Cell' + i + '_Row' + index}></View>,
      );
    }
    return res;
  }
  function renderRow() {
    let res = [];
    for (let i = 0; i < 18; i++) {
      res.push(renderCellInRow(i));
    }
    return res;
  }

  async function onSurrender(isWhite) {
    gameState.calculateScore();
    playWinSound();
    setSurrender(isWhite ? 1 : 2);
    setIsEnd(true); // kết thúc game khi có người đầu hàng
    handleSurrender?.(isWhite); // gọi callback nếu cần
  }

  function loadBoardFromGameState(gameState) {
    const boardData = gameState.posArray;
    for (let i = 0; i < 19; i++) {
      for (let j = 0; j < 19; j++) {
        if (boardData[i][j] == 'B') {
          setPArr(pArr => {
            pArr[i * 19 + j] = blackPiece;
            return pArr;
          });
          continue;
        }
        if (boardData[i][j] == 'W') {
          setPArr(pArr => {
            pArr[i * 19 + j] = whitePiece;
            return pArr;
          });
          continue;
        }
        if (boardData[i][j] == '0') {
          setPArr(pArr => {
            pArr[i * 19 + j] = null;
            return pArr;
          });
        }
      }
    }
  }

  const {playMoveSound, playCaptureSound, playWinSound, playLoseSound} =
    useSoundEffect();
  function displayMoveToUI(index, i) {
    const tempParray = [...pArr];

    if (tempParray[index * 19 + i] != null) {
      return;
    }
    const moveResult = {
      mover: '',
      movePosition: '',
    };
    const currentSide = flag ? 'W' : 'B';
    setGameState(gameState => {
      const moveData = gameState.move(index, i, currentSide);
      if (moveData.canMove) {
        moveResult.mover = currentSide;
        const row = 19 - index;
        const col = String.fromCharCode(65 + i); // A + cột
        moveResult.movePosition = `${col}${row}`;
        setNewPosition([index, i, currentSide]);

        const newMove = {
          order: moveHistory.length + 1,
          move: `${col}${row}`,
        };

        setMoveHistory(prev => {
          const updated = [...prev, newMove];
          console.log('📜 moveHistory sau khi đi nước:', updated);
          return updated;
        });

        console.log('HELLLO', moveHistory);

        if (moveData.deathPosition.length > 0) {
          playCaptureSound(); // Có ăn quân
        } else {
          playMoveSound(); // Chỉ đánh bình thường
        }

        const tempPAnimationArr = [...animatedParr];
        for (let j = 0; j < moveData.deathPosition.length; j++) {
          const id =
            moveData.deathPosition[j][0] * 19 + moveData.deathPosition[j][1];

          //setAnimatedParr(tempPAnimationArr);
          Animated.timing(fadeAnimArr[id], {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }).start();
          tempPAnimationArr[id] = flag ? blackPiece : whitePiece;
        }

        setAnimatedParr(tempPAnimationArr);

        loadBoardFromGameState(gameState);
        setBlackSkip(false);
        setWhiteSkip(false);
        handleEvent(gameState);
      }
      return gameState;
    });
    return moveResult;
  }
  async function onMove(index, i) {
    const result = displayMoveToUI(index, i); // Người chơi đánh quân playerColor

    if (result?.movePosition) {
      // 🧠 Gọi AI phản đòn với quân ngược lại
      try {
        const aiColor = playerColor === 'B' ? 'W' : 'B';
        const res = await playMoveWithAI({
          userId,
          move: result.movePosition,
        });

        const aiMove = res.aiMove?.trim(); // ví dụ: "D4"
        console.log('🤖 AI đánh:', aiMove);

        if (
          !aiMove ||
          aiMove.toLowerCase() === 'resign' ||
          aiMove.toLowerCase() === 'pass'
        ) {
          onReceiveAIMove(aiMove);
          return;
        }

        // Chuyển từ D4 → index và i
        const col = aiMove[0].toUpperCase().charCodeAt(0) - 65;
        const row = 19 - parseInt(aiMove.slice(1));

        // 💡 Override flag để đảm bảo AI đánh đúng màu
        const tempFlag = playerColor === 'B'; // nếu người là B thì flag true -> AI là W
        const currentSide = tempFlag ? 'W' : 'B';

        setGameState(gameState => {
          const moveData = gameState.move(row, col, currentSide);
          if (moveData.canMove) {
            setNewPosition([row, col, currentSide]);
            setMoveHistory(prev => [
              ...prev,
              {order: prev.length + 1, move: aiMove},
            ]);
            loadBoardFromGameState(gameState);
            handleEvent(gameState);
          }
          return gameState;
          g;
        });
      } catch (err) {
        console.error('❌ Lỗi gọi AI:', err);
      }
    }

    return result;
  }

  function onReceiveMove(moveString, mover) {
    const colLetter = moveString.substring(0, 1).toUpperCase(); // 'D'
    const rowNumber = parseInt(moveString.substring(1)); // 16

    const i = colLetter.charCodeAt(0) - 65; // 'A' → 0, 'B' → 1, ..., 'S' → 18
    const index = 19 - rowNumber; // vì hàng 19 ở trên cùng, hàng 1 ở dưới

    displayMoveToUI(index, i); // Truyền vào hàm xử lý đánh cờ
  }

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function onReceiveAIMove(aiMove) {
    if (!aiMove) {
      setIsEnd(true);
      handleIsEnd(gameState);
      console.warn('❌ AI không trả về nước đi (undefined hoặc null)');
      return;
    }

    await delay(2000); // Đợi 2 giây
    const move = aiMove.trim().toLowerCase();
    console.log('🤖 AI đánh:', move);

    // Nếu AI resign
    if (move === 'resign') {
      console.log('❌ AI đã resign, kết thúc ván.');
      setIsEnd(true);
      handleIsEnd(gameState);
      return;
    }

    // Nếu AI pass
    if (move === 'pass') {
      const isWhite = playerColor === 'B'; // Người là đen thì AI là trắng
      const moveText = isWhite ? 'White pass' : 'Black pass';
      const newMove = {order: moveHistory.length + 1, move: moveText};

      setMoveHistory(prev => {
        const updated = [...prev, newMove];
        console.log('📜 moveHistory sau khi AI pass:', updated);

        // 🧩 Kiểm tra nước gần nhất có pass không
        if (
          prev.length > 0 &&
          prev[prev.length - 1].move.toLowerCase().includes('pass')
        ) {
          console.log('🔥 Cả hai bên đều pass, kết thúc ván.');
          gameState.calculateScore();
          setIsEnd(true);
          handleIsEnd(gameState);
        } else {
          console.log('📌 AI pass nhưng nước trước không phải pass.');
          // Chỉ cập nhật whiteSkip/blackSkip nếu chưa đủ điều kiện
          if (isWhite) setWhiteSkip(true);
          else setBlackSkip(true);
          handleEvent(gameState);
        }

        return updated;
      });

      return;
    }

    // Nếu không phải pass/resign, xử lý nước đi bình thường (ví dụ D4)
    const col = move[0].toUpperCase().charCodeAt(0) - 65;
    const row = 19 - parseInt(move.slice(1));
    if (isNaN(col) || isNaN(row)) {
      console.warn(`⚠️ Nước đi AI không hợp lệ: ${move}`);
      return;
    }

    setGameState(gameState => {
      const moveData = gameState.move(
        row,
        col,
        playerColor === 'B' ? 'W' : 'B',
      );
      if (moveData.canMove) {
        setNewPosition([row, col, playerColor === 'B' ? 'W' : 'B']);
        setMoveHistory(prev => [...prev, {order: prev.length + 1, move}]);
        loadBoardFromGameState(gameState);
        handleEvent(gameState);
      } else {
        console.warn(`⚠️ AI move không thể thực hiện: ${move}`);
      }
      return gameState;
    });
  }

  function displayPieceSource(index, i) {
    if (index == newPosition[0] && i == newPosition[1]) {
      return newPosition[2] == 'B' ? blackDot : whiteDot;
    }
    return pArr[index * 19 + i];
  }

  function renderTouchableCell(index) {
    let res = [];

    for (let i = 0; i < 19; i++) {
      res.push(
        <TouchableOpacity
          style={style.touchable}
          key={'Button' + i + '_Row' + index}
          onPress={e => {
            e.preventDefault();

            console.log(onMove(index, i)); //Gọi hàm onMove
          }}>
          <Dot index={index * 19 + i}></Dot>
          <Animated.Image
            style={[
              style.pieceImageEnable,
              {opacity: fadeAnimArr[index * 19 + i]},
            ]}
            source={animatedParr[index * 19 + i]}></Animated.Image>
          <Animated.Image
            style={style.pieceImageEnable}
            source={displayPieceSource(index, i)}></Animated.Image>
        </TouchableOpacity>,
      );
    }
    return res;
  }
  function renderTouchableRow() {
    let res = [];
    for (let i = 0; i < 19; i++) {
      res.push(renderTouchableCell(i));
    }
    return res;
  }

  async function onSkip(isWhite) {
    console.log(
      `🚀 onSkip bắt đầu - isWhite: ${isWhite}, flag: ${flag}, playerColor: ${playerColor}`,
    );

    if (isWhite && flag) {
      console.log('💡 Người chơi White skip');
      setWhiteSkip(true);
      const moveText = isWhite ? 'White pass' : 'Black pass';
      const newMove = {order: moveHistory.length + 1, move: moveText};
      setMoveHistory(prev => {
        const updated = [...prev, newMove];
        console.log('📜 moveHistory sau khi người chơi skip:', updated);
        return updated;
      });

      console.log(
        `🔥 Trạng thái trước kiểm tra blackSkip: blackSkip=${blackSkip}`,
      );
      if (blackSkip) {
        console.log(
          '🏆 Cả hai bên đều pass (white + black), tính điểm và kết thúc ván',
        );
        gameState.calculateScore();
        setIsEnd(true);
        handleIsEnd(gameState);
      } else {
        console.log('💬 Chưa đủ điều kiện kết thúc, gọi handleEvent');
        handleEvent(gameState);
      }
    } else if (!isWhite && !flag) {
      console.log('💡 Người chơi Black skip');
      const moveText = isWhite ? 'White pass' : 'Black pass';
      const newMove = {order: moveHistory.length + 1, move: moveText};
      setMoveHistory(prev => {
        const updated = [...prev, newMove];
        console.log('📜 moveHistory sau khi người chơi skip:', updated);
        return updated;
      });

      setBlackSkip(true);
      console.log(
        `🔥 Trạng thái trước kiểm tra whiteSkip: whiteSkip=${whiteSkip}`,
      );
      if (whiteSkip) {
        console.log(
          '🏆 Cả hai bên đều pass (black + white), tính điểm và kết thúc ván',
        );
        gameState.calculateScore();
        setIsEnd(true);
        handleIsEnd(gameState);
      } else {
        console.log('💬 Chưa đủ điều kiện kết thúc, gọi handleEvent');
        handleEvent(gameState);
      }
    }

    // 🧠 Gửi PASS cho AI (nếu đúng lượt)
    if ((isWhite && playerColor === 'W') || (!isWhite && playerColor === 'B')) {
      console.log('🧠 Gửi PASS cho AI');
      try {
        const res = await playMoveWithAI({userId, move: 'pass'});
        console.log(`🤖 Phản hồi từ AI:`, res);
        const aiMove = res?.aiMove?.trim();
        console.log(`🤖 AI đánh: ${aiMove}`);

        if (
          !aiMove ||
          aiMove.toLowerCase() === 'resign' ||
          aiMove.toLowerCase() === 'pass'
        ) {
          console.log('🤖 AI skip hoặc resign, gọi onReceiveAIMove');
          onReceiveAIMove(aiMove);
          return;
        }

        const col = aiMove[0].toUpperCase().charCodeAt(0) - 65;
        const row = 19 - parseInt(aiMove.slice(1));
        console.log(`📍 AI move tọa độ: row=${row}, col=${col}`);
        displayMoveToUI(row, col);
      } catch (err) {
        console.error('❌ Lỗi khi gửi pass cho AI:', err);
      }
    } else {
      console.log('⏭ Không gửi PASS cho AI (chưa tới lượt AI)');
    }

    console.log('🏁 Kết thúc onSkip');
  }
  const board = renderRow();
  const touchable = renderTouchableRow();

  useEffect(() => {
    if (!isEnd && surrender === 0) return;

    const winner =
      surrender === 1
        ? 'black'
        : surrender === 2
        ? 'white'
        : gameState.whiteScore > gameState.blackScore
        ? 'white'
        : 'black';

    const payload = {
      playerBlack: null, // vì là solo nên để null
      playerWhite: null,
      winner,
      type: 'bot', // hoặc 'solo' nếu bạn có enum riêng
      moves: moveHistory,
      resultDescription:
        surrender === 1
          ? 'White surrendered'
          : surrender === 2
          ? 'Black surrendered'
          : `Score - White: ${gameState.whiteScore}, Black: ${gameState.blackScore}`,
      deltaElo: 0,
    };

    console.log('PAYLOAD', payload);
    createMatch(payload)
      .then(res => {
        console.log('✅ Match saved to server:', res);
      })
      .catch(err => {
        console.error('❌ Failed to save match:', err);
      });
  }, [isEnd, surrender]);

  if (!isReady) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute', // phủ toàn bộ màn hình
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 999, // đảm bảo nằm trên
        }}>
        <Text style={{color: 'black', fontSize: 18}}>
          ⏳ {t.preparing_match}
        </Text>
      </View>
    );
  }

  return (
    <View>
      {/* Nút bỏ lượt và đầu hàng của Đối thủ (ở trên) */}
      {/* {renderSkipSurrenderButtons(playerColor === 'W' ? false : true, isMyTurnOpponent)} */}

      <View style={{alignItems: 'center'}}>
        {/* Quân đối thủ hiển thị phía trên bàn cờ */}
        {playerColor === 'W' ? (
          <Image
            source={blackPiece}
            style={{
              width: 36,
              height: 36,
              marginBottom: 4,
              opacity: !flag ? 1 : 0.3,
            }}
          />
        ) : (
          <Image
            source={whitePiece}
            style={{
              width: 36,
              height: 36,
              marginBottom: 4,
              opacity: flag ? 1 : 0.3,
            }}
          />
        )}

        {/* Bàn cờ */}
        <View style={style.ChessBoard3BackGround}>
          <View style={style.ChessBoard3}>
            {board.map((item, index) => (
              <View style={style.row} key={'Row' + index}>
                {item.map((cell, i) => cell)}
              </View>
            ))}
            <View style={style.touchableArea}>
              {touchable.map((item, index) => (
                <View style={style.row} key={'TouchableRow' + index}>
                  {item.map((cell, i) => cell)}
                </View>
              ))}
            </View>
          </View>

          {/* Hiển thị chỉ số A, B, C... hoặc 1, 2, 3... quanh bàn cờ */}
          {arrayNum.map((item, index) => {
            if (index >= 0 && index <= 18) return fromIndexToView(index); // Trên
            if (index >= 57 && index <= 75) return fromIndexToView(index); // Trái
            return null; // Bỏ phải và dưới
          })}
        </View>

        {/* Quân người chơi hiển thị dưới bàn cờ */}
        {playerColor === 'W' ? (
          <Image
            source={whitePiece}
            style={{
              width: 36,
              height: 36,
              marginTop: 4,
              opacity: flag ? 1 : 0.3,
            }}
          />
        ) : (
          <Image
            source={blackPiece}
            style={{
              width: 36,
              height: 36,
              marginTop: 4,
              opacity: !flag ? 1 : 0.3,
            }}
          />
        )}
      </View>

      {/* Nút bỏ lượt và đầu hàng của Người chơi (ở dưới) */}
      {renderSkipSurrenderButtons(
        playerColor === 'W' ? true : false,
        isMyTurnSelf,
      )}
    </View>
  );
}
export const currentPlayerMove = {
  WAITING: {
    move: [],
    isSkip: false,
  },
};
const style = StyleSheet.create({
  ChessBoard3BackGround: {
    width: 370,
    height: 370,
    backgroundColor: '#f1b152',
    alignSelf: 'center',
  },
  ChessBoard3: {
    width: 325,
    height: 325,
    position: 'absolute',
    top: 23,
    left: 23,
    backgroundColor: '#fff5e9',
  },
  cell: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: 'black',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  touchableArea: {
    width: 342,
    height: 342,
    position: 'absolute',
    top: -9,
    left: -9,
    borderColor: 'black',
  },
  touchable: {
    width: 18,
    height: 18,
  },
  pieceImageDisable: {
    display: 'none',
    position: 'absolute',
    top: 0,
    left: 0,
    width: 18,
    height: 18,
  },
  pieceImageFade: {
    top: 0,
    left: 0,
    position: 'absolute',
    width: 18,
    height: 18,
  },
  pieceImageEnable: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 18,
    height: 18,
  },
  container: {
    flexDirection: 'row', // Sắp xếp ngang
    justifyContent: 'space-around', // Căn chỉnh khoảng cách
    alignItems: 'center',
    padding: 10,
  },
  button: {
    backgroundColor: '#6B50F6', // Màu nền
    padding: 15,
    borderRadius: 10, // Bo góc
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
