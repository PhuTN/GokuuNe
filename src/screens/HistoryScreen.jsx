import React, { } from 'react'
import { View, ScrollView, StyleSheet } from 'react-native'
import Header from '../components/common/Header'
import HistoryTag from '../components/common/HistoryScreen/HistoryTag'
import UserInfo from '../components/common/RankingScreen/UserInfo'
import { User } from '../fake_data/Binh/fake_data'
export default function HistoryScreen({ navigation }) {
    return <View>
        <Header title="History"></Header>
        <View style={{ alignSelf: 'center', marginTop: 50 }}>
            <UserInfo user={User}></UserInfo>
        </View>
        <ScrollView style={styles.scroll} scrollEnabled={true}>
            <HistoryTag navigation={navigation}></HistoryTag>
            <HistoryTag navigation={navigation}></HistoryTag>
            <HistoryTag navigation={navigation}></HistoryTag>
            <HistoryTag navigation={navigation}></HistoryTag>
            <HistoryTag navigation={navigation}></HistoryTag>
            <HistoryTag navigation={navigation}></HistoryTag>
            <HistoryTag navigation={navigation}></HistoryTag>
            <HistoryTag navigation={navigation}></HistoryTag>
            <HistoryTag navigation={navigation}></HistoryTag>
            <HistoryTag navigation={navigation}></HistoryTag>
            <HistoryTag navigation={navigation}></HistoryTag>
            <HistoryTag navigation={navigation}></HistoryTag>
            <HistoryTag navigation={navigation}></HistoryTag>
            <HistoryTag navigation={navigation}></HistoryTag>
        </ScrollView>
    </View>
}
const styles = StyleSheet.create({
    scroll: {
        marginBottom: 250,

        marginTop: 50
    }
});
