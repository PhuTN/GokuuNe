import {useEffect, useState} from 'react';
import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/AppNavigator';
import {useLanguage} from '../asycnc_store/LanguageContext';
import {useTheme} from '../asycnc_store/ThemeContext';
import {translations} from '../untils/i18n';
import Header from '../components/common/Header';
import Button_AIChallenge_Mode from '../components/common/Button_AIChallenge_Mode';
import Button_AIChallenge_Chess_Piece from '../components/common/Button_AIChallenge_Chess_Piece';
import CrownLightIcon from '../assets/icons/crown_light_icon.svg';
import CrownBlackIcon from '../assets/icons/crown_black_icon.svg';
import BlackArmyIcon from '../assets/icons/black_army_icon.svg';
import WhiteArmyIcon from '../assets/icons/white_army_icon.svg';
import RandomIcon from '../assets/icons/random_icon.svg';
import countries from 'world-countries';
import CountryFlag from 'react-native-country-flag';
import Button_Save from '../components/common/Button_Save';
import {notify} from '../untils/Notify';
import {useNotification} from '../asycnc_store/NotificationContext';

type Props = NativeStackScreenProps<RootStackParamList, 'AIChallenge'>;

// Ánh xạ từ tên quốc gia sang mã ISO
const countryMap: Record<string, string> = countries.reduce((map, country) => {
  map[country.name.common] = country.cca2;
  return map;
}, {} as Record<string, string>);

const AIChallengeScreen = ({route, navigation}: Props) => {
  const [accountLogin, setAccountLogin] = useState(
    route.params?.accountLogin ?? null,
  );

  const {language, toggleLanguage} = useLanguage();
  const t = translations[language];

  const {theme, toggleTheme} = useTheme();
  const isDark = theme === 'dark';
  const styles = isDark ? darkStyles : lightStyles;

  const {notification, toggleNotification} = useNotification();

  const [selectedPiece, setSelectedPiece] = useState<string | null>(null);

  const [selectedMode, setSelectedMode] = useState<string | null>(null);

  useEffect(() => {
    setAccountLogin(route.params?.accountLogin ?? null);
  }, [route.params]);

  const handleWhiteArmy = () => {
    setSelectedPiece('white');
    // notify({
    //     message: t.noti_info,
    //     description: t.noti_ai_white_army,
    //     type: 'info',
    //     systemNotification: true,
    //     pushState: notification,
    // });
  };

  const handleBlackArmy = () => {
    setSelectedPiece('black');
    // notify({
    //     message: t.noti_info,
    //     description: t.noti_ai_black_army,
    //     type: 'info',
    //     systemNotification: true,
    //     pushState: notification,
    // });
  };

  const handleRandomArmy = () => {
    setSelectedPiece('random');
    // notify({
    //     message: t.noti_info,
    //     description: t.noti_ai_random_army,
    //     type: 'info',
    //     systemNotification: true,
    //     pushState: notification,
    // });
  };

  const handleHardMode = () => {
    setSelectedMode('hard');
    // notify({
    //     message: t.noti_info,
    //     description: t.noti_ai_hard_mode,
    //     type: 'info',
    //     systemNotification: true,
    //     pushState: notification,
    // });
  };

  const handleMediumMode = () => {
    setSelectedMode('medium');
    // notify({
    //     message: t.noti_info,
    //     description: t.noti_ai_medium_mode,
    //     type: 'info',
    //     systemNotification: true,
    //     pushState: notification,
    // });
  };

  const handleEasyMode = () => {
    setSelectedMode('easy');
    // notify({
    //     message: t.noti_info,
    //     description: t.noti_ai_easy_mode,
    //     type: 'info',
    //     systemNotification: true,
    //     pushState: notification,
    // });
  };

  const handlePlay = () => {
    if (selectedPiece === null || selectedMode === null) {
      notify({
        message: t.noti_warning,
        description: t.noti_ai_choose_piece_and_mode,
        type: 'warning',
        systemNotification: true,
        pushState: notification,
      });
      return;
    }
    notify({
      message: t.noti_success,
      description: t.noti_ai_play,
      type: 'success',
      systemNotification: true,
      pushState: notification,
    });
    navigation.navigate('AIMatch', {accountLogin, selectedPiece, selectedMode}); // Tạo màn hình chơi với AI
    setSelectedMode(null);
    setSelectedPiece(null);
  };

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={{flexGrow: 1, alignItems: 'center'}}>
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
          <CountryFlag
            isoCode={countryMap[t.ai_country]}
            size={30}
            style={styles.flag}
          />
        </View>
      </View>

      {/* Choose army type */}
      <Text style={styles.sectionTitle}>{t.ai_chess_army_title}</Text>
      <View style={styles.sectionButton}>
        <Button_AIChallenge_Chess_Piece
          Icon={WhiteArmyIcon}
          color="black"
          onPress={handleWhiteArmy}
          isSelected={selectedPiece === 'white'}
        />
        <Button_AIChallenge_Chess_Piece
          Icon={RandomIcon}
          colors={['white', 'black']}
          onPress={handleRandomArmy}
          isSelected={selectedPiece === 'random'}
        />
        <Button_AIChallenge_Chess_Piece
          Icon={BlackArmyIcon}
          color="white"
          onPress={handleBlackArmy}
          isSelected={selectedPiece === 'black'}
        />
      </View>

      {/* Choose play mode */}
      <View style={styles.modeContainer}>
        <Text style={styles.modeTitle}>{t.ai_mode_title}</Text>
        <Button_AIChallenge_Mode
          title={t.ai_challenge_hard}
          subtitle={t.ai_challenge_hard_detail}
          Icon1={CrownLightIcon}
          Icon2={CrownLightIcon}
          Icon3={CrownLightIcon}
          onPress={handleHardMode}
          isSelected={selectedMode === 'hard'}
        />
        <Button_AIChallenge_Mode
          title={t.ai_challenge_medium}
          subtitle={t.ai_challenge_medium_detail}
          Icon1={CrownLightIcon}
          Icon2={CrownLightIcon}
          Icon3={CrownBlackIcon}
          onPress={handleMediumMode}
          isSelected={selectedMode === 'medium'}
        />
        <Button_AIChallenge_Mode
          title={t.ai_challenge_easy}
          subtitle={t.ai_challenge_easy_detail}
          Icon1={CrownLightIcon}
          Icon2={CrownBlackIcon}
          Icon3={CrownBlackIcon}
          onPress={handleEasyMode}
          isSelected={selectedMode === 'easy'}
        />
      </View>

      {/* Play Button */}
      <Button_Save text={t.ai_button} onPress={handlePlay} />
    </ScrollView>
  );
};

const lightStyles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  avtarContainer: {
    alignContent: 'center',
  },
  avatar: {
    marginTop: 40,
    width: 150,
    height: 150,
    borderRadius: 10,
    alignSelf: 'center',
    backgroundColor: 'black',
  },
  titleContainer: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  flag: {
    marginLeft: 5,
    marginTop: 10,
    alignSelf: 'center',
  },
  sectionButton: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    alignSelf: 'center',
  },
  modeContainer: {
    width: '90%',
  },
  modeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
});

const darkStyles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#535353',
  },
  avtarContainer: {
    alignContent: 'center',
  },
  avatar: {
    marginTop: 40,
    width: 150,
    height: 150,
    borderRadius: 10,
    alignSelf: 'center',
    backgroundColor: 'white',
  },
  titleContainer: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    color: 'white',
  },
  flag: {
    marginLeft: 5,
    marginTop: 10,
    alignSelf: 'center',
  },
  sectionButton: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    alignSelf: 'center',
    color: 'white',
  },
  modeContainer: {
    width: '90%',
  },
  modeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'center',
    color: 'white',
  },
});

export default AIChallengeScreen;
