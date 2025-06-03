import React, { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useLanguage } from '../asycnc_store/LanguageContext';
import { useTheme } from '../asycnc_store/ThemeContext';
import { translations } from '../untils/i18n';
import { notify } from '../untils/Notify';
import { useNotification } from '../asycnc_store/NotificationContext';
import { StyleSheet, Text, View } from 'react-native';
import Header from '../components/common/Header';

type Props = NativeStackScreenProps<RootStackParamList, 'AIMatch'>;

const AIMatchScreen = ({ route, navigation }: Props) => {
  const { language, toggleLanguage } = useLanguage();
  const t = translations[language];

  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const styles = isDark ? darkStyles : lightStyles;

  const { notification, toggleNotification } = useNotification();

  const [accountLogin, setAccountLogin] = useState(
    route.params?.accountLogin ?? null,
  );

  return (
    <View style={styles.container}>
      <Header title="AI MATCH" />
    </View>
  );
};

const lightStyles = StyleSheet.create({
  container: {
    backgroundColor: "#F5F5F5"
  }
});

const darkStyles = StyleSheet.create({
  container: {
    backgroundColor: '#535353'
  }
});

export default AIMatchScreen;
