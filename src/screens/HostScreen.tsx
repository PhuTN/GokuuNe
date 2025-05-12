
import React, { useState } from "react";
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useLanguage } from "../asycnc_store/LanguageContext";
import { useTheme } from "../asycnc_store/ThemeContext";
import { translations } from "../untils/i18n";
import { notify } from '../untils/notify';
import { useNotification } from '../asycnc_store/NotificationContext';
import { StyleSheet, Text, View } from "react-native";
import Header from '../components/common/Header';

type Props = NativeStackScreenProps<RootStackParamList, 'Host'>;

const HostScreen = ({ route, navigation }: Props) => {
    const { language, toggleLanguage } = useLanguage();
    const t = translations[language];

    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';
    const styles = isDark ? darkStyles : lightStyles;

    const { notification, toggleNotification } = useNotification();

    const [accountLogin, setAccountLogin] = useState(route.params?.accountLogin ?? null);

    return (
        <View>
            <Header title={t.host} />
        </View>
    );
};

const lightStyles = StyleSheet.create({

});

const darkStyles = StyleSheet.create({

});

export default HostScreen;