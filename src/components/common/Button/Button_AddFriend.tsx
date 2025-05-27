import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import LinearGradient from "react-native-linear-gradient";

interface ButtonProps {
    Icon: React.FC<{ width: number; height: number }>;
    onPress: () => void;
}

const Button_AddFriend: React.FC<ButtonProps> = ({ Icon, onPress }) => {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <LinearGradient
                colors={["#6B50F6", "#CC8FED"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientButton}
            >
                <Icon width={20} height={20} />
            </LinearGradient>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        width: 30,
        height: 30,
        borderRadius: 5,
        overflow: "hidden",
        margin: 5,
        // Thêm hiệu ứng đổ bóng
        shadowColor: "#000", // Màu bóng (đen)
        shadowOffset: { width: 0, height: 4 }, // Độ lệch của bóng
        shadowOpacity: 0.3, // Độ mờ của bóng
        shadowRadius: 4, // Bán kính mờ của bóng
        elevation: 5, // Hiệu ứng bóng cho Android
    },
    gradientButton: {
        width: 30,
        height: 30,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
    },
});

export default Button_AddFriend;