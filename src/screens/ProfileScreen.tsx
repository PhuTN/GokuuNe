import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, TextInput, Alert, Modal, FlatList, TouchableWithoutFeedback } from 'react-native';
import { format, parse } from 'date-fns';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import CameraIcon from '../assets/icons/camera_icon.svg';
import Header from '../components/common/Header';
import { launchImageLibrary, ImageLibraryOptions, Asset } from 'react-native-image-picker';
import countries from 'world-countries';
import { useLanguage } from "../asycnc_store/LanguageContext";
import { useTheme } from "../asycnc_store/ThemeContext";
import { translations } from "../untils/i18n";
import Button_Save from '../components/common/Button_Save';
import SearchBlackIcon from '../assets/icons/search_black_icon.svg';
import SearchWhiteIcon from '../assets/icons/search_white_icon.svg';
import { notify } from '../untils/notify';
import { useNotification } from '../asycnc_store/NotificationContext';
import DatePicker from 'react-native-date-picker';

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

  const { notification, toggleNotification } = useNotification();

  const [isCountryModalVisible, setCountryModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const filteredCountries = countryList.filter((c) =>
    c.label.toLowerCase().includes(searchText.toLowerCase())
  );
  const [isBirthModalVisible, setBirthModalVisible] = useState(false);

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
    notify({
      message: t.noti_success,
      description: t.noti_save_changes,
      type: 'success',
      systemNotification: true,
      pushState: notification,
    });
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
    <ScrollView style={styles.scrollView} contentContainerStyle={{ alignItems: "center" }}>
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

        {/* Birthdate Picker */}
        <Text style={styles.label}>{t.profile_birth}</Text>
        <TouchableOpacity style={styles.input} onPress={() => setBirthModalVisible(true)}>
          <Text style={styles.birthPicker}>{format(birth, 'dd/MM/yyyy')}</Text>
        </TouchableOpacity>

        <Modal
          visible={isBirthModalVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setBirthModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setBirthModalVisible(false)}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback onPress={() => { }}>
                <View style={styles.modalContainer}>
                  <Text style={styles.modalTitle}>{t.profile_birth}</Text>

                  <DatePicker
                    date={birth}
                    mode="date"
                    onDateChange={setBirth}
                    style={styles.calendar}
                    theme={isDark ? "dark" : "light"}
                    locale={language === 'vi' ? 'vi' : 'en'}
                  />

                  <Button_Save text={t.profile_birth_confirm} onPress={() => setBirthModalVisible(false)} />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* Country Picker */}
        <Text style={styles.label}>{t.profile_country}</Text>
        <TouchableOpacity style={styles.input} onPress={() => setCountryModalVisible(true)}>
          <Text style={styles.countryText}>{country}</Text>
        </TouchableOpacity>

        <Modal
          visible={isCountryModalVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setCountryModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => { setCountryModalVisible(false); setSearchText('') }}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback onPress={() => { }}>
                <View style={styles.modalContainer}>
                  <Text style={styles.modalTitle}>{t.profile_country}</Text>

                  <View style={styles.searchBox}>
                    <TextInput
                      style={styles.inputSearch}
                      value={searchText}
                      onChangeText={setSearchText}
                      placeholder={t.friends_searchbox_placeholder}
                      placeholderTextColor={isDark ? '#888' : '#666'}
                    />
                    {!isDark ? (
                      <SearchBlackIcon width={22} height={22} />
                    ) : (
                      <SearchWhiteIcon width={22} height={22} />
                    )}
                  </View>

                  <FlatList
                    data={filteredCountries}
                    keyExtractor={(item) => item.value}
                    keyboardShouldPersistTaps="handled"
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.listItem}
                        onPress={() => {
                          setCountry(item.value);
                          setCountryModalVisible(false);
                          setSearchText('');
                        }}
                      >
                        <Text style={styles.listItemText}>{item.label}</Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* Save Button */}
        <Button_Save text={t.profile_button} onPress={handleSave} />
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
  calendar: {
    backgroundColor: '#fff',
  },
  countryText: {
    fontSize: 18,
    color: "black",
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    marginBottom: 10
  },
  inputSearch: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 8,
    color: '#000',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    width: '100%',
    maxHeight: '80%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
    marginBottom: 10,
  },
  listItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  listItemText: {
    fontSize: 16,
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
  calendar: {
    backgroundColor: '#535353',
  },
  countryText: {
    fontSize: 18,
    color: "white",
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: "#535353",
    paddingHorizontal: 10,
    marginBottom: 10
  },
  inputSearch: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 8,
    color: 'white',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: "#535353",
    width: '100%',
    maxHeight: '80%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: "white"
  },
  searchInput: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
    marginBottom: 10,
    color: "white"
  },
  listItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  listItemText: {
    fontSize: 16,
    color: "white"
  },
});

export default ProfileScreen;
