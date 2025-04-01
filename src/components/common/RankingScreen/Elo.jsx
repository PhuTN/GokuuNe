import { Text,View,Image, StyleSheet } from "react-native"; 
export default function Elo({user}) {
    const matches=require('../../../assets/images/Elo.png');
    return (<View style={styles.container}>
        <Image source ={matches}></Image> 
        <View>
        <Text style={styles.matchText}>ELO</Text> 
        <Text style={styles.numberText}>{user.elo}</Text>
        </View>
    </View>
        
    )

}
const styles = StyleSheet.create( {
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

})