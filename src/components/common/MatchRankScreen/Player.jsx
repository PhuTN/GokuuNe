import {Text,View,Image, StyleSheet} from 'react-native';
import { isWhite } from './ChessBoard';
export default  function Player({user,isWhite,time}) { 
    const avatar = require('../../../assets/images/Top1.png');
    const piectBlack=require('../../../assets/images/pieceBlack.png');
    const pieceWhite = require("../../../assets/images/pieceWhite.png");
    const flag=require('../../../assets/images/Vietnam.png');
    return (
        
        <View style={styles.container}>
            <View style={styles.playerInfo}>
            <Image style={styles.avatar} source={{uri:user.userAvatarURL}}></Image> 
            <View  >
                <Text style={styles.textStyle}>{user.userName} ({user.elo})</Text> 
                <View style={styles.pieceContainer}>
                    <Image source={isWhite?pieceWhite:piectBlack}></Image>
                    <Text style={styles.textStyle}>+1</Text> 
                </View>
            </View> 
            <Image source={{uri:user.userCountryImageURL}}></Image>
            </View>
            <View style={styles.timeContainer}>
                <Text style={styles.timeText}>{
                time}</Text>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        padding:20,
        alignItems:'center'
    },
    avatar:{
        width:50,
        height:50
    },
    playerInfo:{
        display:'flex',
        flexDirection:'row',
        gap:10,
        
    },
    pieceContainer: {
        display:'flex',
        flexDirection:'row',
        alignItems:'center'
    },
    textStyle:{
        fontSize:16,
        fontWeight:700
    },
    timeText: {
        fontSize:20,
        color:'white',
        fontWeight:500
    },
    timeContainer: {
        width:103,
        height:36,
        backgroundColor:'#6B50F6', 
        alignItems:'center',
        justifyContent:'center',
        borderRadius:20
    }
})