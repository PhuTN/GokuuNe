import { StyleSheet, Text,View,Image } from "react-native"; 

import Top1Avatar from "./Top1Avatar";
import { useTheme } from "@react-navigation/native";
function generateStringFromName(name) {
    if(name.length<=13) {
        return name;
    } 
    else {
        return name.slice(0,10)+"...";
    }
}
export default function TopInfo({topInfo}) {
    const {theme, toggleTheme} = useTheme();
    const isDark=theme==='dark';
    const style = isDark?whiteStyle:darkStyle;
    const elo=require('../../../assets/images/Elo.png');
    return (
        <View style={style.container}>
            <Top1Avatar topInfo={topInfo}></Top1Avatar>
            <Text style={style.nameText}>{generateStringFromName(topInfo.userName)}</Text>
            <View style={style.eloView}>
            <Text style={style.eloText}>{topInfo.elo}</Text> 
            <Image style={style.eloImage} source={elo}></Image>
            </View>
        </View>
    )
}
const whiteStyle = StyleSheet.create({
    container:{
        width:84,
        display:'flex',
        flexDirection:'column',
        gap:10,
        alignItems:'center'
    },
    nameText: {
        color:'black',
        fontSize:15,
        fontWeight:700,
        marginTop:10
    },
    eloView:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        gap:5
    },
    eloImage:{
        width:12,
        height:12
    },
    eloText:{
        color:'black'
    }
});
const darkStyle = StyleSheet.create({
    container:{
        width:84,
        display:'flex',
        flexDirection:'column',
        gap:10,
        alignItems:'center'
    },
    nameText: {
        color:'white',
        fontSize:15,
        fontWeight:700,
        marginTop:10
    },
    eloView:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        gap:5
    },
    eloImage:{
        width:12,
        height:12
    },
    eloText:{
        color:'white'
    }
})