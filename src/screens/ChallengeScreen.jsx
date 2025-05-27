import React, { useEffect, useState } from "react";

import Header from "../components/common/Header";
import { View,Text, StyleSheet,ScrollView, TouchableOpacity } from "react-native";
import { useTheme } from "../asycnc_store/ThemeContext"; 
import PlayButton from "../components/common/Button/PlayButton";
import { useLanguage } from "../asycnc_store/LanguageContext";
import { translations } from "../untils/i18n";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ChallengeScreen({navigation}) {  
    const {theme,toggleThem} = useTheme();
    const isDark = theme==='dark';
    const styles = isDark?blackStyle:whiteStyle;
    const {language, toggleLanguage} = useLanguage();
    const  t = translations[language];
    const [currentLevel, setCurrentLevel] = useState(1);
    const levels = Array.from({ length: 10 }, (_, i) => i + 1);
const LevelButton = ({ level }) => (
  <TouchableOpacity style={level!=currentLevel?styles.levelButton:styles.levelSelectedButton} onPress={(e)=>{
    e.preventDefault();
    setCurrentLevel(level);
    AsyncStorage.setItem("challenge_level",level+"");
  }}>
    <Text style={styles.levelText}>{t.level_text} {level}</Text>
  </TouchableOpacity>
);
useEffect(()=>{
AsyncStorage.setItem("challenge_level","1");
},[])
  
  const renderRows = () => {
    const rows = [];
    for (let i = 0; i < levels.length; i += 2) {
      rows.push(
        <View style={styles.row} key={i}>
          <LevelButton level={levels[i]} />
          {levels[i + 1] && <LevelButton level={levels[i + 1]} />}
        </View>
      );
    }
    return rows;
  }; 
    
    return (
        <View>
            <Header title="Challenge"></Header>
            <Text style={styles.text}>{t.choose_level_text}</Text> 
            <ScrollView contentContainerStyle={styles.levelContainer}>
        {renderRows()}
      </ScrollView>
      <PlayButton navigation={navigation} destination={"ChallengeDetail"}></PlayButton>
        </View>
    )
}
const whiteStyle = StyleSheet.create({
    container: {

    },
    text:{
        color:"#FFC107",
        fontSize:40,
        textAlign:'center',
        fontWeight:'bold',
        paddingTop:20
    },
    levelContainer: {
        marginTop:40,
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  levelButton: {
    backgroundColor: 'rgba(188, 44, 255, 0.5)',
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: '45%',
    alignItems: 'center',
  },
  levelText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  }, 
  levelSelectedButton:{
    backgroundColor: 'rgba(188, 44, 255, 0.5)',
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: '45%',
    alignItems: 'center',
    borderWidth:5,
    borderColor:'#FFC107'
  }
});
const blackStyle = StyleSheet.create({

})