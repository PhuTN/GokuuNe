import { Text,View,Image, StyleSheet } from "react-native"; 
export default function LeaderBoardInfo({info, index,isPlayer}) { 
    
   let viewStyle=style;
   if(isPlayer) {
    viewStyle=StyleSheet.create({
        container: {
            display:'flex',
            flexDirection:'row',
            alignItems:'center',
            justifyContent:'space-between',
            backgroundColor:'#CC8FED',
            padding:10,
            borderRadius:10
        }
    })
   }
    return (
        <View style={viewStyle.container}>
            <View style={style.subContainer}>
            <Text style={style.boldText}>{index}</Text> 
            <Image style={style.image} source={{uri:info.userAvatarURL}}></Image> 
            <Text style={style.boldText}>{info.userName}</Text>
            </View>
            <Text style={style.eloText}>{info.elo}</Text>
        </View>
    )
}
const style=StyleSheet.create({
    container: {
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        backgroundColor:'white',
        padding:10,
        borderRadius:10
    },
    subContainer:{
        display:'flex',
        flexDirection:'row',
        gap:20,
        alignItems:'center'
    },
    image: {
        width:32,
        height:32,
        borderRadius:50,
        
    }, 
    boldText:{
        fontWeight:700
    }, 
    eloText: {
        marginRight:20
    }
})