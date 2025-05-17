import React, {useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/AppNavigator';
import {useLanguage} from '../asycnc_store/LanguageContext';
import {useTheme} from '../asycnc_store/ThemeContext';
import {translations} from '../untils/i18n';
import {notify} from '../untils/Notify';
import {useNotification} from '../asycnc_store/NotificationContext';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import Header from '../components/common/Header';
import ButtonHostTime from '../components/common/Button_Host_Time';
import RapidTimeIcon from '../assets/icons/rapid_time_icon.svg';
import ToggleButtonNotification from '../components/common/ToggleButton_Notification';
import Button_Host_Chess_Piece from '../components/common/Button_Host_Chess_Piece';
import BlackArmyIcon from '../assets/icons/black_army_icon.svg';
import WhiteArmyIcon from '../assets/icons/white_army_icon.svg';
import RandomIcon from '../assets/icons/random_icon.svg';
import ButtonHostFriend from '../components/common/Button_Host_Friend';
import Button_Save from '../components/common/Button_Save';

type Props = NativeStackScreenProps<RootStackParamList, 'Host'>;

const HostScreen = ({route, navigation}: Props) => {
  const {language, toggleLanguage} = useLanguage();
  const t = translations[language];

  const {theme, toggleTheme} = useTheme();
  const isDark = theme === 'dark';
  const styles = isDark ? darkStyles : lightStyles;

  const {notification, toggleNotification} = useNotification();

  const [accountLogin, setAccountLogin] = useState(
    route.params?.accountLogin ?? null,
  );
  const [friend, setFriend] = useState(route.params?.friend ?? null);

  const [isRankingMode, setIsRankingMode] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string>(
    route.params?.selectedTime ?? `${t.host_time_default} ${t.host_time_min}`,
  );
  const [selectedPiece, setSelectedPiece] = useState<string | null>(null);

  const handleMoreTimeSetting = () => {
    navigation.replace('HostTimeSetting', {accountLogin, friend, selectedTime});
  };

  const handleFriend = () => {
    navigation.replace('HostFriend', {accountLogin, selectedTime});
  };

  const handleRankingMode = () => {
    if (!isRankingMode) {
      // notify({
      //     message: t.noti_info,
      //     description: t.host_ranking_mode_on,
      //     type: 'info',
      //     systemNotification: true,
      //     pushState: notification,
      // });
      setIsRankingMode(true);
      handleRandomArmy();
    } else {
      // notify({
      //     message: t.noti_info,
      //     description: t.host_ranking_mode_off,
      //     type: 'info',
      //     systemNotification: true,
      //     pushState: notification,
      // });
      setIsRankingMode(false);
    }
  };

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

  const handlePlay = () => {
    if (selectedPiece === null) {
      notify({
        message: t.noti_warning,
        description: t.noti_ai_choose_piece_and_mode,
        type: 'warning',
        systemNotification: true,
        pushState: notification,
      });
      return;
    }
    navigation.navigate('HostMatch', {
      accountLogin,
      friend,
      selectedTime,
      isRankingMode,
      selectedPiece,
    }); // Tạo màn hình custom
    setSelectedTime(t.host_time_default + ' ' + t.host_time_min);
    setFriend(null);
    setIsRankingMode(false);
    setSelectedPiece(null);
  };

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={{alignItems: 'center'}}>
      {/* Header */}
      <Header title={t.host} />

      {/* Button Time Setting */}
      <ButtonHostTime
        icon={RapidTimeIcon}
        title={selectedTime}
        onPress={handleMoreTimeSetting}
      />

      {/* Choose Friend */}
      <View style={styles.divider} />
      <ButtonHostFriend accountFriend={friend} onPress={handleFriend} />

      {/* Ranking Game */}
      <View style={styles.divider} />
      <View style={styles.ranking_mode}>
        <Text style={styles.ranking_mode_title}>{t.host_ranking_mode}</Text>
        <ToggleButtonNotification
          value={isRankingMode}
          onToggle={handleRankingMode}
        />
      </View>

      {/* Choose Piece */}
      <View style={styles.divider} />
      <View style={styles.choose_piece}>
        <Text style={styles.choose_piece_title}>{t.host_chess_piece}</Text>
        <View style={styles.groupButton}>
          <Button_Host_Chess_Piece
            Icon={WhiteArmyIcon}
            color="black"
            onPress={handleWhiteArmy}
            isSelected={selectedPiece === 'white'}
          />
          <Button_Host_Chess_Piece
            Icon={RandomIcon}
            colors={['white', 'black']}
            onPress={handleRandomArmy}
            isSelected={selectedPiece === 'random'}
          />
          <Button_Host_Chess_Piece
            Icon={BlackArmyIcon}
            color="white"
            onPress={handleBlackArmy}
            isSelected={selectedPiece === 'black'}
          />
        </View>
      </View>
      <View style={styles.divider} />

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
  ranking_mode: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
  },
  ranking_mode_title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  choose_piece: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
  },
  choose_piece_title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  groupButton: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end',
  },
  divider: {
    width: '90%',
    height: 1,
    backgroundColor: 'black',
    marginVertical: '5%',
    alignSelf: 'center',
  },
});

const darkStyles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#535353',
  },
  ranking_mode: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
  },
  ranking_mode_title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  choose_piece: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
  },
  choose_piece_title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  groupButton: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end',
  },
  divider: {
    width: '90%',
    height: 1,
    backgroundColor: 'white',
    marginVertical: '5%',
    alignSelf: 'center',
  },
});

export default HostScreen;
