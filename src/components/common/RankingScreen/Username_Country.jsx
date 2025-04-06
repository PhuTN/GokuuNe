import { StyleSheet, Text,View } from "react-native";
import Country from "./Country";
import { useTheme } from "@react-navigation/native";
export default function UserNameCountry({user}) {
    const {theme,toggleTheme} = useTheme();
    const isDark=theme==='dark';
    const styles=isDark?whiteStyles:darkStyles;
    return (
        <View style={styles.container}>
            <Text style={styles.text}>{user.userName}</Text> 
            <Country user={user}></Country>
        </View>
    )
}
const whiteStyles = StyleSheet.create({
    container: {
        display:'flex',
        flexDirection:'column',
        gap:'10'
    },
    text:{
        fontSize:32,
        fontWeight:'800',
        color:'black'
    }
});
const darkStyles = StyleSheet.create({
    container: {
        display:'flex',
        flexDirection:'column',
        gap:'10'
    },
    text:{
        fontSize:32,
        fontWeight:'800',
        color:'white'
    }
});