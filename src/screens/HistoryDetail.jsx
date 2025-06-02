import React, { useEffect, useState ,useRef} from "react";
import { TouchableOpacity, View, Text, StyleSheet, Image } from "react-native";
import Header from "../components/common/Header";
import Dot from "../components/common/MatchRankScreen/Dot";
import { historyDetails } from "../fake_data/Binh/fake_data";
import { useTheme } from "../asycnc_store/ThemeContext";
import { useLanguage } from "../asycnc_store/LanguageContext";
import { translations } from "../untils/i18n";
import { getMatchById } from "../api/matchApi";
import { da } from "date-fns/locale";
import { getUserById } from "../api/userApi";
const blackPiece = require('../assets/images/pieceBlack.png');
const whitePiece = require('../assets/images/pieceWhite.png');

export default function HistoryDetail({ route }) {
    const [pArr, setPArr] = useState(Array(19 * 19).fill(null));
    const [currentIndex, setCurrentIndex] = useState(0);
    const [blackScore, setBlackScore] = useState(0);
    const [whiteScore, setWhiteScore] = useState(6.5);
    const { matchId } = route.params;   // 🔥 Nhận matchId từ navigation
    const { theme, toggleTheme } = useTheme();
    const isDark = theme == 'dark';
    const styles = isDark ? blackStyle : whiteStyle;
    const { language, toggleLanguage } = useLanguage();
    const t = translations[language];
    const [matchData, setMatchData] = useState(null);
    const [playerBlack, setPlayerBlack] = useState(null);
    const [playerWhite, setPlayerWhite] = useState(null);
    const currentPositionInIndexArray = useRef(-1);
    const [blackSkip, setBlackSkip] = useState(false);
    const [whiteSkip, setWhiteSkip] = useState(false);
    useEffect(() => {
        loadBoardFromGameState(historyDetails.detail[0]);
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
    const board = renderRow(styles);


//////////// Match data theo format này, nhớ chú ý pass với surrender
        useEffect(() => {
        const fetchMatchDetail = async () => {
            try {
                const data = await getMatchById(matchId);  // 🔥 Gọi API
              
                console.log("Matchdata",data);
                setMatchData(data);
                const playerBlackData = await getUserById(data.playerBlack._id);
                const playerWhiteData = await getUserById(data.playerWhite._id);
                
                setPlayerBlack(playerBlackData);
                console.log(playerBlackData);
                console.log(playerWhiteData);
                setPlayerWhite(playerWhiteData);
            } catch (error) {
                console.error('❌ Lỗi lấy chi tiết trận đấu:', error);
            }
        };
        fetchMatchDetail();
    }, [matchId]);




    return <View style={styles.background}>
        <Header title="History"></Header>

        <View style={styles.player_container}>
            <Image source={{ uri: playerBlack==null?"":playerBlack.avatarUrl }} style={styles.avatar} />
            <View style={styles.info}>
                <Text style={styles.name}>{playerBlack==null?"":playerBlack.displayName}</Text>
                <Text style={styles.score}>
                    {t.score}: {blackScore}
                </Text>
            </View>
        </View>
        <View style={styles.button_container}>
            <TouchableOpacity style={[styles.nav_button, { backgroundColor: currentIndex > 0 ? 'rgba(188, 44, 255, 0.5)' : 'transparent' }]} onPress={(e) => {
                e.preventDefault();
                if (currentIndex > 0) {
                    let i = currentIndex - 1;
                    setCurrentIndex(currentIndex => currentIndex - 1);
                    loadBoardFromGameState(historyDetails.detail[i]);
                }
            }}>{currentIndex > 0 && <Text style={styles.nav_button_text}>{t.prev}</Text>}</TouchableOpacity>
            <TouchableOpacity style={[styles.nav_button, { backgroundColor: currentIndex < historyDetails.detail.length - 1 ? 'rgba(188, 44, 255, 0.5)' : 'transparent' }]} onPress={(e) => {
                e.preventDefault();
                if (currentIndex < historyDetails.detail.length - 1) {
                    let i = currentIndex + 1;
                    setCurrentIndex(currentIndex => currentIndex + 1);
                    loadBoardFromGameState(historyDetails.detail[i]);
                }
            }}>{(currentIndex < historyDetails.detail.length - 1) && <Text style={styles.nav_button_text}>{t.next}</Text>}</TouchableOpacity>
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
            <Image source={{ uri: playerWhite==null?"":playerWhite.avatarUrl }} style={styles.avatar} />
            <View style={styles.info}>
                <Text style={styles.name}>{playerWhite==null?"":playerWhite.displayName}</Text>
                <Text style={styles.score}>
                    {t.score}: {whiteScore}
                </Text>
            </View>
        </View>

    </View>
}
function renderCellInRow(index, styles) {
    let res = [];
    for (let i = 0; i < 18; i++) {
        res.push(
            <View style={styles.cell} key={'Cell' + i + '_Row' + index}></View>,
        );
    }
    return res;
}
function renderRow(styles) {
    let res = [];
    for (let i = 0; i < 18; i++) {
        res.push(renderCellInRow(i, styles));
    }
    return res;
}

const whiteStyle = StyleSheet.create({
    background: {
        height: '100%'
    },
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
const blackStyle = StyleSheet.create({
    background: {
        backgroundColor: 'black',
        height: '100%'
    },
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
        backgroundColor: 'gray',
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
        color: '#FFF',
    },
    score: {
        fontSize: 14,
        color: '#EEE',
    },
});

