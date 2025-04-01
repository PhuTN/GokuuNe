import { useEffect, useState } from "react";
import React = require("react");
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { SafeAreaView } from "react-native-safe-area-context";
import LinearGradient from 'react-native-linear-gradient';
import Button_Home from '../components/common/Button_Home';
import RankingIcon from '../assets/icons/ranking_icon.svg';
import AIIcon from '../assets/icons/AI_icon.svg';
import FriendsIcon from '../assets/icons/friends_icon.svg';
import HostIcon from '../assets/icons/host_icon.svg';
import ChatIcon from '../assets/icons/chat_icon.svg';
import SettingIcon from '../assets/icons/setting_icon.svg';
import LoginIcon from '../assets/icons/login_icon.svg';
import LogoutIcon from '../assets/icons/logout_icon.svg';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen = ({ route, navigation }: Props) => {
  const [accountLogin, setAccountLogin] = useState(route.params?.accountLogin ?? null);

  useEffect(() => {
    setAccountLogin(route.params?.accountLogin ?? null);
  }, [route.params]);

  // const handleRank = () => {
  //   navigation.navigate('Ranking');
  // };

  // const handleChat = () => {
  //   navigation.navigate('Chat');
  // };

  const handleSetting = () => {
    navigation.navigate('Setting', { accountLogin });
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home', params: { accountLogin: null } }],
    });
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ flexGrow: 1, alignItems: "center" }}
      >
        {/* Header - Avatar + Name */}
        <View style={styles.header}>
          <LinearGradient
            colors={['#6B50F6', '#BC2CFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.profileGradient}
          >
            <View style={styles.profileContainer}>
              <Image source={accountLogin?.avatar || require('../assets/images/user.png')} style={styles.avatar} />
              <Text style={styles.username}>{accountLogin?.name || 'Guest'}</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Title */}
        <Text style={styles.title}>GOKUU</Text>

        {/* Menu Buttons */}
        <View style={styles.buttonGroup}>
          <Button_Home title="RANKING" Icon={RankingIcon} onPress={() => {}} />
          <Button_Home title="AI" Icon={AIIcon} onPress={() => {}} />
          <Button_Home title="FRIEND" Icon={FriendsIcon} onPress={() => {}} />
          <Button_Home title="HOST" Icon={HostIcon} onPress={() => {}} />
        </View>

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <Button_Home Icon={ChatIcon} onPress={() => {}} isIconOnly />
          <Button_Home Icon={SettingIcon} onPress={handleSetting} isIconOnly />
          {accountLogin ? (
            <Button_Home Icon={LogoutIcon} onPress={handleLogout} isIconOnly />
          ) : (
            <Button_Home Icon={LoginIcon} onPress={handleLogin} isIconOnly />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    position: "absolute",
    top: 0,
    right: -7,
  },
  profileGradient: {
    borderRadius: 20,
    padding: 8,
  },
  profileContainer: {
    flexDirection: "column",
    alignItems: "center",
    borderRadius: 20,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  username: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
    marginTop: 8,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#FFCF26",
    marginTop: 100,
  },
  buttonGroup: {
    width: "80%",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "center",
    gap: "10%",
    marginTop: 20,
  },
});

export default HomeScreen;