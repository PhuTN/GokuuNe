import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import Header from '../components/common/Header';
import HistoryTag from '../components/common/HistoryScreen/HistoryTag';
import UserInfo from '../components/common/RankingScreen/UserInfo';
import { useTheme } from '../asycnc_store/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMatchesByUserId } from '../api/matchApi'; // API mới
import { translations } from '../untils/i18n';
import { useLanguage } from '../asycnc_store/LanguageContext';

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
                    console.log(parsedUser);
                    const mapUser = {
                        userId: parsedUser._id,
            userName: parsedUser.displayName ?? 'Unknown',
            country: parsedUser.nationality ?? 'VietNam',
            matches: parsedUser.matchHistory.length,
            elo: parsedUser.elo ?? 2200,
            userCountryImageURL:
              'https://www.shutterstock.com/image-vector/vietnam-flag-made-vectors-260nw-1928345522.jpg',
            userAvatarURL:
              parsedUser.avatarUrl ??
              'https://example.com/default-avatar.jpg',
            rank: parsedUser.rank ?? 4,
                    }
                    setUser(mapUser);

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
                console.log(error+"");
                if(error=="AxiosError: Request failed with status code 404") {
                    return;
                }
                console.error('❌ Lỗi lấy user hoặc lịch sử đấu:', error);
            }
        };
        fetchData();
    }, []);
    console.log("HISTORY", history)
  const { language, toggleLanguage } = useLanguage();
  const t= translations[language];
     
    return (
        <View style={styles.background}>
            <Header title={t.history_text} />
            {user ? (
                <View style={{ alignSelf: 'center', marginTop: 50 }}>
                    <UserInfo user={user} />
                </View>
            ) : (
                <Text style={{ textAlign: 'center', marginTop: 50 }}>{t.loading_text}...</Text>
            )}
            <ScrollView style={styles.scroll} scrollEnabled={true}>
                 {history.length > 0 ? (
    [...history].reverse().map((item, index) => ( // 👈 Đảo ngược mảng
                       
    <HistoryTag 
      key={`History${index}`} 
      history={item} 
      navigation={navigation}
      matchId={item._id}   // 🔥 Thêm ID của trận đấu
    />

                    ))
                ) : (
                    <Text style={{ textAlign: 'center', marginTop: 20 }}>{t.not_have_match_text}</Text>
                )}
            </ScrollView>
        </View>
    );
}

const whiteStyles = StyleSheet.create({
    scroll: {

        marginBottom: 200,


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
