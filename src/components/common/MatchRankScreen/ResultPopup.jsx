import { View,Text,Image,StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "../../../asycnc_store/ThemeContext";
import { useLanguage } from "../../../asycnc_store/LanguageContext";
import { translations } from "../../../untils/i18n";

export default function ResultPopup({result,navigation}) {
     const isWin = result=="YOU WIN";
     const {language,toggleLanguage} = useLanguage();
     const t=translations[language];
     const {theme, toggleTheme} = useTheme();
     const isDark=theme==='dark';
     const style = isDark?darkStyle:whiteStyle;
     return (
            <View style={style.container}>
                <View style={style.searchView}>
                  
                <Text style={style.resultText}>{isWin?t.win_text:t.lose_text}</Text>
                    <TouchableOpacity style={style.button} onPress={(e)=>{
                        e.preventDefault();
                        navigation.replace("RankingMatch");
                    }}>
                    <Text style={style.buttonText}>{t.another_match_text}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={style.button} onPress={(e)=>{
                      e.preventDefault();
                      navigation.goBack();
                    }}>
                    <Text style={style.buttonText}>{t.back_text}</Text>
                    </TouchableOpacity>
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
   
    searchView:{
        alignSelf:'center',
        position:'absolute',
        top:270,
        borderRadius:20,
        backgroundColor:'black',
        width:200,
        height:200,
        justifyContent:'center',
        alignItems:'center',
        gap:20,
        display:'flex',
        flexDirection:'column'
    },
    resultText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 10,
        textAlign: "center",
      },
      button: {
        backgroundColor: "#4CAF50",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 10,
        alignItems: "center",
      },
      buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
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
    searchView:{
        position:'absolute',
        top:270,
        borderRadius:20,
        backgroundColor:'white',
        width:200,
        height:200,
        justifyContent:'center',
        alignItems:'center',
        gap:20,
        display:'flex',
        flexDirection:'column'
    }, 
    resultText: {
        fontSize: 30,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 10,
        textAlign: "center",
      },
      button: {
        backgroundColor: "#4CAF50",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 0,
        alignItems: "center",
      },
      buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
      },
})