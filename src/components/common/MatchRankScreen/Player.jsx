import {Text,View,Image, StyleSheet, TouchableOpacity, useWindowDimensions} from 'react-native';
import { isWhite } from './ChessBoard';
import { useTheme } from '../../../asycnc_store/ThemeContext';
export default  function Player({user,isWhite,time,score}) { 
    const avatar = require('../../../assets/images/Top1.png');
    const piectBlack=require('../../../assets/images/pieceBlack.png');
    const pieceWhite = require("../../../assets/images/pieceWhite.png");
    const flag=require('../../../assets/images/Vietnam.png');
    const {theme,toggleTheme} = useTheme();
    const isDark=theme==='dark';
    const styles = isDark?darkStyles:whiteStyles;
    const {height} = useWindowDimensions();
    const heightStyle = {
        marginBottom:isWhite?(height-688)/4:0
    }
    return (
        
        <View style={[styles.container,heightStyle]}>
            <View style={styles.playerInfo}>
<Image
  style={styles.avatar}
  source={
    user?.userAvatarURL?.uri
      ? { uri: user.userAvatarURL.uri }
      : require('../../../images/user.png')
  }
/>


            <View  >
                <Text style={styles.textStyle}>{user.userName} ({user.elo})</Text> 
                <View style={styles.pieceContainer}>
                    <Image source={isWhite?pieceWhite:piectBlack}></Image>
                    <Text style={styles.textStyle}>+{score}</Text> 
                </View>
            </View> 
         
            </View>
            <View style={styles.timeContainer}>
                <Text style={styles.timeText}>{
                time}</Text>
            </View>
            
        </View>
    );
}
const whiteStyles = StyleSheet.create({
    container:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        padding:20,
        alignItems:'center',
        
    },
    avatar:{
        width:40,
        height:40,borderRadius: 50, // Half of width/height for a perfect circle
        borderWidth: 3, // Thickness of the border
        borderColor: '#6B50F6'
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
        fontWeight:700,
        color:'black'
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
    },
    flagImage: {
        width:35,
        height:25.28
    }
});
const darkStyles = StyleSheet.create({
    container:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        padding:20,
        alignItems:'center'
    },
    avatar:{
        width:50,
        height:50,borderRadius: 50, // Half of width/height for a perfect circle
        borderWidth: 3, // Thickness of the border
        borderColor: '#6B50F6'
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
        fontWeight:700,
        color:'white'
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
    },
    flagImage: {
        width:35,
        height:25.28
    }
});