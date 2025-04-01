import { StyleSheet, Text,View } from "react-native";
import Country from "./Country";
export default function UserNameCountry({user}) {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>{user.userName}</Text> 
            <Country user={user}></Country>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        display:'flex',
        flexDirection:'column',
        gap:'10'
    },
    text:{
        fontSize:32,
        fontWeight:'800'
    }
})