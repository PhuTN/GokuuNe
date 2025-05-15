import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { accounts } from '../fake_data/Dien/fake_data';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../components/common/Header';
import { useLanguage } from "../asycnc_store/LanguageContext";
import { useTheme } from "../asycnc_store/ThemeContext";
import { translations } from "../untils/i18n";
import { notify } from '../untils/Notify';
import { useNotification } from '../asycnc_store/NotificationContext';
import {login, registerUser} from '../api/userApi'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { socket } from '../untils/socket';
import Icon from 'react-native-vector-icons/FontAwesome';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
 
type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen = ({ navigation }: Props) => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const { language, toggleLanguage } = useLanguage();
    const t = translations[language];

    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';
    const styles = isDark ? darkStyles : lightStyles;

    const { notification, toggleNotification } = useNotification();

    const passwordInputRef = useRef<TextInput>(null);

    const handleLogin = async () => {
    try {
        const data = await login(username, password);
        console.log("User login success:", data.user);

        // ✅ Kiểm tra trạng thái online
        if (data.user.onlineStatus === 'online') {
            notify({
                message: t.noti_info,
                description: "Tài khoản này đang online trên thiết bị khác!",
                type: 'info',
                systemNotification: true,
                pushState: notification,
            });

            // 👉 Bạn có thể chọn return hoặc tiếp tục login tùy logic
         return;   // nếu bạn muốn chặn luôn login
        }

        // ✅ Lưu thông tin user vào AsyncStorage
        await AsyncStorage.setItem('currentUser', JSON.stringify(data.user));

        // ✅ Kết nối socket + emit user online
        if (!socket.connected) {
            socket.connect();
        }
        socket.emit("user:online", data.user._id);

        notify({
            message: t.noti_success,
            description: t.noti_login_success,
            type: 'success',
            systemNotification: true,
            pushState: notification,
        });

        // ✅ Navigate qua Home
        navigation.navigate('Home', { accountLogin: data.user });

    } catch (err) {
        const error = err as any;
        console.log(err);

        notify({
            message: t.noti_danger,
            description: error.response?.data?.error || t.noti_login_faile,
            type: 'danger',
            systemNotification: true,
            pushState: notification,
        });
    }
};


 const handleRegister = () => {
        // Xử lý đăng ký
        navigation.navigate('Signin');
    };

    
useEffect(() => {
  GoogleSignin.configure({
    webClientId: '315838703306-o1kfpna3n1om3idvbdga99hae57kveul.apps.googleusercontent.com', // Thay bằng Client ID của bạn
  });
}, []);
const handleGoogleLogin = async () => {
    try {
        await GoogleSignin.signOut();
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        console.log("Google User Info:", userInfo);

        const googleUser = userInfo.data.user;

        const data = await registerUser({
            username: googleUser.name || `google_${googleUser.id}`,
            email: googleUser.email,
            password: "-1",
            googleId: googleUser.id,
            photo: googleUser.photo
        });

        await AsyncStorage.setItem('currentUser', JSON.stringify(data.user));

        if (!socket.connected) {
            socket.connect();
        }
        socket.emit("user:online", data.user._id);

        notify({
            message: t.noti_success,
            description: t.noti_login_success,
            type: 'success',
            systemNotification: true,
            pushState: notification,
        });

        navigation.navigate('Home', { accountLogin: data.user });

    } catch (error) {
       
        notify({
            message: t.noti_danger,
            
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
<TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
    <Text style={[styles.forgotPasswordText]}>{t.forgot_password}</Text>
</TouchableOpacity>
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

                <View style={styles.bottomButtonsContainer}>
    <TouchableOpacity style={{ width: '48%' }} onPress={handleRegister}>
        <LinearGradient
            colors={["#6B50F6", "#CC8FED"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.button}
        >
            <Text style={styles.buttonText}>{t.signin_button}</Text>
        </LinearGradient>
    </TouchableOpacity>

    <TouchableOpacity style={{ width: '48%' }} onPress={handleGoogleLogin}>
        <LinearGradient
            colors={["#6B50F6", "#CC8FED"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.button}
        >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
               
                <Image
    source={require('../images/google.png')}  // hoặc uri: { uri: '...' }
    style={{ width: 20, height: 20, marginRight: 8 }}
/>

                <Text style={styles.buttonText}>Google</Text>
            </View>
        </LinearGradient>
    </TouchableOpacity>
</View>

            </View>
        </ScrollView>

        </KeyboardAvoidingView>
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
    forgotPasswordText: {
    color: '#f65066',        // Màu tím bạn đang dùng
    alignSelf: 'flex-end',
    marginBottom: 10,
    fontWeight: 'bold'
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
    forgotPasswordText: {
    color: '#f65066',       // Màu tím bạn đang dùng
    alignSelf: 'flex-end',
    marginBottom: 20,
    fontWeight: 'bold'
},
});

export default LoginScreen;
