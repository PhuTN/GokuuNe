import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import Header from '../components/common/Header';
import HistoryTag from '../components/common/HistoryScreen/HistoryTag';
import UserInfo from '../components/common/RankingScreen/UserInfo';
import { useTheme } from '../asycnc_store/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMatchesByUserId } from '../api/matchApi'; // API mới

export default function HistoryScreen({ navigation }) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const styles = isDark ? blackStyles : whiteStyles;

    const [user, setUser] = useState(null);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const storedUser = await AsyncStorage.getItem('currentUser');
                if (storedUser) {
                    const parsedUser = JSON.parse(storedUser);
                    setUser(parsedUser);

                    const apiData = await getMatchesByUserId(parsedUser._id);
                    console.log('📥 Lịch sử từ API:', apiData);

                    // Map dữ liệu từ API về format history mẫu
                    const mappedHistory = apiData.map(item => {
                        const playerBlack = {
                            username: item.playerBlack?.displayName || 'Unknown',
                            avatar: item.playerBlack?.avatarUrl || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
                            score: item.moves ? item.moves.filter(m => m.move !== 'pass').length : 0,
                            win: item.winner === 'black'
                        };
                        const playerWhite = {
                            username: item.playerWhite?.displayName || 'Unknown',
                            avatar: item.playerWhite?.avatarUrl || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
                            score: item.moves ? item.moves.filter(m => m.move !== 'pass').length : 0,
                            win: item.winner === 'white'
                        };
                        const matchDate = new Date(item.createdAt).toLocaleString('vi-VN');
                        const modeMap = { ranked: 'Rank', friendly: 'Friend', bot: 'AI-Hard' };
                        const mode = modeMap[item.type] || 'Unknown';
                        
                        return {
                             _id: item._id, 
                            playerBlack,
                            playerWhite,
                            matchDate,
                            mode
                        };
                    });

                    setHistory(mappedHistory);
                } else {
                    console.warn('🚨 Không tìm thấy user trong AsyncStorage');
                }
            } catch (error) {
                console.error('❌ Lỗi lấy user hoặc lịch sử đấu:', error);
            }
        };
        fetchData();
    }, []);
    console.log("HISTORY", history)
    return (
        <View style={styles.background}>
            <Header title="History" />
            {user ? (
                <View style={{ alignSelf: 'center', marginTop: 50 }}>
                    <UserInfo user={user} />
                </View>
            ) : (
                <Text style={{ textAlign: 'center', marginTop: 50 }}>Đang tải thông tin...</Text>
            )}
            <ScrollView style={styles.scroll} scrollEnabled={true}>
                {history.length > 0 ? (
                    history.map((item, index) => (
                       history.map((item, index) => (
    <HistoryTag 
      key={`History${index}`} 
      history={item} 
      navigation={navigation}
      matchId={item._id}   // 🔥 Thêm ID của trận đấu
    />
))
                    ))
                ) : (
                    <Text style={{ textAlign: 'center', marginTop: 20 }}>Chưa có trận đấu nào</Text>
                )}
            </ScrollView>
        </View>
    );
}

const whiteStyles = StyleSheet.create({
    scroll: {
        marginBottom: 300,
        marginTop: 50
    },
    background: {}
});

const blackStyles = StyleSheet.create({
    scroll: {
        marginBottom: 300,
        backgroundColor: '#d3d3d3',
        marginTop: 50
    },
    background: {
        backgroundColor: '#00000F'
    }
});
