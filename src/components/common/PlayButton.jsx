import { StyleSheet, Text, TouchableOpacity } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useLanguage } from "../../asycnc_store/LanguageContext";
import { translations } from "../../untils/i18n";
export default function PlayButton({navigation}) {
    const {language,toggleLanguage} = useLanguage();
    const t = translations[language];
    return (
        <TouchableOpacity style={style.playButton} onPress={(e)=>{
            e.preventDefault();
            navigation.navigate("RankingMatch");
        }}>
            <LinearGradient 
            colors={['#6B50F6', '#CC8FED']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}   
            style={style.linearGradient} 
            >
            <Text style={style.playButtonText}>{t.play_button_text}</Text>
            </LinearGradient>
        </TouchableOpacity>
    )
}
const style=StyleSheet.create( {
    playButton: {
        width:315,
        height:60,
        alignSelf:'center',
        marginBottom:30

    },
    linearGradient: {
        width:'100%',
        height:'100%',
        alignItems:'center',
        justifyContent:'center',
        alignSelf:'center',
        marginTop:50,
       
        borderColor:'black',
        borderWidth:1,
        borderRadius:10
    },
    playButtonText: {
        fontSize:32,
        fontWeight:700,
        color:'white'
    }
})