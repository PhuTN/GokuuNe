import { View,Text,Image,StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "../../../asycnc_store/ThemeContext";
import { useLanguage } from "../../../asycnc_store/LanguageContext";
import { translations } from "../../../untils/i18n";

export default function ResultPopup({result,navigation, yourScore, opponentScore,state}) {
     const isWin = result=="YOU WIN";
     const {language,toggleLanguage} = useLanguage();
     const t=translations[language];
     const {theme, toggleTheme} = useTheme();
     const isDark=theme==='dark';
     const styles = isDark?darkStyle:whiteStyle;
     function getTextFromState() {
         switch(state) {
            case 0: 
              return t.you_time_out_text; 
            case 1: 
              return t.opponent_time_out_text;
            case 2:
              return t.you_many_score_text;
            case 3: 
              return t.opponent_many_score_text;
            case 4:
              return t.you_surrender_text;
            case 5:
              return t.opponent_surrender_text;
            default:
              return "";
         }
     }
     return (
      <View style={styles.container}>
      <View style={styles.popup}>
        <Text style={{...styles.result,
          color:isWin?"#FFF400":"red"
        }}>{isWin?t.win_text:t.lose_text}</Text>
        <Text style={styles.scoreText}>{getTextFromState()}</Text>
        <Text style={styles.scoreText}>{t.your_score_text}: {yourScore}</Text>
        
        <Text style={styles.scoreText}>{t.opponent_score_text}: {opponentScore}</Text>
        <TouchableOpacity style={styles.button} onPress={(e)=>{
          e.preventDefault();
          navigation.replace("RankingMatch");
          }}><Text style={styles.buttonText}>Another match</Text></TouchableOpacity> 
        <TouchableOpacity style={styles.button}  
        onPress={(e)=>{
          e.preventDefault();
          navigation.goBack();
        }}
        ><Text style={styles.buttonText}>Go back</Text></TouchableOpacity>
      </View>
    </View>
        )
}
const darkStyle = StyleSheet.create({
    container:{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex:2,
        width:'100%',
        height:'100%',
        position:'absolute',
        top:0,
        left:0,
    },
   
    popup: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
      width: 300,
    },
    result: {
      fontSize: 30,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    scoreText: {
      fontSize:20,
      fontWeight:1000
    },
    button: {
      backgroundColor: '#6B50F6',
      padding: 10,
      marginTop: 10,
      borderRadius: 5,
      alignItems: 'center',
      width: '80%',
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
    },
});
const whiteStyle = StyleSheet.create({
    container:{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex:1,
        width:'100%',
        height:'100%',
        position:'absolute',
        top:0,
        left:0,
        display:'flex',
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center'
    },
    popup: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
      width: 300,
    },
    scoreText: {
      fontSize:20,
      fontWeight:1000
    },
    result: {
      fontSize: 30,
      fontWeight: 'bold',
      marginBottom: 10,
    }, 
    button: {
      backgroundColor: '#6B50F6',
      padding: 10,
      marginTop: 10,
      borderRadius: 5,
      alignItems: 'center',
      width: '80%',
    },
    buttonText: {
      color: 'white',
      fontWeight:1000, 
      fontSize:20
    },
})