import { Text,View,Image, StyleSheet } from "react-native";


export default function Country({user}){
   
    return (
        <View style={styles.container}>
            <Image source={
                {uri:user.userCountryImageURL}
            } style = {styles.image}></Image>
            <Text style={styles.text}>{user.country}</Text>
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
    },
    image: {
        width:35,
        height:25.28
    }
})