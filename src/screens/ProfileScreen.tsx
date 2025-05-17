import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  Alert,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {format, parse} from 'date-fns';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/AppNavigator';
import CameraIcon from '../assets/icons/camera_icon.svg';
import Header from '../components/common/Header';
import {
  launchImageLibrary,
  ImageLibraryOptions,
  Asset,
} from 'react-native-image-picker';
import countries from 'world-countries';
import {useLanguage} from '../asycnc_store/LanguageContext';
import {useTheme} from '../asycnc_store/ThemeContext';
import {translations} from '../untils/i18n';
import Button_Save from '../components/common/Button_Save';
import SearchBlackIcon from '../assets/icons/search_black_icon.svg';
import SearchWhiteIcon from '../assets/icons/search_white_icon.svg';
import {notify} from '../untils/Notify';
import {useNotification} from '../asycnc_store/NotificationContext';
import DatePicker from 'react-native-date-picker';
import {getUserById, updateUser} from '../api/userApi';
import {useFocusEffect} from '@react-navigation/native';
import axios from 'axios';
import config from '../api/config';
import {ActivityIndicator} from 'react-native-paper';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

const ProfileScreen = ({route, navigation}: Props) => {
  const [accountLogin, setAccountLogin] = useState(
    route.params?.accountLogin ?? null,
  );
  const [displayName, setDisplayName] = useState(
    accountLogin?.displayName ?? '',
  );
  const [avatarUrl, setAvatarUrl] = useState(accountLogin?.avatarUrl ?? null);
  const [email, setEmail] = useState(accountLogin?.email ?? '');
  const [password, setPassword] = useState(accountLogin?.password ?? '');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState(() => {
    const dobStr = accountLogin?.dateOfBirth;
    if (!dobStr) return new Date();
    const parsed = new Date(dobStr);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  });
  const [nationality, setNationality] = useState(
    accountLogin?.nationality ?? 'Vietnam',
  );

  useFocusEffect(
    React.useCallback(() => {
      const fetchUser = async () => {
        try {
          if (accountLogin?._id) {
            const freshUser = await getUserById(accountLogin._id);
            setAccountLogin(freshUser);
            setDisplayName(freshUser.displayName ?? '');
            setAvatarUrl(freshUser.avatarUrl ?? null);
            setEmail(freshUser.email ?? '');
            setPassword(freshUser.password ?? '');
            setDateOfBirth(
              freshUser.dateOfBirth
                ? new Date(freshUser.dateOfBirth)
                : new Date(),
            );
            setNationality(freshUser.nationality ?? 'Vietnam');
          }
        } catch (error) {
          console.error('Lỗi khi tải lại user:', error);
        }
      };

      fetchUser();
    }, [accountLogin?._id]),
  );

  const countryList = countries.map(c => ({
    label: c.name.common,
    value: c.name.common,
  }));

  const {language} = useLanguage();
  const t = translations[language];

  const {theme} = useTheme();
  const isDark = theme === 'dark';
  const styles = isDark ? darkStyles : lightStyles;

  const {notification} = useNotification();

  const [isCountryModalVisible, setCountryModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const filteredCountries = countryList.filter(c =>
    c.label.toLowerCase().includes(searchText.toLowerCase()),
  );
  const [isBirthModalVisible, setBirthModalVisible] = useState(false);

  const handleSave = async () => {
    try {
      console.log('[DEBUG] accountLogin._id =', accountLogin._id);
      console.log('[DEBUG] update data =', {
        displayName,
        email,
        password,
        dateOfBirth: dateOfBirth.toISOString(),
        nationality,
        avatarUrl,
      });

      // ✅ Gọi API update
      const updatedUser = await updateUser(accountLogin._id, {
        displayName,
        email,
        password,
        dateOfBirth: dateOfBirth.toISOString(),
        nationality,
        avatarUrl,
      });

      // ✅ Cập nhật lại state sau khi backend update thành công
      setAccountLogin(updatedUser);

      // ✅ Thông báo sau khi mọi thứ đã xong
      notify({
        message: t.noti_success,
        description: t.noti_save_changes,
        type: 'success',
        systemNotification: true,
        pushState: notification,
      });
    } catch (error) {
      console.log(error);
      notify({
        message: t.noti_danger,
        type: 'danger',
        systemNotification: true,
        pushState: notification,
      });
    }
  };

  const handleAvatar = async () => {
    const options: ImageLibraryOptions = {mediaType: 'photo', quality: 1};
    launchImageLibrary(options, async response => {
      if (response.didCancel) return;
      if (response.errorMessage) {
        Alert.alert('Image picker error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        try {
          setIsUploadingAvatar(true); // 👉 Bắt đầu hiện vòng xoay

          const asset: Asset = response.assets[0];
          if (!asset.uri) return;

          const formData = new FormData();
          formData.append('image', {
            uri: asset.uri,
            type: asset.type ?? 'image/jpeg',
            name: asset.fileName ?? `upload_${Date.now()}.jpg`,
          });

          const res = await axios.post(
            `${config.API_URL}/api/upload`,
            formData,
            {headers: {'Content-Type': 'multipart/form-data'}},
          );

          setAvatarUrl(res.data.url);
        } catch (err) {
          console.error(err);
          Alert.alert('Upload Error', 'Không thể upload ảnh lên server.');
        } finally {
          setIsUploadingAvatar(false); // 👉 Dừng vòng xoay
        }
      }
    });
  };

  console.log(accountLogin);
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{alignItems: 'center'}}>
        <Header title={t.profile} />

        {/* Avatar */}
        <View style={styles.avatarContainer}>
          {isUploadingAvatar ? (
            <ActivityIndicator size="large" color="#6B50F6" /> // 👉 hiện vòng xoay thay ảnh
          ) : (
            <View>
              <Image
                source={
                  avatarUrl ? {uri: avatarUrl} : require('../images/user.png')
                }
                style={styles.avatar}
              />
              <TouchableOpacity
                style={styles.cameraIcon}
                onPress={handleAvatar}>
                <CameraIcon width={40} height={40} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.label}>{t.profile_name}</Text>
          <TextInput
            style={styles.input}
            value={displayName}
            onChangeText={setDisplayName}
          />

          <Text style={styles.label}>{t.profile_email}</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <Text style={styles.label}>{t.profile_password}</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {/* Birthdate Picker */}
          <Text style={styles.label}>{t.profile_birth}</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setBirthModalVisible(true)}>
            <Text style={styles.birthPicker}>
              {format(dateOfBirth, 'dd/MM/yyyy')}
            </Text>
          </TouchableOpacity>

          <Modal
            visible={isBirthModalVisible}
            animationType="slide"
            transparent
            onRequestClose={() => setBirthModalVisible(false)}>
            <TouchableWithoutFeedback
              onPress={() => setBirthModalVisible(false)}>
              <View style={styles.modalOverlay}>
                <TouchableWithoutFeedback>
                  <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>{t.profile_birth}</Text>
                    <DatePicker
                      date={dateOfBirth}
                      mode="date"
                      onDateChange={setDateOfBirth}
                      style={styles.calendar}
                      theme={isDark ? 'dark' : 'light'}
                      locale={language === 'vi' ? 'vi' : 'en'}
                    />
                    <Button_Save
                      text={t.profile_birth_confirm}
                      onPress={() => setBirthModalVisible(false)}
                    />
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>

          {/* Country Picker */}
          <Text style={styles.label}>{t.profile_country}</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setCountryModalVisible(true)}>
            <Text style={styles.countryText}>{nationality}</Text>
          </TouchableOpacity>

          <Modal
            visible={isCountryModalVisible}
            animationType="slide"
            transparent
            onRequestClose={() => setCountryModalVisible(false)}>
            <TouchableWithoutFeedback
              onPress={() => {
                setCountryModalVisible(false);
                setSearchText('');
              }}>
              <View style={styles.modalOverlay}>
                <TouchableWithoutFeedback>
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
                      {isDark ? (
                        <SearchWhiteIcon width={22} height={22} />
                      ) : (
                        <SearchBlackIcon width={22} height={22} />
                      )}
                    </View>
                    <FlatList
                      data={filteredCountries}
                      keyExtractor={item => item.value}
                      keyboardShouldPersistTaps="handled"
                      renderItem={({item}) => (
                        <TouchableOpacity
                          style={styles.listItem}
                          onPress={() => {
                            setNationality(item.value);
                            setCountryModalVisible(false);
                            setSearchText('');
                          }}>
                          <Text style={styles.listItemText}>{item.label}</Text>
                        </TouchableOpacity>
                      )}
                    />
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>

          <Button_Save text={t.profile_button} onPress={handleSave} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const lightStyles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  avatar: {
    width: 180,
    height: 180,
    borderRadius: 180,
    borderColor: '#6B50F6',
    borderWidth: 3,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: -10,
    right: 5,
    borderRadius: 20,
    padding: 5,
  },
  form: {
    paddingHorizontal: 20,
    marginTop: 20,
    width: '100%',
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    height: 60,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 18,
    marginBottom: 15,
    justifyContent: 'center',
  },
  birthPicker: {
    fontSize: 18,
  },
  calendar: {
    backgroundColor: '#fff',
  },
  countryText: {
    fontSize: 18,
    color: 'black',
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
    marginBottom: 10,
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
    backgroundColor: '#535353',
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  avatar: {
    width: 180,
    height: 180,
    borderRadius: 180,
    borderColor: '#6B50F6',
    borderWidth: 2,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: -10,
    right: 5,
    borderRadius: 20,
    padding: 5,
  },
  form: {
    paddingHorizontal: 20,
    marginTop: 20,
    width: '100%',
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#FFFFFF',
  },
  input: {
    height: 60,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 18,
    marginBottom: 15,
    justifyContent: 'center',
    color: '#FFFFFF',
  },
  birthPicker: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  calendar: {
    backgroundColor: '#535353',
  },
  countryText: {
    fontSize: 18,
    color: 'white',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: '#535353',
    paddingHorizontal: 10,
    marginBottom: 10,
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
    backgroundColor: '#535353',
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
    color: 'white',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
    marginBottom: 10,
    color: 'white',
  },
  listItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  listItemText: {
    fontSize: 16,
    color: 'white',
  },
});

export default ProfileScreen;
