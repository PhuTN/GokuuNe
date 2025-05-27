import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import ArrowCustomIcon from "../../../assets/icons/arrow_custom_icon.svg";
import LinearGradient from "react-native-linear-gradient";

interface ButtonProps {
    icon: React.ElementType;
    title: string;
    onPress: () => void;
}

const Button_Host_Time: React.FC<ButtonProps> = ({ icon: Icon, title, onPress }) => {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <LinearGradient
                colors={["#6B50F6", "#CC8FED"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.rowItem}
            >
                <Icon width={30} height={30} />
                <Text style={styles.cardItem}>{title}</Text>
                <ArrowCustomIcon width={30} height={30} />
            </LinearGradient>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button:{
        marginTop: "10%",
    },
    rowItem: {
        flexDirection: "row",
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "space-between",
        width: "90%",
        padding: 15,
        borderRadius: 10,
    },
    cardItem: {
        fontSize: 18,
        marginLeft: 10,
        fontWeight: "bold",
        color: "white"
    },
});

export default Button_Host_Time;
