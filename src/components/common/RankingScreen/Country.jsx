
import { Text, View, Image, StyleSheet } from "react-native";
import { useTheme } from "../../../asycnc_store/ThemeContext";


export default function Country({ user }) {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';
    const styles = isDark ? darkStyles : whiteStyles;
    return (
        <View style={styles.container}>
            <Image source={
                { uri: user.userCountryImageURL }
            } style={styles.image}></Image>
            <Text style={styles.text}>{user.country}</Text>
        </View>
    )
}
const whiteStyles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: "row",
        gap: '2%',
        alignItems: 'center'
    },
    text: {
        fontWeight: '800',
        fontSize: 20,
        color: 'black'
    },
    image: {
        width: 35,
        height: 25.28
    }
});
const darkStyles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: "row",
        gap: '2%',
        alignItems: 'center'
    },
    text: {
        fontWeight: '800',
        fontSize: 20,
        color: 'white'
    },
    image: {
        width: 35,
        height: 25.28
    }
})