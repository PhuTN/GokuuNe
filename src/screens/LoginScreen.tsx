import React, { useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, TextInputProps, ScrollView } from 'react-native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { accounts } from '../fake_data/Dien/fake_data';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../components/common/Header';
import { useLanguage } from "../asycnc_store/LanguageContext";
import { useTheme } from "../asycnc_store/ThemeContext";
import { translations } from "../untils/i18n";

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen = ({ navigation }: Props) => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const { language, toggleLanguage } = useLanguage();
    const t = translations[language];

    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';
    const styles = isDark ? darkStyles : lightStyles;

    const passwordInputRef = useRef<TextInput>(null);

    const handleLogin = () => {
        const accountExist = accounts.find(account => account.username === username && account.password === password);

        if (accountExist) {
            Alert.alert(t.login_success, t.login_success_message, [
                {
                    text: t.login_success_ok,
                    onPress: () => navigation.navigate('Home', { accountLogin: accountExist })
                }
            ]);
        } else {
            Alert.alert(t.login_error, t.login_error_message);
        }
    };

    return (
        <ScrollView
            style={styles.scrollView}
            contentContainerStyle={{ flexGrow: 1 }}
        >
            {/* Header */}
            <Header title={t.login} />

            {/* Body */}
            <View style={styles.body}>
                <Text style={styles.title}>{t.login_title}</Text>

                <Text style={styles.label}>{t.login_username}</Text>
                <TextInput
                    style={styles.input}
                    placeholder={t.login_username_placeholder}
                    placeholderTextColor="#888"
                    value={username}
                    onChangeText={setUsername}
                    returnKeyType="next"
                    onSubmitEditing={() => passwordInputRef.current?.focus()}
                />

                <Text style={styles.label}>{t.login_password}</Text>
                <TextInput
                    ref={passwordInputRef}
                    style={styles.input}
                    placeholder={t.login_password_placeholder}
                    placeholderTextColor="#888"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    returnKeyType="done"
                    onSubmitEditing={handleLogin}
                />

                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <LinearGradient
                        colors={["#6B50F6", "#CC8FED"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>{t.login_button}</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const lightStyles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    body: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: "90%",
        alignSelf: "center",
        marginBottom: 40
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20
    },
    label: {
        alignSelf: 'flex-start',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5
    },
    input: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 10,
        paddingHorizontal: 10,
        fontSize: 16,
        marginBottom: 20,
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

const darkStyles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: "#535353"
    },
    body: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: "90%",
        alignSelf: "center",
        marginBottom: 40
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20,
        color: "#FFFFFF",
    },
    label: {
        alignSelf: 'flex-start',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: "#FFFFFF",
    },
    input: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: "#FFFFFF",
        borderRadius: 10,
        paddingHorizontal: 10,
        fontSize: 16,
        marginBottom: 20,
        color: "#FFFFFF",
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default LoginScreen;
