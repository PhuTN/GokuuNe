import { StyleSheet, Text,View,Image } from "react-native"; 

import Top1Avatar from "./Top1Avatar";
function generateStringFromName(name) {
    if(name.length<=13) {
        return name;
    } 
    else {
        return name.slice(0,10)+"...";
    }
}
export default function TopInfo({topInfo}) {
    const elo=require('../../../assets/images/Elo.png');
    return (
        <View style={style.container}>
            <Top1Avatar topInfo={topInfo}></Top1Avatar>
            <Text style={style.nameText}>{generateStringFromName(topInfo.userName)}</Text>
            <View style={style.eloView}>
            <Text>{topInfo.elo}</Text> 
            <Image style={style.eloImage} source={elo}></Image>
            </View>
        </View>
    )
}
const style = StyleSheet.create({
    container:{
        width:84,
        display:'flex',
        flexDirection:'column',
        gap:10,
        alignItems:'center'
    },
    nameText: {
        
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
    }
})