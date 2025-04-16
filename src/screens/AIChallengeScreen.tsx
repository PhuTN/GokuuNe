import { useEffect, useState } from "react";
import React from "react";
import { View, Text, Image, StyleSheet, ScrollView, Alert, TouchableOpacity } from "react-native";
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useLanguage } from "../asycnc_store/LanguageContext";
import { useTheme } from "../asycnc_store/ThemeContext";
import { translations } from "../untils/i18n";
import Header from "../components/common/Header";
import Button_AIChallenge_Mode from "../components/common/Button_AIChallenge_Mode";
import Button_AIChallenge_Chess_Piece from "../components/common/Button_AIChallenge_Chess_Piece";
import CrownLightIcon from '../assets/icons/crown_light_icon.svg';
import CrownBlackIcon from '../assets/icons/crown_black_icon.svg';
import BlackArmyIcon from '../assets/icons/black_army_icon.svg';
import WhiteArmyIcon from '../assets/icons/white_army_icon.svg';
import RandomIcon from '../assets/icons/random_icon.svg';
import countries from 'world-countries';
import CountryFlag from 'react-native-country-flag';
import Button_Save from "../components/common/Button_Save";

type Props = NativeStackScreenProps<RootStackParamList, 'AIChallenge'>;

// Ánh xạ từ tên quốc gia sang mã ISO
const countryMap: Record<string, string> = countries.reduce((map, country) => {
    map[country.name.common] = country.cca2;
    return map;
}, {} as Record<string, string>);

const AIChallengeScreen = ({ route, navigation }: Props) => {
    const { language, toggleLanguage } = useLanguage();
    const t = translations[language];

    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';
    const styles = isDark ? darkStyles : lightStyles;

    const [accountLogin, setAccountLogin] = useState(route.params?.accountLogin ?? null);

    // Lấy mã ISO từ tên quốc gia
    const countryCode = t.ai_country ? countryMap[t.ai_country] || 'VN' : 'VN'; // Default là 'VN' nếu không tìm thấy

    useEffect(() => {
        setAccountLogin(route.params?.accountLogin ?? null);
    }, [route.params]);

    const handleWhiteArmy = () => {
        // navigation.navigate('Login');
    };

    const handleBlackArmy = () => {
        // navigation.navigate('Login');
    };

    const handleRandomArmy = () => {
        // navigation.navigate('Login');
    };

    const handleHardMode = () => {
        // navigation.navigate('Login');
    };

    const handleMediumMode = () => {
        // navigation.navigate('Login');
    };

    const handleEasyMode = () => {
        // navigation.navigate('Login');
    };

    const handlePlay = () => {
        // navigation.navigate('Login');
    };

    return (
        <ScrollView
            style={styles.scrollView}
            contentContainerStyle={{ flexGrow: 1, alignItems: "center" }}
        >
            {/* Header */}
            <Header title={t.ai} />

            {/* Avatar AI */}
            <View style={styles.avtarContainer}>
                <Image
                    source={require('../images/AIChallenge.jpg')}
                    style={styles.avatar}
                />
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{t.ai_name}</Text>
                    <CountryFlag isoCode={countryCode} size={30} style={styles.flag} />
                </View>
            </View>

            <Text style={styles.sectionTitle}>{t.ai_chess_army_title}</Text>
            <View style={styles.sectionButton}>
                <Button_AIChallenge_Chess_Piece Icon={WhiteArmyIcon} color="white" onPress={handleWhiteArmy} />
                <Button_AIChallenge_Chess_Piece Icon={RandomIcon} colors={["white", "black"]} onPress={handleRandomArmy} />
                <Button_AIChallenge_Chess_Piece Icon={BlackArmyIcon} color="black" onPress={handleBlackArmy} />
            </View>

            <View style={styles.modeContainer}>
                <Text style={styles.modeTitle}>{t.ai_mode_title}</Text>
                <Button_AIChallenge_Mode title={t.ai_challenge_hard} subtitle={t.ai_challenge_hard_detail} Icon1={CrownLightIcon} Icon2={CrownLightIcon} Icon3={CrownLightIcon} onPress={handleHardMode} />
                <Button_AIChallenge_Mode title={t.ai_challenge_medium} subtitle={t.ai_challenge_medium_detail} Icon1={CrownLightIcon} Icon2={CrownLightIcon} Icon3={CrownBlackIcon} onPress={handleMediumMode} />
                <Button_AIChallenge_Mode title={t.ai_challenge_easy} subtitle={t.ai_challenge_easy_detail} Icon1={CrownLightIcon} Icon2={CrownBlackIcon} Icon3={CrownBlackIcon} onPress={handleEasyMode} />
            </View>

            {/* Play Button */}
            <Button_Save text={t.ai_button} onPress={handlePlay}/>
            
        </ScrollView >
    );
};

const lightStyles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: "#F5F5F5"
    },
    avtarContainer: {
        alignContent: 'center',
    },
    avatar: {
        marginTop: 40,
        width: 150,
        height: 150,
        borderRadius: 10,
        alignSelf: "center",
        backgroundColor: "black"
    },
    titleContainer: {
        flexDirection: "row",
        marginBottom: 40
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 10,
    },
    flag: {
        marginLeft: 5,
        marginTop: 10,
        alignSelf: 'center'
    },
    sectionButton: {
        flex: 1,
        flexDirection: "row",
        marginBottom: 40,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        alignSelf: "center"
    },
    modeContainer: {
        width: '90%',
    },
    modeTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        alignSelf: 'center'
    },
});

const darkStyles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: "#535353"
    },
    avtarContainer: {
        alignContent: 'center',
    },
    avatar: {
        marginTop: 40,
        width: 150,
        height: 150,
        borderRadius: 10,
        alignSelf: "center",
        backgroundColor: "white"
    },
    titleContainer: {
        flexDirection: "row",
        marginBottom: 40
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 10,
        color: "white"
    },
    flag: {
        marginLeft: 5,
        marginTop: 10,
        alignSelf: 'center'
    },
    sectionButton: {
        flex: 1,
        flexDirection: "row",
        marginBottom: 40,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        alignSelf: "center",
        color: "white"
    },
    modeContainer: {
        width: '90%',
    },
    modeTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        alignSelf: 'center',
        color: "white"
    },
});

export default AIChallengeScreen;