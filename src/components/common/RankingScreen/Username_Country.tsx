import { StyleSheet, Text,View } from "react-native";
import Country from "./Country";
export default function UserNameCountry() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Ngoc Kem</Text> 
            <Country></Country>
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