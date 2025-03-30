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
       
       
        height:80,
        
        
        
        marginBottom:20,
        borderBottomLeftRadius:30,
        borderBottomRightRadius:30,
        display:'flex',
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        
        backgroundColor:'#BC2CFF80'
        
        
        
    },
    text:{
        fontSize:36,
        alignSelf:'center',
        fontWeight:700,
        marginLeft:85,
        color:'#FFCF26'
    },
    header_backButton:{
        
        alignSelf:'center',
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        paddingTop:10,
        width:'100%',

        paddingHorizontal:20,
        
        
    },
    backIcon:{
        alignSelf:'flex-start'
        
    },
    
});