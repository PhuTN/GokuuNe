import React, { useEffect, useState } from "react";
import { TouchableOpacity, View, Text, StyleSheet, Image } from "react-native";
import Header from "../components/common/Header";
import Dot from "../components/common/MatchRankScreen/Dot";
import { historyDetails } from "../fake_data/Binh/fake_data";
const blackPiece = require('../assets/images/pieceBlack.png');
const whitePiece = require('../assets/images/pieceWhite.png');


export default function HistoryDetail() {
    const [pArr, setPArr] = useState(Array(19 * 19).fill(null));
    const [currentIndex, setCurrentIndex] = useState(0);
    const [blackScore, setBlackScore] = useState(0);
    const [whiteScore, setWhiteScore] = useState(6.5);
    useEffect(() => {
        loadBoardFromGameState(historyDetails[0]);
        console.log("Load");
    }, []);
    function loadBoardFromGameState(historyDetail) {
        const boardData = historyDetail.boardData;
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
                if (boardData[i][j] == '') {
                    setPArr(pArr => {
                        pArr[i * 19 + j] = null;
                        return pArr;
                    });
                }
            }
        };
        setBlackScore(historyDetail.blackScore);
        setWhiteScore(historyDetail.whiteScore);
    }
    function renderImageRow() {
        let res = [];
        for (let i = 0; i < 19; i++) {
            res.push(renderPieceImage(i));
        }
        return res;
    }
    function renderPieceImage(index) {
        let res = [];

        for (let i = 0; i < 19; i++) {
            res.push(
                <View
                    style={styles.image_container}
                    key={'Button' + i + '_Row' + index}
                >
                    <Dot key={"Dot" + index + "" + i} index={index * 19 + i}></Dot>
                    <Image style={pArr[index * 19 + i] != null ? styles.pieceImageEnable : styles.pieceImageDisable} key={"Image" + index + "" + i} source={pArr[index * 19 + i]}></Image>

                </View>,
            );
        }
        return res
    }
    const images = renderImageRow();
    return <View>
        <Header title="History"></Header>

        <View style={styles.player_container}>
            <Image source={{ uri: "https://pnghq.com/wp-content/uploads/cartoon-avatar-png-free-image-png-21820-1536x1536.png" }} style={styles.avatar} />
            <View style={styles.info}>
                <Text style={styles.name}>Ngoc Kem</Text>
                <Text style={styles.score}>
                    Điểm: {blackScore}
                </Text>
            </View>
        </View>
        <View style={styles.button_container}>
            <TouchableOpacity style={[styles.nav_button, { backgroundColor: currentIndex > 0 ? 'rgba(188, 44, 255, 0.5)' : 'transparent' }]} onPress={(e) => {
                e.preventDefault();
                if (currentIndex > 0) {
                    let i = currentIndex - 1;
                    setCurrentIndex(currentIndex => currentIndex - 1);
                    loadBoardFromGameState(historyDetails[i]);
                }
            }}>{currentIndex > 0 && <Text style={styles.nav_button_text}>Prev</Text>}</TouchableOpacity>
            <TouchableOpacity style={[styles.nav_button, { backgroundColor: currentIndex < historyDetails.length - 1 ? 'rgba(188, 44, 255, 0.5)' : 'transparent' }]} onPress={(e) => {
                e.preventDefault();
                if (currentIndex < historyDetails.length - 1) {
                    let i = currentIndex + 1;
                    setCurrentIndex(currentIndex => currentIndex + 1);
                    loadBoardFromGameState(historyDetails[i]);
                }
            }}>{(currentIndex < historyDetails.length - 1) && <Text style={styles.nav_button_text}>Next</Text>}</TouchableOpacity>
        </View>
        <View>
            <View style={styles.chessBoardBackGround}>
                <View style={styles.chessBoard}>
                    {board.map((item, index) => {
                        return (<View style={styles.row} key={'Row' + index}>
                            {item.map((cell, i) => {
                                return <View>
                                    {cell}
                                    {/*<Dot index={index * 19 + i}></Dot>*/}
                                </View>
                            })}
                        </View>)
                    })}
                    <View style={styles.image_area}>
                        {images.map((item, index) => {
                            return (
                                <View style={styles.row} key={'TouchableRow' + index}>
                                    {item.map((cell, i) => {
                                        return cell;
                                    })}
                                </View>
                            );
                        })}
                    </View>
                </View>

            </View>

            <View></View>
        </View>
        <View style={styles.player_container}>
            <Image source={{ uri: "https://pnghq.com/wp-content/uploads/cartoon-avatar-png-free-image-png-21820-1536x1536.png" }} style={styles.avatar} />
            <View style={styles.info}>
                <Text style={styles.name}>Ngoc Kem</Text>
                <Text style={styles.score}>
                    Điểm: {whiteScore}
                </Text>
            </View>
        </View>

    </View>
}
function renderCellInRow(index) {
    let res = [];
    for (let i = 0; i < 18; i++) {
        res.push(
            <View style={styles.cell} key={'Cell' + i + '_Row' + index}></View>,
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

const styles = StyleSheet.create({
    button_container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 12,
        marginBottom: 8,
    },
    nav_button: {

        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 8,

        width: 100
    },
    nav_button_text: {
        fontSize: 20,
        color: '#333',
        fontWeight: '500',
        textAlign: 'center',
        color: 'white'
    },
    chessBoardBackGround: {
        width: 360,
        height: 360,
        backgroundColor: '#f1b152',
        alignSelf: 'center',
    },
    chessBoard: {
        width: 325,
        height: 325,
        position: 'absolute',
        top: 18,
        left: 18,
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
    image_container: {
        width: 18,
        height: 18,

    },
    image_area: {
        width: 342,
        height: 342,
        position: 'absolute',
        top: -9,
        left: -9,
        borderColor: 'black',
    },
    pieceImageDisable: {
        display: 'none',
        position: 'absolute',
        top: 0,
        left: 0,
        width: 18,
        height: 18
    },
    pieceImageEnable: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 18,
        height: 18

    },
    player_container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        backgroundColor: '#ffffff',
        borderRadius: 12,
        marginVertical: 30,
        marginHorizontal: 12,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 12,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    info: {
        flexDirection: 'column',
    },
    name: {
        fontSize: 20,
        fontWeight: '6600',
        color: '#333',
    },
    score: {
        fontSize: 14,
        color: '#555',
    },
});
const board = renderRow();
