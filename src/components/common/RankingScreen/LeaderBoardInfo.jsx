import { useTheme } from "@react-navigation/native";
import { Text,View,Image, StyleSheet } from "react-native"; 
export default function LeaderBoardInfo({info, index,isPlayer}) { 
   const {theme, toggleTheme} = useTheme();
   const isDark = theme==='dark';
   const style = isDark?whiteStyle:darkStyle;
   let viewStyle=style;
   if(isPlayer) {
    viewStyle=StyleSheet.create({
        container: {
            display:'flex',
            flexDirection:'row',
            alignItems:'center',
            justifyContent:'space-between',
            backgroundColor:isDark?'#CC8FED':'#CC7EF6',
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
const whiteStyle=StyleSheet.create({
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
        fontWeight:700,
        color:'black'
    }, 
    eloText: {
        marginRight:20,
        color:'black'
    }
});
const darkStyle =StyleSheet.create({
    container: {
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        backgroundColor:'#808080',
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
        fontWeight:700,
        color:'white'
    }, 
    eloText: {
        marginRight:20,
        color:'white'
    }
});