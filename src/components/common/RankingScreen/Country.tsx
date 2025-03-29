import { Text,View,Image, StyleSheet } from "react-native";


export default function Country(){
    const flagImage = require("../../../assets/images/Vietnam.png");
    return (
        <View style={styles.container}>
            <Image source={flagImage}></Image>
            <Text style={styles.text}>Vietnam</Text>
        </View>
    )
}
const styles = StyleSheet.create( {
    container:{
        display:'flex',
        flexDirection:"row",
        gap:'2%',
        alignItems:'center'
    },
    text:{
        fontWeight:'800',
        fontSize:20
    }
})