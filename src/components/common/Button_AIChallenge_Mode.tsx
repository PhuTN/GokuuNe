import React from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import LinearGradient from "react-native-linear-gradient";

interface ButtonProps {
  title: string;
  subtitle: string;
  Icon1: React.FC<{ width: number; height: number }>;
  Icon2: React.FC<{ width: number; height: number }>;
  Icon3: React.FC<{ width: number; height: number }>;
  onPress: () => void;
  isSelected?: boolean;
}

const Button_AIChallenge_Mode: React.FC<ButtonProps> = ({ title, subtitle, Icon1, Icon2, Icon3, onPress, isSelected }) => {
  return (
    <TouchableOpacity
    style={[
      styles.button,
      isSelected && { borderColor: "#FFCF26", borderWidth: 5 ,borderRadius: 15 } // nếu isSelected = true, thêm style viền vào
    ]}
    onPress={onPress}
    >
      <LinearGradient
        colors={["#6B50F6", "#CC8FED"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientButton}
      >
        <View style={styles.buttonContent}>
          {/* Dòng trên: Title + Icon */}
          <View style={styles.topRow}>
            <Text style={styles.buttonText}>{title}</Text>
            <View style={styles.buttonIcon}>
              <View style={styles.icon}><Icon1 width={24} height={24} /></View>
              <View style={styles.icon}><Icon2 width={24} height={24} /></View>
              <View style={styles.icon}><Icon3 width={24} height={24} /></View>
            </View>
          </View>

          {/* Dòng dưới: Subtitle */}
          {/* <Text style={styles.subtitle}>{subtitle}</Text> */}
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
    // Thêm hiệu ứng đổ bóng
    shadowColor: "#000", // Màu bóng (đen)
    shadowOffset: { width: 0, height: 4 }, // Độ lệch của bóng
    shadowOpacity: 0.3, // Độ mờ của bóng
    shadowRadius: 4, // Bán kính mờ của bóng
    elevation: 5, // Hiệu ứng bóng cho Android
  },
  gradientButton: {
    width: "100%",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonContent: {
    flexDirection: "column",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  buttonIcon: {
    flexDirection: 'row',
  },
  icon: {
    marginHorizontal: 5
  },
  subtitle: {
    fontSize: 14,
    color: "#EEE",
  },
});

export default Button_AIChallenge_Mode;
