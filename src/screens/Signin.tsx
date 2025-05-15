import React, { useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../components/common/Header';
import { useLanguage } from "../asycnc_store/LanguageContext";
import { useTheme } from "../asycnc_store/ThemeContext";
import { translations } from "../untils/i18n";
import { registerUser } from '../api/userApi';
import { notify } from '../untils/Notify';
import { useNotification } from '../asycnc_store/NotificationContext';


type Props = NativeStackScreenProps<RootStackParamList, 'Signin'>;

const SigninScreen = ({ navigation }: Props) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { language } = useLanguage();
  const t = translations[language];

  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const styles = isDark ? darkStyles : lightStyles;

  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const confirmPasswordInputRef = useRef<TextInput>(null);
const { notification, toggleNotification } = useNotification();
  const handleRegister = async () => {
    if (!username || !email || !password || !confirmPassword) {
      //Alert.alert(t.noti_warning, t.noti_fill_all_fields);
      return;
    }

    if (password !== confirmPassword) {
      //Alert.alert(t.noti_warning, t.noti_password_not_match);
      return;
    }

    try {
      const data = await registerUser({
        username,
        email,
        password
      });

      notify({
        message: t.noti_success,
        description: t.register_success,
        type: 'success',
        systemNotification: true,
        pushState: notification,
      });

      navigation.navigate('Home', { accountLogin: data.user });
    } catch (err: any) {
      notify({
        message: t.noti_danger,
       // description: err.response?.data?.error || t.register_failed,
        type: 'danger',
        systemNotification: true,
        pushState: notification,
      });
    }
  };

  return (
    <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
    >
    <ScrollView style={styles.scrollView} contentContainerStyle={{ flexGrow: 1 }}>
      <Header title={t.register_title} />
      <View style={styles.body}>

        <View style={{ marginTop: 30 }}>
  <Text style={styles.title}>{t.create_account}</Text>
</View>
        

        <Text style={styles.label}>{t.login_username}</Text>
        <TextInput
          style={styles.input}
          placeholder={t.login_username_placeholder}
          placeholderTextColor="#888"
          value={username}
          onChangeText={setUsername}
          returnKeyType="next"
          onSubmitEditing={() => emailInputRef.current?.focus()}
        />

        <Text style={styles.label}>{t.login_email}</Text>
        <TextInput
          ref={emailInputRef}
          style={styles.input}
          placeholder={t.login_email_placeholder}
          placeholderTextColor="#888"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
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
          returnKeyType="next"
          onSubmitEditing={() => confirmPasswordInputRef.current?.focus()}
        />

        <Text style={styles.label}>{t.login_confirm_password}</Text>
        <TextInput
          ref={confirmPasswordInputRef}
          style={styles.input}
          placeholder={t.login_confirm_password_placeholder}
          placeholderTextColor="#888"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          returnKeyType="done"
        />

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <LinearGradient
            colors={["#6B50F6", "#CC8FED"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>{t.register_button}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
    </KeyboardAvoidingView>
  );
};

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

    bottomButtonsContainer: {
        flexDirection: 'row',
        marginTop: 15,
        width: '100%',
        justifyContent: 'space-between',
    },
    bottomButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '48%',
        height: 45,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 10,
        backgroundColor: '#fff',
    },
    bottomButtonText: {
        fontSize: 16,
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
    bottomButtonsContainer: {
        flexDirection: 'row',
        marginTop: 15,
        width: '100%',
        justifyContent: 'space-between',
    },
    bottomButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '48%',
        height: 45,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 10,
        backgroundColor: '#fff',
    },
    bottomButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});
export default SigninScreen;
