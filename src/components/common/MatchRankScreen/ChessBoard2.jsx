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
import { playAttackSound, playCaptureSound } from '../../../untils/SoundEffects';
import { useSoundEffect } from '../../../asycnc_store/SoundAndMusicContext';
import { playVictorySound } from '../../../untils/VictorySound';
import { useIsFocused } from '@react-navigation/native';
import { useLanguage } from '../../../asycnc_store/LanguageContext';
import { translations } from '../../../untils/i18n';
import { GameState } from '../../../logic/GameLogic';
import { Animated } from 'react-native';
import { opacity } from 'react-native-reanimated/lib/typescript/Colors';
import { AnimatedImage } from 'react-native-reanimated/lib/typescript/component/Image';
import ZoomWrapper from '../../ZoomWrapper';
import { createMatch } from '../../../api/matchApi';
import { socket } from '../../../untils/socket';

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
export default function ChessBoard2({
  handleEvent,
  flag,
  handleIsEnd,
  handleSurrender,
  isCurrentPlayerWhite,
  isStart,
   userId,
   playerColor,
   opponentId
   
}) {
console.log("MAAAAAAM",playerColor)
const [myColor] = useState(playerColor); 
const [isEnd, setIsEnd] = useState(false);
const [surrender, setSurrender] = useState(0); // 0: chưa đầu hàng, 1: trắng đầu hàng, 2: đen đầu hàng
  const [moveHistory, setMoveHistory] = useState([]);
  const isFocuse = useIsFocused();
  const [pArr, setPArr] = useState(pieceArray);
  const [animatedParr, setAnimatedParr] = useState(pieceArray);
  const { language, toggleLanguage } = useLanguage();
  const t = translations[language];
  const [gameState, setGameState] = useState(new GameState());
  const [whiteSkip, setWhiteSkip] = useState(false);
  const [blackSkip, setBlackSkip] = useState(false);
  const isEndedByOpponentRef = useRef(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  
  function calculateDeltaElo(eloA, eloB, resultA, K = 32) {
  const expectedA = 1 / (1 + Math.pow(10, (eloB - eloA) / 400));
  const deltaA = Math.round(K * (resultA - expectedA)); // làm tròn
  const deltaB = -deltaA;
  return [deltaA, deltaB];
}
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
  style={[
    style.button,
    {
      opacity:
        (playerColor === 'B' && !flag) || (playerColor === 'W' && flag) ? 1 : 0.5,
    },
  ]}
  disabled={!((playerColor === 'B' && !flag) || (playerColor === 'W' && flag))}
  onPress={e => {
    e.preventDefault();
    onSkip(isCurrentPlayerWhite);
  }}
>
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
  console.log("Current Player White",isWhite);
  gameState.calculateScore();
  playWinSound();
  setSurrender(isWhite ? 1 : 2);
  setIsEnd(true);
    // kết thúc game khi có người đầu hàng
  handleSurrender?.(isWhite); // gọi callback nếu cần
  console.log("Send to server...............",{
    fromUser: userId,
    move: "surrender"
  })
  socket.emit("move:send", {
    fromUser: userId,
    move: "surrender"
  });
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
  function displayMoveToUI(index, i, forcedSide = null) {
    
    const tempParray = [...pArr];

    if (tempParray[index * 19 + i] != null) {
      return;
    }
    const moveResult = {
      mover: '',
      movePosition: '',
    };
   let opponentColor  ;
   if(forcedSide)
    opponentColor = playerColor === 'B' ? 'W' : 'B';

console.log("TROOL",playerColor)
    const currentSide =  opponentColor || (flag ? 'W' : 'B');
    console.log("LOOOOL",currentSide,forcedSide)
    setGameState(gameState => {
      const moveData = gameState.move(index, i, currentSide);
      if (moveData.canMove) {
        


        moveResult.mover = currentSide;
       const row = 19 - index;
const col = String.fromCharCode(65 + i); // A + cột
moveResult.movePosition = `${col}${row}`;
setNewPosition([index,i,currentSide]);

  const newMove = {
    order: moveHistory.length + 1,
    move: `${col}${row}`,
  };

  setMoveHistory((prev) => [...prev, newMove]);
  console.log("HELLLO",moveHistory)


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
       tempPAnimationArr[id] = currentSide === 'B' ? whitePiece : blackPiece; // vì đây là quân bị ăn

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
  console.log("Receive from enemy,...........",moveString);
if (moveString === "end") {
  isEndedByOpponentRef.current = true; 
  console.log("📥 Nhận nước đi: END từ đối thủ");
  setIsEnd(true);
  
  gameState.calculateScore();
  handleIsEnd?.(gameState);
  return;
}

 if (moveString === "pass") {
    console.log("📩 Đối thủ bỏ lượt");

    if (playerColor === 'B') {
      // mình là đen, đối thủ là trắng → trắng skip
      setWhiteSkip(true);
      if (blackSkip) {
          const moveText =  "White pass" ;

  const newMove = {
    order: moveHistory.length + 1,
    move: moveText,
  };
  setMoveHistory(prev => [...prev, newMove]);
        gameState.calculateScore();
        setIsEnd(true);
        handleIsEnd(gameState);
          socket.emit("move:send", {
    fromUser: userId,
    move: "end",
  });
      } else {
        handleEvent(gameState);

                 const moveText =  "White pass" ;

  const newMove = {
    order: moveHistory.length + 1,
    move: moveText,
  };
  setMoveHistory(prev => [...prev, newMove]);
      }
    } else {
      // mình là trắng, đối thủ là đen → đen skip
      setBlackSkip(true);
      if (whiteSkip) {
                 const moveText =  "Black pass" ;

  const newMove = {
    order: moveHistory.length + 1,
    move: moveText,
  };
  setMoveHistory(prev => [...prev, newMove]);
        gameState.calculateScore();
        
        setIsEnd(true);
        handleIsEnd(gameState);
          socket.emit("move:send", {
    fromUser: userId,
    move: "end",
  });
      } else {
         const moveText =  "Black pass" ;

  const newMove = {
    order: moveHistory.length + 1,
    move: moveText,
  };
  setMoveHistory(prev => [...prev, newMove]);
        handleEvent(gameState);
      }
    }

    return;
  }
  if (moveString === "surrender") {
    console.log("🏳️ Đối thủ đầu hàng");
    console.log("Player Color.....................!!!!!!!!!!!!!!!!!!!!!!!!!!!1",playerColor);

    // nếu đối thủ là trắng → trắng đầu hàng → mình thắng
    setSurrender(playerColor === 'B' ? 1 : 2); 

    setIsEnd(true);
    handleSurrender?.(playerColor === 'B');
    return;
  }
  const colLetter = moveString.substring(0, 1).toUpperCase(); // 'D'
  const rowNumber = parseInt(moveString.substring(1));        // 16

  const i = colLetter.charCodeAt(0) - 65;         // 'A' → 0, B → 1
  const index = 19 - rowNumber;                   // vì hàng 19 ở trên cùng
 console.log("11CAK",playerColor)
  // 👇 luôn đánh quân ngược với màu của mình
  const opponentColor = playerColor === 'B' ? 'W' : 'B';
    console.log("CAK",playerColor);
    console.log("Cal here without handle event................................");
  displayMoveToUI(index, i, opponentColor); // truyền màu quân
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
    // Chỉ cho phép đánh khi đúng lượt (playerColor === lượt hiện tại)
    if ((playerColor === 'B' && !flag) || (playerColor === 'W' && flag)) {
  const result = onMove(index, i); // thực hiện đánh
  if (result?.movePosition) {
    socket.emit('move:send', {
      fromUser: userId,
      move: result.movePosition, // ví dụ: "D16"
    });
    console.log("📤 Gửi nước đi:", result.movePosition);
  }
} else {
  console.log("⛔ Không phải lượt của bạn");
}

  }}
>
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
    console.log("🟦 Mình là trắng, bấm bỏ lượt");
    setWhiteSkip(true);
    if (blackSkip) {
      console.log("✅ Cả 2 cùng bỏ lượt → kết thúc");
      gameState.calculateScore();
      setIsEnd(true);
      handleIsEnd(gameState);
        socket.emit("move:send", {
    fromUser: userId,
    move: "end",
  });
    } else {
      handleEvent(gameState);
    }
  }

  if (!isWhite && !flag) {
    console.log("⬛ Mình là đen, bấm bỏ lượt");
    setBlackSkip(true);
    if (whiteSkip) {
      console.log("✅ Cả 2 cùng bỏ lượt → kết thúc");
      gameState.calculateScore();
      setIsEnd(true);
      handleIsEnd(gameState);
        socket.emit("move:send", {
    fromUser: userId,
    move: "end",
  });
    } else {
      handleEvent(gameState);
    }
  }

  // Truyền pass cho đối thủ
  socket.emit("move:send", {
    fromUser: userId,
    move: "pass",
  });


const move = "pass";
  const moveText = isWhite ? "White pass" : "Black pass";

  const newMove = {
    order: moveHistory.length + 1,
    move: moveText,
  };
  setMoveHistory(prev => [...prev, newMove]);

}

  const board = renderRow();
  const touchable = renderTouchableRow();



useEffect(() => {
  if (!isEnd && surrender === 0) return;
 /*if (isEndedByOpponentRef.current) {
    console.log("⛔ Không lưu trận vì kết thúc bởi đối thủ.");
    return;
  }*/
  const winner =
    surrender === 1 ? 'black' :
    surrender === 2 ? 'white' :
    gameState.whiteScore > gameState.blackScore ? 'white' : 'black';

  const payload = {
   playerBlack: playerColor === 'B' ? userId : opponentId,
  playerWhite: playerColor === 'W' ? userId : opponentId,
    winner,
    type: 'ranked', // hoặc 'solo' nếu bạn có enum riêng
    moves: moveHistory,
    resultDescription:
      surrender === 1 ? 'White surrendered' :
      surrender === 2 ? 'Black surrendered' :
      `Score - White: ${gameState.whiteScore}, Black: ${gameState.blackScore}`,
    deltaElo: 0,
  };
console.log(payload);
if((winner=='white'&&!isCurrentPlayerWhite)||(winner=='black'&&isCurrentPlayerWhite)) {
  return;
}
  createMatch(payload)
    .then(res => {
      console.log('✅ Match saved to server:', res);
    })
    .catch(err => {
      console.error('❌ Failed to save match:', err);
    });
}, [isEnd/*, surrender*/]);

useEffect(() => {
  socket.on("move:receive", ({ move, fromUser }) => {
    console.log("📥 Nhận nước đi từ đối thủ:", move);
    onReceiveMove(move); // thực hiện đánh
  });

  return () => {
    socket.off("move:receive");
  };
}, []);
 return (
  <View>
    {/* Nút bỏ lượt và đầu hàng của Đối thủ (ở trên) */}
    {/* {renderSkipSurrenderButtons(playerColor === 'W' ? false : true)} */}

    <View style={{ alignItems: 'center' }}>
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
      <View style={style.ChessBoard2BackGround}>
        <View style={style.ChessBoard2}>
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
    {renderSkipSurrenderButtons(playerColor === 'W' ? true : false)}
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
  ChessBoard2BackGround: {
    width: 370,
    height: 370,
    backgroundColor: '#f1b152',
    alignSelf: 'center',
  },
  ChessBoard2: {
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
