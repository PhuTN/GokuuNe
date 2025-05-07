// src/components/Header.tsx

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BackIcon from '../../assets/icons/back_icon.svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
interface HeaderProps {
  title: string;
  showBack?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, showBack = true }) => {
  const navigation = useNavigation();

  return (
    <>

      {/* Elip nền */}
      <View style={[styles.ellipseBackground, { height: Platform.OS === 'ios' ? 510 : 480 }]} />

      {/* Header */}
      <View style={[styles.container, { paddingVertical: Platform.OS === 'ios' ? 40 : 20 }]}>
        {showBack && (
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <BackIcon width={35} height={35} />
          </TouchableOpacity>
        )}
        <Text style={styles.title}>{title}</Text>
      </View>

    </>
  );
};

const styles = StyleSheet.create({

  ellipseBackground: {
    position: 'absolute',
    top: -400,
    width: '270%',
    height: 480,
    borderBottomLeftRadius: 1000,
    borderBottomRightRadius: 1000,
    backgroundColor: 'rgba(188, 44, 255, 0.5)',
    alignSelf: 'center',
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",

    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 16,
  },
  title: {
    fontSize: 35,
    fontWeight: "bold",
    color: "#FFC107",
    textAlign: "center",
  },
});

export default Header;
