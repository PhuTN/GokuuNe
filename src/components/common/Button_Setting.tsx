import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import ArrowIcon from "../../assets/icons/arrow_icon.svg";

interface ButtonProps {
  icon: React.ElementType;
  title: string;
  onPress: () => void;
}

const Button_Setting: React.FC<ButtonProps> = ({ icon: Icon, title, onPress }) => {
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

const styles = StyleSheet.create({
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

export default Button_Setting;
