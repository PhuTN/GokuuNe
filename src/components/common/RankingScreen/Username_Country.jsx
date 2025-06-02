import { StyleSheet, Text,View } from "react-native";
import Country from "./Country";
import { useTheme } from "../../../asycnc_store/ThemeContext";
function displayUserName(user) {
    if(user.length>10) {
        user = user.substring(0,7);
        user=user+"..."
    }
    return user;
}
export default function UserNameCountry({user}) {
    const {theme,toggleTheme} = useTheme();
    const isDark=theme==='dark';
    const styles=isDark?darkStyles:whiteStyles;
    if (!user) return null; // hoặc <Text>Đang tải...</Text>

return (
  <View style={styles.container}>

    <Text style={styles.text}>{displayUserName(user.userName)}</Text>

    {/* <Country user={user}></Country> */}
  </View>
);
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