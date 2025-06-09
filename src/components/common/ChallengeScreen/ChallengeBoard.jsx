import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import { challengeData } from '../../../ChallengeData/ChallengeData';
import { useIsFocused } from '@react-navigation/native';
const blackPiece = require('../../../assets/images/pieceBlack.png');
const whitePiece = require('../../../assets/images/pieceWhite.png');
const BOARD_SIZE = 5;
const screenWidth = Dimensions.get('window').width;
const boardLength = 300
const spacing = boardLength / (BOARD_SIZE - 1); // khoảng cách giữa các đường kẻ
let pieceArray = [];
for (let i = 0; i < 5 * 5; i++) {
  pieceArray.push(null);
}
export default function ChallengeBoard({navigation,setWinOrLose}) { 
    const [currentLevelData, setCurrentLevelData] = useState(challengeData[0]); 
    const [pArr, setPArr] = useState(pieceArray);
    const isFocuse= useIsFocused();
    async function LoadLevel() {
        const level = await AsyncStorage.getItem("challenge_level");
        const currentLevel= parseInt(level,10)-1;
        console.log(level);
        setCurrentLevelData(challengeData[currentLevel]); 
        setPArr(pieceArray);
        loadState(challengeData[currentLevel]);
        
    }
    
    useEffect(()=>{
        LoadLevel();
        
    },[isFocuse])
  const renderLines = () => {
    const lines = [];

    for (let i = 0; i < BOARD_SIZE; i++) {
      const pos = i * spacing;

      // Horizontal line
      lines.push(
        <View
          key={`h-${i}`}
          style={{
            position: 'absolute',
            top: pos,
            left: 0,
            width: boardLength,
            height: 1,
            backgroundColor: '#000',
          }}
        />
      );

      // Vertical line
      lines.push(
        <View
          key={`v-${i}`}
          style={{
            position: 'absolute',
            left: pos,
            top: 0,
            height: boardLength,
            width: 1,
            backgroundColor: '#000',
          }}
        />
      );
    }

    return lines;
  };
  function loadState(currentLevelData) {
    let pieceArr = [];
for (let i = 0; i < 5 * 5; i++) {
  pieceArr.push(null);
} 
for(let row=0;row<5;row++) {
    for(let col=0;col<5;col++) {
        for(let i=0;i<currentLevelData.enemyPos.length;i++) {
        if(row==currentLevelData.enemyPos[i][0]&&col==currentLevelData.enemyPos[i][1]) {
            pieceArr[5*row+col]=whitePiece;
        }
        
        
        
    } 
    for(let i=0;i<currentLevelData.alliePos.length;i++) {
        if(row==currentLevelData.alliePos[i][0]&&col==currentLevelData.alliePos[i][1]) {
           pieceArr[5*row+col]=blackPiece;
        } 
        
       
    }
    }
}
setPArr(pieceArr);
  }
  
  
  function canMove(row,col) {
    for(let i=0;i<currentLevelData.enemyPos.length;i++) {
        if(row==currentLevelData.enemyPos[i][0]&&col==currentLevelData.enemyPos[i][1]) {
            return false;
        }
        
    } 
    for(let i=0;i<currentLevelData.alliePos.length;i++) {
        if(row==currentLevelData.alliePos[i][0]&&col==currentLevelData.alliePos[i][1]) {
            return false;
        }
       
    }
    return true;
  }
  const renderTouchPoints = () => {
    const points = [];

    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        points.push(
          <TouchableOpacity
            key={`${row}-${col}`}
            style={{
              position: 'absolute',
              top: row * spacing - 15,
              left: col * spacing - 15,
              width: 30,
              height: 30,
              borderRadius: 15,
              backgroundColor: 'transparent',
              zIndex: 2,
              //borderWidth:1,
              //borderColor:'black'
            }}
            onPress={(e)=>{
                e.preventDefault();
                if(!canMove(row,col)) {
                    return;
                }
                if(row==currentLevelData.correctPos[0][0]&&col==currentLevelData.correctPos[0][1]) {
                    setPArr(pArr=>{
                        const copyArr=[...pArr];
                        copyArr[5*row+col]=blackPiece;
                        for(let i=0;i<currentLevelData.enemyPos.length;i++) {
                            copyArr[5*currentLevelData.enemyPos[i][0]+currentLevelData.enemyPos[i][1]]=null;
                        }
                        return copyArr;
                    })
                    setWinOrLose(2);
                    console.log("Win");
                }
                else { 
                    setPArr(pArr=>{
                        const copyArr=[...pArr];
                        copyArr[5*row+col]=blackPiece;
                        return copyArr;
                    })
                    setWinOrLose(0);
                    console.log("Lose");
                }
            }}
          >
            <Image source={pArr[5*row+col]} style={{zIndex:2}}></Image>
          </TouchableOpacity>
        );
      }
    }

    return points;
  };

  return (
    <View style={styles.container}>
      <View style={styles.board}>
        <View style={styles.grid}>
          {renderLines()}
          {renderTouchPoints()}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  board: {
    backgroundColor: '#f2dfb1', // vàng gỗ
    width: boardLength+10,
    height: boardLength+10,
    borderWidth: 4,
    borderColor: '#b87a2d', // viền gỗ nâu
  },
  grid: {
    flex: 1,
  position: 'relative',
  padding: 0,
  },
});
