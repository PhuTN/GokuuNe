import React, { useEffect, useState } from "react";
import { Text,View,Image, StyleSheet, TouchableOpacity, DeviceEventEmitter, Alert } from "react-native"; 
import Dot from "./Dot";
import GameState from "../../../game_logic/GameState";
import { useIsFocused } from "@react-navigation/native";
import { useLanguage } from "../../../asycnc_store/LanguageContext";
import { translations } from "../../../untils/i18n";
import { OnOpponentMove } from "../../../untils/OpponentEvent";
import { EventRegister } from "react-native-event-listeners";

const blackPiece= require("../../../assets/images/pieceBlack.png");
const whitePiece = require('../../../assets/images/pieceWhite.png');
let pieceArray=[];
    for(let i=0;i<13*13;i++) {
        pieceArray.push(null);
    }

export default function ChessBoard({handleEvent,flag,handleIsEnd,handleSurrender, isCurrentPlayerWhite, isStart}) { 
    const isFocuse = useIsFocused();
    const [pArr, setPArr] = useState(pieceArray);
    const {language, toggleLanguage}= useLanguage();
    const t=translations[language];
    const [gameState, setGameState] = useState(new GameState());
    const [whiteSkip, setWhiteSkip] = useState(false);
    const [blackSkip, setBlackSkip] = useState(false);
    const [disable, setDisable]= useState(false);
    useEffect(()=>{
        setGameState(new GameState());
        setPArr(pieceArray);
        loadBoardFromGameState();
        setBlackSkip(false);
        setWhiteSkip(false);
        setDisable(!isCurrentPlayerWhite);
        
    },[isFocuse]);
    useEffect(()=>{
        if(isStart==true) {
            if(isCurrentPlayerWhite!=flag) {
                setDisable(true);
                ListenOpponentMove();
                
                return;
            }
            else {
                setDisable(false);
            }
            console.log("Start");
        }
    },[isStart,flag])
    function renderSkipSurrenderButtons(isCurrentPlayerWhite, isWhite) {
        if(isWhite==isCurrentPlayerWhite) {
                return <View style={style.container}>
                <TouchableOpacity style={style.button} onPress={(e)=>{
                    e.preventDefault();
                    onSkip(isCurrentPlayerWhite);
                }}>
                    <Text style={style.text}>{t.skip_text}</Text>
                </TouchableOpacity>
    
                <TouchableOpacity style={style.button} onPress={(e)=>{
                    e.preventDefault();
                    onSurrender(isCurrentPlayerWhite);
                }}>
                    <Text style={style.text}>{t.surrender_text}</Text>
                </TouchableOpacity>
                </View>
            
        }
        else {
            return <></>
        }
    }
    function renderCellInRow(index) {
        let res=[];
        for( let i=0;i<14;i++) {
            res.push(<View style={style.cell} key={"Cell"+i+"_Row"+index}></View>)
        }
        return res;
    } 
    function renderRow() {
        let res=[];
        for(let i=0;i<14;i++) {
            res.push(renderCellInRow(i));
        }
        return res;
    }
    
    async function onSurrender(isWhite) {
        gameState.calculateScore();
       handleSurrender(isWhite);
    }
    function loadBoardFromGameState() {
        const boardData = gameState.convertToBoardData();
        for(let i=0;i<13;i++) {
            for(let j=0;j<13;j++) {
                if(boardData[i][j]=='B') {
                    setPArr(pArr=>{
                        pArr[i*13+j]=blackPiece;
                        return pArr;
                    });
                    continue;
                }
                if(boardData[i][j]=='W') {
                    setPArr(pArr=>{
                        pArr[i*13+j]=whitePiece;
                        return pArr;
                    });
                    continue;
                }
                if(boardData[i][j]=='0') {
                    setPArr(pArr=>{
                        pArr[i*13+j]=null;
                        return pArr;
                    })
                }
                
            }
        }
    }
    function ListenOpponentMove() {
        if(flag==isCurrentPlayerWhite) {
            return ;
        }
        const waitingOpponentMove = new Promise((resolve,reject)=>{
            setTimeout(()=>{
                const opponentMove = OnOpponentMove(gameState,isCurrentPlayerWhite);
                const nextMove = isCurrentPlayerWhite?'B':'W';
                
                
                resolve({
                    opponentMove:opponentMove,
                    nextMove:nextMove
                });
            },1000)
        })
       
        waitingOpponentMove.then((data)=>{
            if(data.opponentMove==0) {
                onSkip(!isCurrentPlayerWhite);
                Alert.alert(t.skip_text,t.opponent_skip_text);
                return;
            } 
            if(data.opponentMove==1) {
                onSurrender(!isCurrentPlayerWhite);
                return;
            }
            loadBoardFromGameState();
            setBlackSkip(false);
            setWhiteSkip(false);   
            handleEvent(gameState);
            setDisable(false);
        })
        
        return ;
    }
    function renderTouchableCell(index) {
        let res=[];
        
        for(let i=0;i<13;i++) {
            res.push(<TouchableOpacity style={style.touchable} key={"Button"+i+"_Row"+index} disabled={disable} onPress={(e)=>{
                e.preventDefault();
                
                const tempParray = [...pArr];
                if(flag==isCurrentPlayerWhite) {
                    if(tempParray[index*13+i]!=null) {
                        return;
                    }

                    if(flag) {
                        if(gameState.posArray[index][i].canMove('W')) {
                            setGameState((gameState)=>{
                                gameState.move(index,i,'W');
                                return gameState;
                            });
                            
                        }
                    } 
                    else {
                        if(gameState.posArray[index][i].canMove('B')) {
                        
                            setGameState((gameState)=>{
                                gameState.move(index,i,'B');
                                return gameState;
                            });
                            
                        }
                    } 
                    loadBoardFromGameState();
                    setBlackSkip(false);
                    setWhiteSkip(false);   
                    handleEvent(gameState);
                }
                /*else {
                    const opponentMove = OnOpponentMove(gameState,isCurrentPlayerWhite);
                    const nextMove = isCurrentPlayerWhite?'B':'W';
                    setGameState((gameState)=>{
                        gameState.move(opponentMove[0],opponentMove[1],nextMove);
                        return gameState;
                    })
                }*/
                
            }}>
                
                    
            <Dot index={index*13+i}></Dot>
            <Image style={style.pieceImageEnable} source = {pArr[index*13+i]}></Image>

            </TouchableOpacity>)
        }
        return  res;
    }
    function renderTouchableRow() {
        let res=[];
        for(let i=0;i<13;i++) {
            res.push(renderTouchableCell(i));
        } 
        return res;
    }
    
    function onSkip(isWhite) {
        if(isWhite&&flag) {
            setWhiteSkip(true);
            if(blackSkip) {
                gameState.calculateScore();
                handleIsEnd(gameState);
            }
            else {
                handleEvent(gameState)
            }
            return;
        }
        if(!isWhite&&!flag) {
            setBlackSkip(true);
            if(whiteSkip) {
                gameState.calculateScore();
                handleIsEnd(gameState);
            }
            else {
                handleEvent(gameState)
            }
        }
        
        
    }
    const board = renderRow();
    const touchable= renderTouchableRow();
    return (
        <View>
           {
             renderSkipSurrenderButtons(isCurrentPlayerWhite,false)
           }
        <View style={style.chessBoardBackGround} >
            <View style={style.chessBoard}>
                {
                    board.map((item, index)=>{
                        return (
                            <View style={style.row} key={"Row"+index}>
                                {
                                    item.map((cell,i)=>{
                                        return cell;
                                    })
                                }
                            </View>
                        )
                    })
                }
                <View style={style.touchableArea}>
                    {
                        touchable.map((item,index)=>{
                            return (
                                <View style={style.row} key={"TouchableRow"+index}>
                                    {
                                        item.map((cell,i)=>{
                                            return cell;
                                        })
                                    }
                                </View>
                            )
                        })
                    }

</View>
            </View>
            
            
            
        </View>
        {
            renderSkipSurrenderButtons(isCurrentPlayerWhite,true)
        }
        
        </View>
    )

}
export const currentPlayerMove = {WAITING:{
    move:[],
    isSkip:false
}};
const style=StyleSheet.create({
    chessBoardBackGround: {
        width:388,
        height:388,
        backgroundColor:'#f1b152',
        alignSelf:'center'
    },
    chessBoard: {
        width:378,
        height:378,
        position:'absolute',
        top:5,
        left:5,
        backgroundColor:'#fff5e9'
    },
    cell:{
        width:27,
        height:27,
        borderWidth:1,
        borderColor:'black'
    },
    row:{
        display:'flex',
        flexDirection:'row'
    },
    touchableArea: {
        width:351,
        height:351,
        position:'absolute',
        top:13.5,
        left:13.5,
        borderColor:'black',
        
    },
    touchable: {
        width:27,
        height:27,
        
    },
    pieceImageDisable:{
        display:'none',
        position:'absolute',
        top:0,
        left:0
    },
    pieceImageEnable:{
        position:'absolute',
        top:0,
        left:0
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
      }
})
