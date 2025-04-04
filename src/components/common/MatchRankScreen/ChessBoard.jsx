import React, { useState } from "react";
import { Text,View,Image, StyleSheet, TouchableOpacity, DeviceEventEmitter } from "react-native"; 
import Dot from "./Dot";

let isWhite=true;
const blackPiece= require("../../../assets/images/pieceBlack.png");
const whitePiece = require('../../../assets/images/pieceWhite.png');
let pieceArray=[];
    for(let i=0;i<13*13;i++) {
        pieceArray.push(null);
    }

export default function ChessBoard({handleEvent}) { 
    
    const [pArr, setPArr] = useState(pieceArray);
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
    
    function renderTouchableCell(index) {
        let res=[];
        for(let i=0;i<13;i++) {
            res.push(<TouchableOpacity style={style.touchable} key={"Button"+i+"_Row"+index} onPress={(e)=>{
                e.preventDefault();
                const tempParray = [...pArr];
                if(tempParray[index*13+i]!=null) {
                    return;
                }
                if(isWhite) {
                    tempParray[index*13+i]=whitePiece;
                } 
                else {
                    tempParray[index*13+i]=blackPiece;
                }
                setPArr(tempParray);
                isWhite=!isWhite;
                
                handleEvent();

               
                
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
    const chessBoard= require('../../../assets/images/chessboard.png');
    
    const board = renderRow();
    const touchable= renderTouchableRow();
    return (
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
    )

}
export {isWhite}; 
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
    }
})
