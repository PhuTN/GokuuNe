import React, { useEffect, useRef, useState } from 'react';
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
//import {playAttackSound, playCaptureSound} from '../../../untils/SoundEffects';
import { useSoundEffect } from '../../../asycnc_store/SoundAndMusicContext';
//import {playVictorySound} from '../../../untils/VictorySound';
import { useIsFocused } from '@react-navigation/native';
import { useLanguage } from '../../../asycnc_store/LanguageContext';
import { translations } from '../../../untils/i18n';
import { GameState } from '../../../logic/GameLogic';
import { Animated } from 'react-native';
import { opacity } from 'react-native-reanimated/lib/typescript/Colors';
import { AnimatedImage } from 'react-native-reanimated/lib/typescript/component/Image';
import ZoomWrapper from '../../ZoomWrapper';

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
    positionData.left=-2;
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
export default function ChessBoard({
  handleEvent,
  flag,
  handleIsEnd,
  handleSurrender,
  isCurrentPlayerWhite,
  isStart,
}) {
  const isFocuse = useIsFocused();
  const [pArr, setPArr] = useState(pieceArray);
  const [animatedParr, setAnimatedParr] = useState(pieceArray);
  const { language, toggleLanguage } = useLanguage();
  const t = translations[language];
  const [gameState, setGameState] = useState(new GameState());
  const [whiteSkip, setWhiteSkip] = useState(false);
  const [blackSkip, setBlackSkip] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [newPosition,setNewPosition] = useState([-1,-1]);
  const fadeAnimArr = useRef(
    Array.from({ length: 19 * 19 }, () => new Animated.Value(1)),
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
  function renderSkipSurrenderButtons(isCurrentPlayerWhite) {
    return (
      <View style={style.container}>
        <TouchableOpacity
          style={style.button}
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
    handleSurrender(isWhite);
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

  const { playMoveSound, playCaptureSound, playWinSound, playLoseSound } =
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
setNewPosition([index,i,currentSide]);

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
  function onMove(index, i) {
    return displayMoveToUI(index, i); /*Trả vể {
      mover:'' nếu đánh ko đc, 'B' nếu là black, 'W' nếu là white,
      movePosition:'' nếu đánh ko đc, ví dụ 'A15' nếu đánh được
      } */
  }
function onReceiveMove(moveString, mover) {
  const colLetter = moveString.substring(0, 1).toUpperCase(); // 'D'
  const rowNumber = parseInt(moveString.substring(1));        // 16

  const i = colLetter.charCodeAt(0) - 65;         // 'A' → 0, 'B' → 1, ..., 'S' → 18
  const index = 19 - rowNumber;                   // vì hàng 19 ở trên cùng, hàng 1 ở dưới

  displayMoveToUI(index, i); // Truyền vào hàm xử lý đánh cờ
}
function displayPieceSource(index,i) {
  if(index==newPosition[0]&&i==newPosition[1]) {
    return newPosition[2]=='B'?blackDot:whiteDot;
  } 
  return pArr[index*19+i];
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
              { opacity: fadeAnimArr[index * 19 + i] },
            ]}
            source={animatedParr[index * 19 + i]}></Animated.Image>
          <Animated.Image
            style={style.pieceImageEnable}
            source={displayPieceSource(index,i)}></Animated.Image>
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

  function onSkip(isWhite) {
    if (isWhite && flag) {
      setWhiteSkip(true);
      if (blackSkip) {
        gameState.calculateScore();
        handleIsEnd(gameState);
        console.log('White Skip');
      } else {
        handleEvent(gameState);
      }
      return;
    }
    if (!isWhite && !flag) {
      setBlackSkip(true);
      if (whiteSkip) {
        gameState.calculateScore();
        handleIsEnd(gameState);
        console.log('Black Skip');
      } else {
        handleEvent(gameState);
      }
    }
  }
  const board = renderRow();
  const touchable = renderTouchableRow();

  return (
    <View>
      {renderSkipSurrenderButtons(false)}

      <View style={style.chessBoardBackGround}>
     
          <View style={style.chessBoard}>
            {board.map((item, index) => {
              return (
                <View style={style.row} key={'Row' + index}>
                  {item.map((cell, i) => {
                    return cell;
                  })}
                </View>
              );
            })}
            <View style={style.touchableArea}>
              {touchable.map((item, index) => {
                return (
                  <View style={style.row} key={'TouchableRow' + index}>
                    {item.map((cell, i) => {
                      return cell;
                    })}
                  </View>
                );
              })}
            </View>
          </View>

        {arrayNum.map((item, index) => {
  if (index >= 0 && index <= 18) return fromIndexToView(index); // Trên
  if (index >= 57 && index <= 75) return fromIndexToView(index); // Trái
  return null; // Bỏ phải và dưới
})}
      </View>
      {renderSkipSurrenderButtons(true)}
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
  chessBoardBackGround: {
    width: 370,
    height: 370,
    backgroundColor: '#f1b152',
    alignSelf: 'center',
  },
  chessBoard: {
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
