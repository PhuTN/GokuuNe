import React, { useEffect, useState } from "react"; 
import { StyleSheet, View } from "react-native";
import Header from "../components/common/Header";
import ChallengeBoard from "../components/common/ChallengeScreen/ChallengeBoard";
import ResultChallenge from "../components/common/ChallengeScreen/ResultChallenge";
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLanguage } from "../asycnc_store/LanguageContext";
import { translations } from "../untils/i18n";
import { useTheme } from "../asycnc_store/ThemeContext";
export default function ChallengeDetail({navigation}) {
    const [winOrLose, setWinOrLose] = useState(1); //2:win,0:lose;
    const [isReachFinalLevel, setIsReachFinalLevel] = useState(false);
    const {language, toggleLanguage} = useLanguage();
    const t=translations[language];
    const isFocused = useIsFocused(); 
    const {theme, toggleTheme} = useTheme();
    const isDark=theme=='dark';
    const styles= isDark?blackStyle:whiteStyle;
    async function loadCurrentLevel() {
        const currentLevelString = await AsyncStorage.getItem("challenge_level");
        if(currentLevelString!=null) {
            let currentLevelNumber = parseInt(currentLevelString);
            if(currentLevelNumber==10) {
                setIsReachFinalLevel(true);
            }
            else {
                setIsReachFinalLevel(false);
            }
        }
    }
    useEffect(()=>{ 
        loadCurrentLevel();
    },[isFocused])
    return (<View style={styles.container}>
        <Header title={t.challenge_title}></Header>
        {winOrLose!=1&&<ResultChallenge  isWin={winOrLose==2} navigation={navigation} setLoseOrWin={setWinOrLose} isReachFinalLevel={isReachFinalLevel}></ResultChallenge>}
        <ChallengeBoard navigation={navigation} setWinOrLose={setWinOrLose}></ChallengeBoard>
    </View>)
} 
const whiteStyle= StyleSheet.create({
    container:{
        backgroundColor:'white',
        height:'100%'
    }
});
const blackStyle= StyleSheet.create({
    container:{
        backgroundColor:'black',
        height:'100%'
    }
})