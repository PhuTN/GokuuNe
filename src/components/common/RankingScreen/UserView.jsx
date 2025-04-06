import { StyleSheet, Text,View } from "react-native";
import UserInfo from "./UserInfo";
import Matches from "./Matches";
import Elo from "./Elo";
import LinearGradient from "react-native-linear-gradient";
import { useTheme } from "@react-navigation/native";
export default function UserView({user}) {
    const {theme,toggleTheme} = useTheme();
    const isDark=theme==='dark';
    const gradient = isDark?['#6B50F699','white']:['#6B50F6', '#C150F6'];
    return (
        <View
         style={styles.container}>
            <LinearGradient  
                colors={['#6B50F6', '#C150F6']} // Colors for gradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }} 
                style={styles.lineargradient}
            >
            <UserInfo user={user}></UserInfo>
            <View style={styles.match_elo}>
                <Matches user={user}></Matches> 
                <Elo user={user}></Elo>
            </View>
            </LinearGradient>
        </View>
    )
}
const styles = StyleSheet.create( {
    container:{
        width:315,
        height:232,
        alignSelf:'center'
        
        
    },
    lineargradient:{
        width:'100%',
        height:'100%',
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
});
