import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";

interface ButtonProps {
  Icon: React.FC<{ width: number; height: number }>;
  onPress: () => void;
  color?: string;
  colors?: [string, string];
}

const Button_AIChallenge_Chess_Piece: React.FC<ButtonProps> = ({ Icon, onPress, color, colors }) => {
  const isSplit = colors && colors.length === 2;
  const singleColor = color ?? "#6B50F6";

  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      {isSplit ? (
        <View style={styles.splitWrapper}>
          <View style={[styles.half, { backgroundColor: colors[0] }]} />
          <View style={[styles.half, { backgroundColor: colors[1] }]} />
          <View style={styles.iconContainer}>
            <Icon width={50} height={50} />
          </View>
        </View>
      ) : (
        <View style={[styles.gradientButton, { backgroundColor: singleColor }]}>
          <Icon width={50} height={50} />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 60,
    height: 60,
    borderRadius: 5,
    overflow: "hidden",
    margin: 5,
    marginHorizontal: "6%",
    // Thêm hiệu ứng đổ bóng
    shadowColor: "#000", // Màu bóng (đen)
    shadowOffset: { width: 0, height: 4 }, // Độ lệch của bóng
    shadowOpacity: 0.3, // Độ mờ của bóng
    shadowRadius: 4, // Bán kính mờ của bóng
    elevation: 5, // Hiệu ứng bóng cho Android
  },
  gradientButton: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  splitWrapper: {
    flexDirection: "row",
    width: "100%",
    height: "100%",
    position: "relative",
  },
  half: {
    flex: 1,
  },
  iconContainer: {
    ...StyleSheet.absoluteFillObject,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    pointerEvents: "none",
  },
});

export default Button_AIChallenge_Chess_Piece;