import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
export default function HistoryTag({ navigation }) {
    return (
        <TouchableOpacity style={styles.card} onPress={(e) => {
            e.preventDefault();
            navigation.navigate("HistoryDetail");
        }}>
            <Text style={styles.time}>🕒 16/05/2025 - 14:30</Text>


            <View style={styles.playerRow}>
                <View style={styles.playerInfo}>
                    <Image source={{ uri: "https://pnghq.com/wp-content/uploads/cartoon-avatar-png-free-image-png-21820-1536x1536.png" }} style={styles.avatar} />
                    <View>
                        <Text style={styles.name}>Alice</Text>
                        <Text style={styles.score}>43.5 🏆</Text>
                    </View>
                </View>
                <Text style={styles.win}>Thắng</Text>
            </View>


            <View style={styles.playerRow}>
                <View style={styles.playerInfo}>
                    <Image source={{ uri: "https://pnghq.com/wp-content/uploads/cartoon-avatar-png-free-image-png-21820-1536x1536.png" }} style={styles.avatar} />
                    <View>
                        <Text style={styles.name}>Bob</Text>
                        <Text style={styles.score}>41.0 ❌</Text>
                    </View>
                </View>
                <Text style={styles.lose}>Thua</Text>
            </View>
        </TouchableOpacity>
    );
}
const styles = StyleSheet.create({
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