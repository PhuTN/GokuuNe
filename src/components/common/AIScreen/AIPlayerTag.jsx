import React from "react"; 
import { StyleSheet, Text,View,Image } from "react-native";
import { useTheme } from "../../../asycnc_store/ThemeContext";
export default function AIPlayerTag({playerName, avatar}) {
    const {theme,toggleTheme} = useTheme();
    const isDark = theme==='dark';
    const styles = isDark?blackStyle:whiteStyle;
    return <View style={styles.containter}>
        <Image style={styles.image} source={{uri:avatar}}></Image> 
        <Text style={styles.text}>{playerName}</Text>
    </View>
}
const whiteStyle =StyleSheet.create({
    containter: {
        display:'flex',
        marginTop:10,
        flexDirection:'column',
         alignSelf:'center',
         justifyContent:'center', 
         alignItems:'center'
    }, 
    image: {
        width:60,
        height:60,
        borderRadius:10
    }
    ,
    text:{
        color:'black',
        fontSize:20,
        fontWeight:'bold',
        textAlign:'center'
    }
});
const blackStyle =StyleSheet.create({
    containter: {
        display:'flex',
        flexDirection:'column', 
        marginTop:10,
        alignSelf:'center', 
        marginBottom:10
    }, 
    image: {
        width:60,
        height:60,
        borderRadius:10
    }
    ,
    text:{
        color:'white',
        fontSize:20,
        fontWeight:'bold',
        textAlign:'center'
    }
})