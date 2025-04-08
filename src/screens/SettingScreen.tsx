import React, { useEffect, useState } from "react";
import { View, Text, Image, Switch, StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native";
import { Card } from "react-native-paper";
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import ProfileIcon from '../assets/icons/profile_icon.svg';
import AchievementIcon from '../assets/icons/achievement_icon.svg';
import MatchHistoryIcon from '../assets/icons/history_icon.svg';
import LanguageIcon from '../assets/icons/language_icon.svg';
import ThemeIcon from '../assets/icons/theme_icon.svg';
import NotificationIcon from '../assets/icons/notification_icon.svg';
import ContactIcon from '../assets/icons/contact_icon.svg';
import PrivacyIcon from '../assets/icons/privacy_icon.svg';
import Button_Setting from "../components/common/Button_Setting";
import Header from '../components/common/Header';
import CountryFlag from 'react-native-country-flag';
import countries from 'world-countries';
import ToggleButtonLanguage from "../components/common/ToggleButton_Language";
import ToggleButtonTheme from "../components/common/ToggleButton_Theme";
import ToggleButtonNotification from "../components/common/ToggleButton_Notification";
import LigthTheme from '../assets/icons/light_theme_icon.svg';
import DarkTheme from '../assets/icons/dark_theme_icon.svg';
import { useLanguage } from "../asycnc_store/LanguageContext";
import { useTheme } from "../asycnc_store/ThemeContext";
import { translations } from "../untils/i18n";

type Props = NativeStackScreenProps<RootStackParamList, 'Setting'>;

// Ánh xạ từ tên quốc gia sang mã ISO
const countryMap: Record<string, string> = countries.reduce((map, country) => {
  map[country.name.common] = country.cca2;
  return map;
}, {} as Record<string, string>);

const SettingScreen = ({ route, navigation }: Props) => {
  const [accountLogin, setAccountLogin] = useState(route.params?.accountLogin ?? null);
  const { language, toggleLanguage } = useLanguage();
  const t = translations[language];

  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const styles = isDark ? darkStyles : lightStyles;

  const [isNotificationOn, setIsNotificationOn] = useState(true); // mặc định có bật

  useEffect(() => {
    setAccountLogin(route.params?.accountLogin ?? null);
  }, [route.params]);

  // Lấy mã ISO từ tên quốc gia
  const countryCode = accountLogin?.country ? countryMap[accountLogin.country] || 'VN' : 'VN'; // Default là 'VN' nếu không tìm thấy

  const handleProfile = () => {
    if (accountLogin) {
      navigation.navigate('Profile', { accountLogin });
    } else {
      Alert.alert(t.setting_profile_noti, t.setting_profile_message);
    }
  };

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={{ flexGrow: 1, alignItems: "center" }}
    >
      <Header title={t.setting} />

      <View style={styles.profileContainer}>
        <Image source={accountLogin?.avatar || require('../images/user.png')} style={styles.avatar} />
        <View style={styles.usernameContainer}>
          <Text style={styles.username}>{accountLogin?.username || t.setting_guest}</Text>
          {accountLogin?.country && (
            <CountryFlag isoCode={countryCode} size={30} style={styles.flag} />
          )}
        </View>
      </View>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>{t.setting_account}</Text>
        <Button_Setting icon={ProfileIcon} title={t.setting_profile} onPress={handleProfile} />
        <Button_Setting icon={AchievementIcon} title={t.setting_achievement} onPress={() => { }} />
        <Button_Setting icon={MatchHistoryIcon} title={t.setting_match_history} onPress={() => { }} />
      </Card>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>{t.setting_app}</Text>
        <View style={styles.rowItem}>
          <View style={styles.rowContent}>
            <LanguageIcon width={30} height={30} />
            <Text style={styles.cardItem}>{t.setting_language}</Text>
          </View>
          <ToggleButtonLanguage
            value={language === 'en'}
            titleLeft="Vie"
            titleRight="Eng"
            onToggle={toggleLanguage}
          />
        </View>

        <View style={styles.rowItem}>
          <View style={styles.rowContent}>
            <ThemeIcon width={30} height={30} />
            <Text style={styles.cardItem}>{t.setting_theme}</Text>
          </View>
          <ToggleButtonTheme
            value={isDark}
            onToggle={toggleTheme}
          />
        </View>

        <View style={styles.rowItem}>
          <View style={styles.rowContent}>
            <NotificationIcon width={30} height={30} />
            <Text style={styles.cardItem}>{t.setting_popup}</Text>
          </View>
          <ToggleButtonNotification
            value={isNotificationOn}
            onToggle={() => setIsNotificationOn(prev => !prev)} />
        </View>

      </Card>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>{t.setting_other}</Text>
        <Button_Setting icon={ContactIcon} title={t.setting_contact} onPress={() => { }} />
        <Button_Setting icon={PrivacyIcon} title={t.setting_privacy} onPress={() => { }} />
      </Card>
    </ScrollView>
  );
};

const lightStyles = StyleSheet.create({
  scrollView: {
    flex: 1
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
  usernameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },
  username: {
    fontSize: 30,
    fontWeight: "bold",
  },
  flag: {
    marginLeft: 10,
    borderRadius: 5
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

const darkStyles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#535353"
  },
  profileContainer: {
    alignItems: "center",
    marginTop: 50,
    marginBottom: 20,
    backgroundColor: "#535353"
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 150
  },
  usernameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    backgroundColor: "#535353"
  },
  username: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#FFFFFF"
  },
  flag: {
    marginLeft: 10,
    borderRadius: 5
  },
  card: {
    width: '90%',
    padding: 15,
    marginBottom: 20,
    borderRadius: 10,
    borderColor: "#FFFFFF",
    borderWidth: 1,
    backgroundColor: "#535353"
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#FFFFFF"
  },
  cardItem: {
    fontSize: 16,
    marginLeft: 10,
    color: "#FFFFFF"
  },
  rowItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10
  },
  rowContent: {
    flexDirection: "row",
    alignItems: "center",
  }
});

export default SettingScreen;
