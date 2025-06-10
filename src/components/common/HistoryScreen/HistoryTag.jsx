import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useLanguage } from "../../../asycnc_store/LanguageContext";
import { translations } from "../../../untils/i18n";
import { useTheme } from "../../../asycnc_store/ThemeContext";
export default function HistoryTag({ navigation, history , matchId }) {
    const { language, toggleLanguage } = useLanguage();
    const t = translations[language];
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';
    const styles = isDark ? blackStyle : whiteStyle;
    function translateModeText(mode) {
        if (mode == 'Rank') return t.rank;
        if (mode == 'Friend') return t.friend;
        if (mode == 'AI-Hard') return t.ai_hard;
        if (mode == 'AI-Medium') return t.ai_medium;
        if (mode == 'AI-Easy') return t.ai_easy;
    }

    console.log("HISTORY", history)
    return (
        <TouchableOpacity style={styles.card} onPress={(e) => {
            e.preventDefault();
              navigation.navigate("HistoryDetail", { matchId });
        }}>
            <Text style={styles.time}>🕒 {history.matchDate}</Text>


            <View style={styles.playerRow}>
                <View style={styles.playerInfo}>
                    <Image source={{ uri: history.playerBlack.avatar }} style={styles.avatar} />
                    <View>
                        <Text style={styles.name}>{history.playerBlack.username}</Text>
                        <Text style={styles.score}>{history.playerBlack.score} {history.playerBlack.win ? '🏆' : '❌'}</Text>
                    </View>
                </View>
                <Text style={history.playerBlack.win?styles.win:styles.lose}>{history.playerBlack.win ? t.win : t.lose}</Text>
            </View>


            <View style={styles.playerRow}>
                <View style={styles.playerInfo}>
                    <Image source={{ uri: history.playerWhite.avatar }} style={styles.avatar} />
                    <View>
                        <Text style={styles.name}>{history.playerWhite.username}</Text>
                        <Text style={styles.score}>{history.playerWhite.score} {history.playerWhite.win ? '🏆' : '❌'}</Text>
                    </View>
                </View>
                <Text style={history.playerWhite.win?styles.win:styles.lose}>{history.playerWhite.win ? t.win : t.lose}</Text>
            </View>
            {/* <Text style={styles.mode}>{translateModeText(history.mode)}</Text> */}
        </TouchableOpacity>
    );
}
const whiteStyle = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        padding: 16,
        margin: 16,
        borderRadius: 12,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    mode: {
        alignSelf: 'center',
        fontSize: 20,
        fontWeight: 'bold',

    },
    time: {
        fontSize: 12,
        color: '#888',
        marginBottom: 12,
    },
    playerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    playerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 8,
    },
    name: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    score: {
        fontSize: 14,
        color: '#666',
    },
    win: {
        color: '#22c55e', // xanh lá
        fontWeight: 'bold',
    },
    lose: {
        color: '#ef4444', // đỏ
        fontWeight: 'bold',
    },
});
const blackStyle = StyleSheet.create({
    card: {
        backgroundColor: '#808080',
        padding: 16,
        margin: 16,
        borderRadius: 12,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    time: {
        fontSize: 12,
        color: '#fff',
        marginBottom: 12,
    },
    playerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    playerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 8,
    },
    name: {
        fontWeight: 'bold',
        fontSize: 16,
        color: 'white'
    },
    score: {
        fontSize: 14,
        color: '#CCC',
    },
    win: {
        color: '#22c55e', // xanh lá
        fontWeight: 'bold',
    },
    lose: {
        color: '#ef4444', // đỏ
        fontWeight: 'bold',
    },
    mode: {
        alignSelf: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white'
    }

});
