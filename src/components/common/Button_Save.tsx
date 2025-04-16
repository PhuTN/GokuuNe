import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import LinearGradient from "react-native-linear-gradient";

interface ButtonProps {
  onPress: () => void;
  text: string;
}

const Button_Save: React.FC<ButtonProps> = ({ onPress, text }) => {
  return (
    <TouchableOpacity
      style={styles.saveButtonContainer}
      onPress={onPress}
    >
      <LinearGradient
        colors={["#6B50F6", "#CC8FED"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.saveButton}
      >
        <Text style={styles.saveButtonText}>{text}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  saveButtonContainer: {
    marginTop: 20,
    marginBottom: 30,
    borderRadius: 10,
    alignSelf: 'center',
    width: "90%",
    shadowColor: "#6B50F6",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  saveButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Button_Save;