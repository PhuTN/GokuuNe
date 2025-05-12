import { View, Image, StyleSheet } from "react-native";
const num = [60, 66, 72, 174, 180, 186, 288, 294, 300];
const dotImg = require("../../../assets/images/dot.png");
export default function Dot({ index }) {
    return (
        <View style={styles.container}>
            {
                num.includes(index) ? <Image source={dotImg} style={
                    styles.image
                }></Image> : <View></View>
            }
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        width: 10,
        height: 10
    }
})