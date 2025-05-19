import React, { } from 'react'
import { View, ScrollView, StyleSheet } from 'react-native'
import Header from '../components/common/Header'
import HistoryTag from '../components/common/HistoryScreen/HistoryTag'
import UserInfo from '../components/common/RankingScreen/UserInfo'
import { User } from '../fake_data/Binh/fake_data'
import { history } from '../fake_data/Binh/fake_data'
import { useTheme } from '../asycnc_store/ThemeContext'


export default function HistoryScreen({ navigation }) {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';
    const styles = isDark ? blackStyles : whiteStyles;

    return <View style={styles.background}>
        <Header title="History"></Header>
        <View style={{ alignSelf: 'center', marginTop: 50 }}>
            <UserInfo user={User}></UserInfo>
        </View>
        <ScrollView style={styles.scroll} scrollEnabled={true}>
            {
                history.map((item, index) => {
                    return <HistoryTag key={"History" + index} history={item} navigation={navigation}></HistoryTag>
                })
            }
        </ScrollView>
    </View>
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
