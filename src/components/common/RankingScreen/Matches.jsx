import { Text,View,Image, StyleSheet } from "react-native"; 
import { useLanguage } from "../../../asycnc_store/LanguageContext";
import { translations } from "../../../untils/i18n";
import { useTheme } from "@react-navigation/native";
export default function Matches({user}) {
    const matches=require('../../../assets/images/Matches.png');
    const {language, toggleLanguage} = useLanguage();
    const  t = translations[language];
    const {theme,toggleTheme} = useTheme();
    const styles= (theme==='dark')?whiteStyles:darkStyles;
    return (<View style={styles.container}>
        <Image source ={matches}></Image> 
        <View>
        <Text style={styles.matchText}>{t.match_text}</Text> 
        <Text style={styles.numberText}>{user.matches}</Text>
        </View>
    </View>
        
    )

}
const whiteStyles = StyleSheet.create( {
    container: {
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        gap:'5',
        paddingRight:20,
        paddingVertical:10,
        borderRadius:20,
        paddingLeft:5,
        width:130,
        height:60,
        backgroundColor:'white'
    
        
    },
    matchText: {
        fontSize:12, 
        color:"#B6B4C2"
    },
    numberText: {
        fontSize:12,
        color:'#6B50F6'
    }

});
const darkStyles = StyleSheet.create( {
    container: {
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        gap:'5',
        paddingRight:20,
        paddingVertical:10,
        borderRadius:20,
        paddingLeft:5,
        width:130,
        height:60,
        backgroundColor:'black'
    
        
    },
    matchText: {
        fontSize:12, 
        color:"white"
    },
    numberText: {
        fontSize:12,
        color:'white'
    }

});