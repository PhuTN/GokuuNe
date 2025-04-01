import React, { useEffect, useState } from "react";
import { View, Text, Image, Switch, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Card } from "react-native-paper";
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import ProfileIcon from '../assets/icons/profile_icon.svg';
import BackIcon from '../assets/icons/back_icon.svg';
import AchievementIcon from '../assets/icons/achievement_icon.svg';
import MatchHistoryIcon from '../assets/icons/history_icon.svg';
import LanguageIcon from '../assets/icons/language_icon.svg';
import ThemeIcon from '../assets/icons/theme_icon.svg';
import NotificationIcon from '../assets/icons/notification_icon.svg';
import ContactIcon from '../assets/icons/contact_icon.svg';
import PrivacyIcon from '../assets/icons/privacy_icon.svg';
import Button_Setting from "../components/common/Button_Setting";


type Props = NativeStackScreenProps<RootStackParamList, 'Setting'>;

const SettingScreen = ({ route, navigation }: Props) => {
  const [accountLogin, setAccountLogin] = useState(route.params?.accountLogin ?? null);

  useEffect(() => {
    setAccountLogin(route.params?.accountLogin ?? null);
  }, [route.params]);

  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isNotificationOn, setIsNotificationOn] = useState(true);
  const [language, setLanguage] = useState("Vie");

  const handleProfile = () => {
    navigation.navigate('Profile', { accountLogin });
  };

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={{ flexGrow: 1, alignItems: "center" }}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <BackIcon width={45} height={45} />
        </TouchableOpacity>
        <Text style={styles.headerText}>SETTING</Text>
      </View>

      <View style={styles.profileContainer}>
        <Image source={accountLogin?.avatar || require('../assets/images/user.png')} style={styles.avatar} />
        <Text style={styles.username}>{accountLogin?.username || 'Guest'}</Text>
      </View>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Account</Text>
        <Button_Setting icon={ProfileIcon} title="Profile" onPress={handleProfile} />
        <Button_Setting icon={AchievementIcon} title="Achievement" onPress={() => { }} />
        <Button_Setting icon={MatchHistoryIcon} title="Match History" onPress={() => { }} />
      </Card>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>App</Text>
        <View style={styles.rowItem}>
          <View style={styles.rowContent}>
            <LanguageIcon width={30} height={30} />
            <Text style={styles.cardItem}>Language</Text>
          </View>
          <Switch value={language === "Vie"} onValueChange={() => setLanguage(language === "Vie" ? "Eng" : "Vie")} />
        </View>
        <View style={styles.rowItem}>
          <View style={styles.rowContent}>
            <ThemeIcon width={30} height={30} />
            <Text style={styles.cardItem}>Theme</Text>
          </View>
          <Switch value={isDarkTheme} onValueChange={setIsDarkTheme} />
        </View>
        <View style={styles.rowItem}>
          <View style={styles.rowContent}>
            <NotificationIcon width={30} height={30} />
            <Text style={styles.cardItem}>Pop-up Notification</Text>
          </View>
          <Switch value={isNotificationOn} onValueChange={setIsNotificationOn} />
        </View>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Other</Text>
        <Button_Setting icon={ContactIcon} title="Contact Us" onPress={() => { }} />
        <Button_Setting icon={PrivacyIcon} title="Privacy Policy" onPress={() => { }} />
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingVertical: 10,
    position: "relative",
  }, 
  backButton: {
    position: "absolute",
    left: 16,
  }, 
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFC107",
    textAlign: "center",
  },
  profileContainer: {
    alignItems: "center",
    marginTop: 50,
    marginBottom: 20
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 150
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 15
  },
  card: {
    width: '90%',
    padding: 15,
    marginBottom: 20,
    borderRadius: 10
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10
  },
  cardItem: {
    fontSize: 16,
    marginLeft: 10
  },
  rowItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10
  },
  rowContent: {
    flexDirection: "row",
    alignItems: "center"
  }
});

export default SettingScreen;
