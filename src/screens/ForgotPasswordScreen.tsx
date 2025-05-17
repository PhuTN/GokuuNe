import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../components/common/Header';
import { useLanguage } from "../asycnc_store/LanguageContext";
import { useTheme } from "../asycnc_store/ThemeContext";
import { translations } from "../untils/i18n";
import { requestChangePassword, confirmChangePassword } from '../api/userApi';

type Props = NativeStackScreenProps<RootStackParamList, 'ForgotPassword'>;

const ForgotPasswordScreen = ({ navigation }: Props) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { language } = useLanguage();
  const t = translations[language];
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const styles = isDark ? darkStyles : lightStyles;

  const emailInputRef = useRef<TextInput>(null);
  const codeInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const confirmPasswordInputRef = useRef<TextInput>(null);

  const handleSendCode = async () => {
    if (!email) return Alert.alert(t.notice, t.notice_fill_all);
    try {
      await requestChangePassword(email);
      Alert.alert(t.success, t.forgot_password_email_sent || 'Check your email for the code!');
      setStep(2);
    } catch (error) {
      Alert.alert(t.noti_danger, error.response?.data?.error || 'Failed to send code');
    }
  };

  const handleResetPassword = async () => {
    if (!code || !newPassword || !confirmPassword) return Alert.alert(t.notice, t.notice_fill_all);
    if (newPassword !== confirmPassword) return Alert.alert(t.notice, t.notice_password_not_match);
    try {
      await confirmChangePassword(email, code, newPassword);
      Alert.alert(t.success, t.forgot_password_success || 'Password changed successfully');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert(t.noti_danger, error.response?.data?.error || 'Failed to reset password');
    }
  };

  const handleResendCode = async () => {
    if (!email) return;
    try {
      await requestChangePassword(email);
      Alert.alert(t.success, t.forgot_password_email_sent || 'Code resent. Check your email!');
    } catch (error) {
      Alert.alert(t.noti_danger, error.response?.data?.error || 'Failed to resend code');
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <ScrollView style={styles.scrollView} contentContainerStyle={{ flexGrow: 1 }}>
        <Header title={t.forgot_password_title || 'Forgot Password'} />
        <View style={styles.body}>
          <View style={{ marginTop: 30 }}>
            <Text style={styles.title}>{t.forgot_password_heading || 'Reset your password'}</Text>
          </View>

          {step === 1 && (
            <>
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
                returnKeyType="done"
              />

              <TouchableOpacity style={styles.button} onPress={handleSendCode}>
                <LinearGradient colors={["#6B50F6", "#CC8FED"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.button}>
                  <Text style={styles.buttonText}>{t.send_code_button || 'Send Code'}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </>
          )}

          {step === 2 && (
            <>
              <Text style={styles.label}>{t.enter_code_label || 'Enter code'}</Text>
              <TextInput
                ref={codeInputRef}
                style={styles.input}
                placeholder={t.enter_code_placeholder || 'Enter the code sent to your email'}
                placeholderTextColor="#888"
                value={code}
                onChangeText={setCode}
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
                value={newPassword}
                onChangeText={setNewPassword}
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

              <View style={styles.bottomButtonsContainer}>
                <TouchableOpacity style={{ width: '48%' }} onPress={handleResendCode}>
                  <LinearGradient colors={["#6B50F6", "#CC8FED"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.button}>
                    <Text style={styles.buttonText}>{t.resend_code_button || 'Resend Code'}</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity style={{ width: '48%' }} onPress={handleResetPassword}>
                  <LinearGradient colors={["#6B50F6", "#CC8FED"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.button}>
                    <Text style={styles.buttonText}>{t.reset_password_button || 'Reset Password'}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const lightStyles = StyleSheet.create({
  scrollView: { flex: 1 },
  body: { flex: 1, justifyContent: "center", alignItems: "center", width: "90%", alignSelf: "center", marginBottom: 40 },
  title: { fontSize: 30, fontWeight: 'bold', marginBottom: 20 },
  label: { alignSelf: 'flex-start', fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  input: { width: '100%', height: 50, borderWidth: 1, borderColor: 'gray', borderRadius: 10, paddingHorizontal: 10, fontSize: 16, marginBottom: 20 },
  button: { width: '100%', height: 50, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center', borderRadius: 10 },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  bottomButtonsContainer: { flexDirection: 'row', marginTop: 15, width: '100%', justifyContent: 'space-between' }
});

const darkStyles = StyleSheet.create({
  scrollView: { flex: 1, backgroundColor: "#535353" },
  body: { flex: 1, justifyContent: "center", alignItems: "center", width: "90%", alignSelf: "center", marginBottom: 40 },
  title: { fontSize: 30, fontWeight: 'bold', marginBottom: 20, color: "#FFFFFF" },
  label: { alignSelf: 'flex-start', fontSize: 18, fontWeight: 'bold', marginBottom: 5, color: "#FFFFFF" },
  input: { width: '100%', height: 50, borderWidth: 1, borderColor: "#FFFFFF", borderRadius: 10, paddingHorizontal: 10, fontSize: 16, marginBottom: 20, color: "#FFFFFF" },
  button: { width: '100%', height: 50, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center', borderRadius: 10 },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  bottomButtonsContainer: { flexDirection: 'row', marginTop: 15, width: '100%', justifyContent: 'space-between' }
});

export default ForgotPasswordScreen;
