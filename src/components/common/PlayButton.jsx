import { StyleSheet, Text, TouchableOpacity } from "react-native";
export default function PlayButton({navigation}) {
    return (
        <TouchableOpacity style={style.playButton} onPress={(e)=>{
            e.preventDefault();
            navigation.navigate("RankingMatch");
        }}>
            <Text style={style.playButtonText}>Play</Text>
        </TouchableOpacity>
    )
}
const style=StyleSheet.create( {
    playButton: {
        width:315,
        height:60,
        alignItems:'center',
        justifyContent:'center',
        alignSelf:'center',
        marginTop:50,
        backgroundColor:"#6B50F6",
        borderColor:'black',
        borderWidth:1,
        borderRadius:10

    },
    playButtonText: {
        fontSize:32,
        fontWeight:700,
        color:'white'
    }
})