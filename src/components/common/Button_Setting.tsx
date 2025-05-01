import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import ArrowIcon from "../../assets/icons/arrow_icon.svg";
import { useTheme } from "../../asycnc_store/ThemeContext";

interface ButtonProps {
  icon: React.ElementType;
  title: string;
  onPress: () => void;
}

const Button_Setting: React.FC<ButtonProps> = ({ icon: Icon, title, onPress }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const styles = isDark ? darkStyles : lightStyles;

  return (
    <TouchableOpacity style={styles.rowItem} onPress={onPress}>
      <View style={styles.rowContent}>
        <Icon width={30} height={30} />
        <Text style={styles.cardItem}>{title}</Text>
      </View>
      <ArrowIcon width={30} height={30} />
    </TouchableOpacity>
  );
};

const lightStyles = StyleSheet.create({
  rowItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  rowContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardItem: {
    fontSize: 16,
    marginLeft: 10,
  },
});

const darkStyles = StyleSheet.create({
  rowItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  rowContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardItem: {
    fontSize: 16,
    marginLeft: 10,
    color: "#FFFFFF"
  },
});

export default Button_Setting;
