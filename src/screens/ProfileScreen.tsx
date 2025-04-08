import React, { useState } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet, ScrollView, Image, TextInput, Alert } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { format, parse } from 'date-fns';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import CameraIcon from '../assets/icons/camera_icon.svg';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../components/common/Header';
import { launchImageLibrary, ImageLibraryOptions, Asset } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import countries from 'world-countries';
import { useLanguage } from "../asycnc_store/LanguageContext";
import { useTheme } from "../asycnc_store/ThemeContext";
import { translations } from "../untils/i18n";

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

const ProfileScreen = ({ route, navigation }: Props) => {
  const [accountLogin, setAccountLogin] = useState(route.params?.accountLogin ?? null);
  const [name, setName] = useState(accountLogin?.name ?? '');
  const [avatar, setAvatar] = useState(accountLogin?.avatar ?? null);
  const [email, setEmail] = useState(accountLogin?.email ?? '');
  const [password, setPassword] = useState(accountLogin?.password ?? '');
  const [birth, setBirth] = useState(() => {
    const birthStr = accountLogin?.birth;
    if (!birthStr) return new Date(); // Không có ngày sinh => default

    // Parse chuỗi dd/MM/yyyy thành đối tượng Date
    const parsed = parse(birthStr, 'dd/MM/yyyy', new Date());

    // Nếu parse lỗi, trả về ngày hiện tại
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  });
  const [country, setCountry] = useState(accountLogin?.country ?? 'Vietnam');

  const [openDatePicker, setOpenDatePicker] = useState(false);
  const countryList = countries.map((c) => ({
    label: c.name.common,
    value: c.name.common,
  }));

  const { language, toggleLanguage } = useLanguage();
  const t = translations[language];

  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const styles = isDark ? darkStyles : lightStyles;

  const handleSave = () => {
    const updatedAccount = {
      ...accountLogin,
      name,
      email,
      password,
      birth: format(birth, 'dd/MM/yyyy'),
      country,
      avatar,
    };
    setAccountLogin(updatedAccount);
    Alert.alert('Profile updated successfully!');
  };

  const handleAvatar = async () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      quality: 1,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        Alert.alert('User cancelled image picker');
      } else if (response.errorMessage) {
        Alert.alert('Image picker error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        setAvatar({ uri: response.assets[0].uri });
      }
    });
  };

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={{ flexGrow: 1, alignItems: "center" }}>
      {/* Header */}
      <Header title={t.profile} />

      {/* Profile Avatar */}
      <View style={styles.avatarContainer}>
        <Image source={avatar || require('../images/user.png')} style={styles.avatar} />
        <TouchableOpacity style={styles.cameraIcon} onPress={handleAvatar}>
          <CameraIcon width={40} height={40} />
        </TouchableOpacity>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <Text style={styles.label}>{t.profile_name}</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />

        <Text style={styles.label}>{t.profile_email}</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />

        <Text style={styles.label}>{t.profile_password}</Text>
        <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />

        {/* Date Picker */}
        <Text style={styles.label}>{t.profile_birth}</Text>
        <TouchableOpacity style={styles.input} onPress={() => setOpenDatePicker(true)}>
          <Text style={styles.birthPicker}>{format(birth, 'dd/MM/yyyy')}</Text>
        </TouchableOpacity>
        <DatePicker
          modal
          open={openDatePicker}
          date={birth}
          mode="date"
          onConfirm={(date) => {
            setBirth(date);
            setOpenDatePicker(false);
          }}
          onCancel={() => setOpenDatePicker(false)}
        />

        {/* Country Picker */}
        <Text style={styles.label}>{t.profile_country}</Text>
        <View style={styles.input}>
          {!isDark ? (
            <Picker
              selectedValue={country}
              onValueChange={(value) => setCountry(value)}
              style={styles.countryPicker}
              dropdownIconColor= "#000"
            >
              {countryList.map((c) => (
                <Picker.Item key={c.value} label={c.label} value={c.value} />
              ))}
            </Picker>
          ) : (
            <Picker
              selectedValue={country}
              onValueChange={(value) => setCountry(value)}
              style={styles.countryPicker}
              dropdownIconColor= "#FFFFFF"
            >
              {countryList.map((c) => (
                <Picker.Item key={c.value} label={c.label} value={c.value} />
              ))}
            </Picker>
          )}
        </View>


        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <LinearGradient
            colors={["#6B50F6", "#CC8FED"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.saveButton}
          >
            <Text style={styles.saveButtonText}>{t.profile_button}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView >
  );
};

const lightStyles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  avatarContainer: {
    alignItems: "center",
    marginTop: 50,
  },
  avatar: {
    width: 180,
    height: 180,
    borderRadius: 180,
    borderColor: "#6B50F6",
    borderWidth: 3
  },
  cameraIcon: {
    position: "absolute",
    bottom: -10,
    right: 5,
    borderRadius: 20,
    padding: 5,
  },
  form: {
    paddingHorizontal: 20,
    marginTop: 20,
    width: "100%",
  },
  label: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    height: 60,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 18,
    marginBottom: 15,
    justifyContent: "center",
  },
  birthPicker: {
    fontSize: 18
  },
  countryPicker: {
    flex: 1,
    fontSize: 18,
    color: "#000",
  },
  saveButton: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

const darkStyles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#535353"
  },
  avatarContainer: {
    alignItems: "center",
    marginTop: 50,
  },
  avatar: {
    width: 180,
    height: 180,
    borderRadius: 180,
    borderColor: "#6B50F6",
    borderWidth: 2
  },
  cameraIcon: {
    position: "absolute",
    bottom: -10,
    right: 5,
    borderRadius: 20,
    padding: 5,
  },
  form: {
    paddingHorizontal: 20,
    marginTop: 20,
    width: "100%",
  },
  label: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#FFFFFF"
  },
  input: {
    height: 60,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 18,
    marginBottom: 15,
    justifyContent: "center",
    color: "#FFFFFF"
  },
  birthPicker: {
    fontSize: 18,
    color: "#FFFFFF"
  },
  countryPicker: {
    flex: 1,
    fontSize: 18,
    color: "#FFFFFF"
  },
  saveButton: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
