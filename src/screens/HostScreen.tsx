import React, {useEffect, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/AppNavigator';
import {useLanguage} from '../asycnc_store/LanguageContext';
import {useTheme} from '../asycnc_store/ThemeContext';
import {translations} from '../untils/i18n';
import {notify} from '../untils/Notify';
import {useNotification} from '../asycnc_store/NotificationContext';
import {FlatList, Image, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import Header from '../components/common/Header';
import ButtonHostTime from '../components/common/HostScreen/Button_Host_Time';
import RapidTimeIcon from '../assets/icons/rapid_time_icon.svg';
import ToggleButtonNotification from '../components/common/ToggleButton_Notification';
import Button_Host_Chess_Piece from '../components/common/HostScreen/Button_Host_Chess_Piece';
import BlackArmyIcon from '../assets/icons/black_army_icon.svg';
import WhiteArmyIcon from '../assets/icons/white_army_icon.svg';
import RandomIcon from '../assets/icons/random_icon.svg';
import ButtonHostFriend from '../components/common/HostScreen/Button_Host_Friend';
import Button_Save from '../components/common/Button/Button_Save';
import SwordIcon from '../assets/icons/sword_icon.svg';
import { TouchableOpacity } from 'react-native';


// Mock data for challenges
const mockChallenges = [
  {
    id: 'ch1',
    user: { _id: 'userid1', displayName: 'Nguyen Van A', avatar: require('../images/avatar_01.jpg') },
    createdAt: '2025-05-28T13:00:00.000+00:00',
  },
  {
    id: 'ch2',
    user: { _id: 'userid2', displayName: 'Tran Thi B', avatar: require('../images/avatar_02.jpg') },
    createdAt: '2025-05-28T12:30:00.000+00:00',
  },
  {
    id: 'ch3',
    user: { _id: 'userid3', displayName: 'Le Van C', avatar: require('../images/avatar_03.jpg') },
    createdAt: '2025-05-28T12:00:00.000+00:00',
  },
];

type Props = NativeStackScreenProps<RootStackParamList, 'Host'>;

const HostScreen = ({ route, navigation }: Props) => {
  const { language, toggleLanguage } = useLanguage();
  const t = translations[language];

  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const styles = isDark ? darkStyles : lightStyles;

  const { notification, toggleNotification } = useNotification();

  const [accountLogin, setAccountLogin] = useState(
    route.params?.accountLogin ?? null,
  );
  const [friend, setFriend] = useState(route.params?.friend ?? null);
  const [match, setMatch] = useState(route.params?.match ?? null);

  const [isRankingMode, setIsRankingMode] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string>(route.params?.selectedTime ?? null);
  const [selectedPiece, setSelectedPiece] = useState<string | null>(null);

  const [challenges] = useState(mockChallenges);

  useEffect(() => {
    return () => {
      setSelectedTime(`${t.host_time_default} ${t.host_time_min}`);
      setFriend(null);
      setSelectedPiece(null);
      setIsRankingMode(false);
    };
  }, []);


  const handleMoreTimeSetting = () => {
    navigation.replace('HostTimeSetting', { accountLogin, friend, selectedTime, match });
  };

  const handleFriend = () => {
    navigation.replace('HostFriend', { accountLogin, selectedTime, match });
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
        description: t.host_no_challenger,
        type: 'warning',
        systemNotification: true,
        pushState: notification,
        inapp: true
      });
      return;
    }
    navigation.navigate('HostMatch', {
      accountLogin,
      friend,
      selectedTime,
      isRankingMode,
      selectedPiece,
      match
    }); // Tạo màn hình custom
    setSelectedTime(t.host_time_default + ' ' + t.host_time_min);
    setFriend(null);
    setIsRankingMode(false);
    setSelectedPiece(null);
  };

  const handleChallengePress = (challenge: any) => {
    // Placeholder: Accept challenge or navigate to match screen
    // notify({
    //   message: t.noti_info,
    //   description: `${challenge.user.displayName} ${t.host_challenge_accepted}`,
    //   type: 'info',
    //   systemNotification: true,
    //   pushState: notification,
    //   inapp: true,
    // });
    // Example: Navigate to HostMatch with challenge user as friend
    navigation.navigate('HostMatch', {
      accountLogin,
      friend: challenge.user,
      selectedTime,
      isRankingMode,
      selectedPiece,
      match,
    });
  };

  const renderChallenge = ({ item }: { item: typeof mockChallenges[0] }) => (
    <TouchableOpacity style={styles.challengeContainer} onPress={() => handleChallengePress(item)}>
      <Image
        source={item.user.avatar || require('../images/user.png')}
        style={styles.challengeAvatar}
      />
      <View style={styles.challengeInfo}>
        <Text style={styles.challengeUserName}>{item.user.displayName}</Text>
        <Text style={styles.challengeTitle}>{t.host_challenge_title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={{ alignItems: 'center' }}>
      {/* Header */}
      <Header title={t.host} />

      {/* Id Room */}
      <View style={[styles.ranking_mode, { marginTop: "10%" }]}>
        <Text style={styles.ranking_mode_title}>{t.host_room_id}</Text>
        <TextInput
          style={styles.input}
          value={"Thay bằng match._id"}>
        </TextInput>
      </View>

      {/* Choose Friend */}
      <View style={styles.divider} />
      {/* <ButtonHostFriend accountFriend={friend} onPress={handleFriend} /> */}
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
        <Image source={accountLogin.avatarUrl ? { uri: accountLogin.avatarUrl } : require('../images/user.png')} style={styles.avatar} />
        <SwordIcon width={60} height={60} style={{ marginHorizontal: '10%' }} />
        <Image source={friend?.avatarFriend || require('../images/user_question_mark.png')} style={styles.avatar} />
      </View>

      {/* Button Time Setting */}
      {/* <View style={styles.divider} />
      <ButtonHostTime
        icon={RapidTimeIcon}
        title={selectedTime}
        onPress={handleMoreTimeSetting}
      /> */}

      {/* Ranking Game */}
      {/* <View style={styles.divider} />
      <View style={styles.ranking_mode}>
        <Text style={styles.ranking_mode_title}>{t.host_ranking_mode}</Text>
        <ToggleButtonNotification
          value={isRankingMode}
          onToggle={handleRankingMode}
        />
      </View> */}

      {/* Choose Piece */}
      {/* <View style={styles.divider} />
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
      </View> */}

      {/* Play Button */}
      <View style={styles.divider} />
      <Button_Save text={t.ai_button} onPress={handlePlay} />

      {/* List of Challenges */}
      <View style={styles.divider} />
      <View style={styles.challengesSection}>
        <Text style={styles.challengesTitle}>{t.host_challenges} ({challenges.length})</Text>
        {challenges.length > 0 ? (
          <FlatList
            data={challenges}
            renderItem={renderChallenge}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.challengesList}
            scrollEnabled={false}
          />
        ) : (
          <Text style={styles.noChallengesText}>{t.host_no_challenges}</Text>
        )}
      </View>

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
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 2,
    color: '#000',
    borderRadius: 5,
    borderWidth: 1,
    marginLeft: 50,
    borderColor: '#000'
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderColor: '#000',
    borderWidth: 1,
  },
  challengesSection: {
    width: '90%',
    marginVertical: 20,
  },
  challengesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  challengesList: {
    paddingVertical: 5,
  },
  challengeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  challengeAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  challengeInfo: {
    flex: 1,
  },
  challengeUserName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  challengeTitle: {
    fontSize: 14,
    color: '#666',
  },
  noChallengesText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
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
  input: {
    flex: 1,
    marginLeft: 50,
    fontSize: 16,
    paddingVertical: 2,
    color: 'white',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'white'
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderColor: 'white',
    borderWidth: 1,
  },
  challengesSection: {
    width: '90%',
    marginVertical: 20,
  },
  challengesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  challengesList: {
    paddingVertical: 5,
  },
  challengeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2c2c2c',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  challengeAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  challengeInfo: {
    flex: 1,
  },
  challengeUserName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  challengeTitle: {
    fontSize: 14,
    color: '#aaa',
  },
  noChallengesText: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
  },
});

export default HostScreen;
