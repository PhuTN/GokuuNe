import React from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import LinearGradient from "react-native-linear-gradient";

interface ButtonProps {
  title?: string;
  Icon: React.FC<{ width: number; height: number }>;
  onPress: () => void;
  isIconOnly?: boolean;
  badgeCount?: number; // ✅ Thêm prop mới
}

const Button_Home: React.FC<ButtonProps> = ({
  title,
  Icon,
  onPress,
  isIconOnly = false,
  badgeCount = 0,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, isIconOnly && styles.iconButton]}
      onPress={onPress}
    >
      <LinearGradient
        colors={["#6B50F6", "#CC8FED"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradientButton, isIconOnly && styles.iconGradient]}
      >
        <View style={[styles.buttonContent, isIconOnly && styles.iconOnlyContent]}>
          {/* Khi có text */}
          {!isIconOnly && (
            <View style={styles.textContainer}>
              <Text style={styles.buttonText}>{title}</Text>
            </View>
          )}

          {/* Icon */}
          <View style={[styles.iconContainer, isIconOnly && styles.iconCenter]}>
            <Icon width={30} height={30} />

            {/* ✅ Badge nếu isIconOnly và có badgeCount > 0 */}
            {isIconOnly && badgeCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{badgeCount}</Text>
              </View>
            )}
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
    marginVertical: "5%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  iconButton: {
    width: 50,
    height: 50,
  },
  gradientButton: {
    width: "100%",
    padding: 15,
    alignItems: "center",
    borderRadius: 10,
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

  // ✅ Badge style
  badge: {
    position: "absolute",
    top: -10,
    right: -3,
    backgroundColor: "red",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  badgeText: {
    color: "white",
    fontSize: 11,
    fontWeight: "bold",
  },
});

export default Button_Home;
