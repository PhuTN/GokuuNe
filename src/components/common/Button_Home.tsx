import React from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import LinearGradient from "react-native-linear-gradient";

interface ButtonProps {
  title?: string;
  Icon: React.FC<{ width: number; height: number }>;
  onPress: () => void;
  isIconOnly?: boolean;
}

const Button_Home: React.FC<ButtonProps> = ({ title, Icon, onPress, isIconOnly = false }) => {
  return (
    <TouchableOpacity style={[styles.button, isIconOnly && styles.iconButton]} onPress={onPress}>
      <LinearGradient
        colors={["#6B50F6", "#CC8FED"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradientButton, isIconOnly && styles.iconGradient]}
      >
        <View style={[styles.buttonContent, isIconOnly && styles.iconOnlyContent]}>
          {/* Khi có text, giữ text giữa button */}
          {!isIconOnly && (
            <View style={styles.textContainer}>
              <Text style={styles.buttonText}>{title}</Text>
            </View>
          )}
          {/* Icon nằm giữa nếu isIconOnly = true, nằm phải nếu có text */}
          <View style={[styles.iconContainer, isIconOnly && styles.iconCenter]}>
            <Icon width={30} height={30} />
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "100%",
    borderRadius: 10,
    overflow: "hidden",
    marginVertical: 10,
  },
  iconButton: {
    width: 50,
    height: 50,
  },
  gradientButton: {
    width: "100%",
    padding: 15,
    alignItems: "center",
    borderRadius: 10
  },
  iconGradient: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    position: "relative",
  },
  textContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    width: 40,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: 10,
  },
  iconOnlyContent: {
    justifyContent: "center",
  },
  iconCenter: {
    position: "relative",
    right: "auto",
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
});

export default Button_Home;
