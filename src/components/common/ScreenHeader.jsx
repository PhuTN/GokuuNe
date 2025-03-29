import { StyleSheet, Text,View ,Image} from "react-native"; 
export default function ScreenHeader({screenName}) { 
    const backIcon= require("../../assets/images/backIcon.png");
    return <View style={styles.container}>
        <View  style={styles.header_backButton}>
        <Image style={styles.backIcon} source={backIcon}></Image>
        <Text style={styles.text}>{screenName}</Text> 
        </View>
    </View>
}
const styles =StyleSheet.create({
    container: {
       
        height:195,
        width:500,
        alignSelf:'center',
        backgroundColor:"#BC2CFF80",
        borderBottomRightRadius:650,
        borderBottomLeftRadius:650,
        marginBottom:20,
        position:'absoulte',
        display:'flex',
        top:-100,
        
        
    },
    text:{
        fontSize:36,
        alignSelf:'center',
        fontWeight:700,
        marginLeft:55,
        color:'#FFCF26'
    },
    header_backButton:{
        position:'absolute',
        bottom:30,
        alignSelf:'center',
        display:'flex',
        flexDirection:'row',
        
        width:300
    },
    backIcon:{
        alignSelf:'flex-start'
        
    },
    
});