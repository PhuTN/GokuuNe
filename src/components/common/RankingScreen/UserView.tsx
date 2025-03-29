import { StyleSheet, Text,View } from "react-native";
import UserInfo from "./UserInfo";
import Matches from "./Matches";
import Elo from "./Elo";
export default function UserView() {
    return (
        <View style={styles.container}>
            <UserInfo></UserInfo>
            <View style={styles.match_elo}>
                <Matches></Matches> 
                <Elo></Elo>
            </View>
        </View>
    )
}
const styles = StyleSheet.create( {
    container:{
        width:315,
        height:232,
        backgroundColor:'#ebdcfd',
        borderRadius:20,
        alignSelf:'center',
        display:'flex',
        flexDirection:'column',
        paddingLeft:20,
        gap:50,
        paddingTop:10
    },
    match_elo: {
        display:'flex',
        flexDirection:'row',
        gap:20
    }
})