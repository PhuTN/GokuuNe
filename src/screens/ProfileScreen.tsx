import React, { useState } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet, ScrollView, Image, TextInput } from 'react-native';
// import DatePicker from 'react-native-date-picker';
import { format } from 'date-fns';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import BackIcon from '../assets/icons/back_icon.svg';
import CameraIcon from '../assets/icons/camera_icon.svg';
import LinearGradient from 'react-native-linear-gradient';
import { launchImageLibrary } from 'react-native-image-picker';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

const ProfileScreen = ({ route, navigation }: Props) => {
  const [accountLogin, setAccountLogin] = useState(route.params?.accountLogin ?? null);
  const [name, setName] = useState(accountLogin?.name ?? '');
  const [avatar, setAvatar] = useState(accountLogin?.avatar ?? null);
  const [email, setEmail] = useState(accountLogin?.email ?? '');
  const [password, setPassword] = useState(accountLogin?.password ?? '');
  const [birth, setBirth] = useState(accountLogin?.birth ? new Date(accountLogin.birth) : new Date());
  const [country, setCountry] = useState(accountLogin?.country ?? 'US');

  // const [openDatePicker, setOpenDatePicker] = useState(false);
  // const [openCountryPicker, setOpenCountryPicker] = useState(false);

  const handleSave = () => {
    console.log({ name, email, password, birth: format(birth, 'dd/MM/yyyy'), country });

    setAccountLogin((prevAccount) => ({
      ...prevAccount,
      name,
      email,
      password
    }));
  };

  const handleAvatar = async () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('Image picker error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        setAvatar({ uri: response.assets[0].uri });
      }
    });
  };

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={{ flexGrow: 1, alignItems: "center" }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <BackIcon width={45} height={45} />
        </TouchableOpacity>
        <Text style={styles.headerText}>PROFILE</Text>
      </View>

      {/* Profile Avatar */}
      <View style={styles.avatarContainer}>
        <Image source={avatar||require('../assets/images/user.png')} style={styles.avatar} />
        <TouchableOpacity style={styles.cameraIcon} onPress={handleAvatar}>
          <CameraIcon width={40} height={40} />
        </TouchableOpacity>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <Text style={styles.label}>Name</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />

        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />

        <Text style={styles.label}>Password</Text>
        <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />

        {/* Date Picker */}
        {/* <Text style={styles.label}>Date of Birth</Text>
        <TouchableOpacity style={styles.input} onPress={() => setOpenDatePicker(true)}>
          <Text>{format(birth, 'dd/MM/yyyy')}</Text>
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
        /> */}

        {/* Country Picker */}
        {/* <Text style={styles.label}>Country/Region</Text>
        <RNPickerSelect
          onValueChange={(value) => setCountry(value)}
          items={[
            { label: "United States", value: "US" },
            { label: "Vietnam", value: "VN" },
            { label: "United Kingdom", value: "UK" },
            { label: "Canada", value: "CA" },
            { label: "France", value: "FR" },
            { label: "Germany", value: "DE" },
            { label: "Japan", value: "JP" },
            { label: "China", value: "CN" },
            { label: "India", value: "IN" },
            { label: "Brazil", value: "BR" },
            { label: "Nigeria", value: "NG" },
            { label: "Australia", value: "AU" },
            { label: "South Korea", value: "KR" },
            { label: "Mexico", value: "MX" },
            { label: "Russia", value: "RU" },
          ]}
          value={country}
          style={pickerSelectStyles}
        /> */}

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <LinearGradient
            colors={["#6B50F6", "#CC8FED"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.saveButton}
          >
            <Text style={styles.saveButtonText}>Save changes</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView >
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingVertical: 10,
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFC107",
    textAlign: "center",
  },
  avatarContainer: {
    alignItems: "center",
    marginTop: 50,
  },
  avatar: {
    width: 180,
    height: 180,
    borderRadius: 180,
    borderWidth: 3,
    borderColor: "#fff",
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
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 16,
    marginBottom: 15,
    justifyContent: "center",
  },
  saveButton: {
    marginVertical: 20,
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

const pickerSelectStyles = {
  inputIOS: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  inputAndroid: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
};

export default ProfileScreen;
