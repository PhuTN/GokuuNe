import React, {useCallback, useEffect, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/AppNavigator';
import {useLanguage} from '../asycnc_store/LanguageContext';
import {useTheme} from '../asycnc_store/ThemeContext';
import {translations} from '../untils/i18n';
import {notify} from '../untils/Notify';
import {useNotification} from '../asycnc_store/NotificationContext';
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
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
import {TouchableOpacity} from 'react-native';
import HostMoreFunctionModal from '../components/common/HostScreen/HostMoreFunctionModal';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import api from '../api/api';
import { getUserById, outChallenge } from '../api/userApi';
import { socket } from '../untils/socket';

// Mock data for challenges

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
  const [match, setMatch] = useState(route.params?.match ?? null);

  const [isRankingMode, setIsRankingMode] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string>(
    route.params?.selectedTime ?? null,
  );
  const [selectedPiece, setSelectedPiece] = useState<string | null>(null);

  const [modalMoreFunctionVisible, setMoreFunctionVisible] = useState(false);


  const [selectedChallenge, setSelectedChallenge] = useState();

  const [challenges, setChallenges] = useState([]);

  const [waitUserId, setWaitUserId] = useState<string | null>(null);
const [waitUser, setWaitUser] = useState<any>(null);

const fetchUser = useCallback(async () => {
  try {
    console.log('🔁 Đang refresh dữ liệu từ challenge:refresh...');

    const userJson = await AsyncStorage.getItem('currentUser');
    const currentUser = userJson ? JSON.parse(userJson) : null;
    if (!currentUser?._id) return;

    const userData = await getUserById(currentUser._id);
    setAccountLogin(userData);
console.log("1",userData)
    const formattedChallenges = userData.challenges?.map((challenge: any) => ({
      id: challenge._id,
      user: {
        _id: challenge.challengerId._id,
        displayName: challenge.challengerId.displayName,
        avatar: challenge.challengerId.avatarUrl,
      },
      createdAt: challenge.createdAt,
    })) || [];
 setWaitUser(userData.waitId);
    setChallenges(formattedChallenges);
    setWaitUserId(userData.waitId);
    if (userData.waitId) setWaitUser(userData.waitId); // nếu đã populate sẵn
  } catch (err) {
    console.error('❌ Lỗi khi fetchUser trong socket:', err);
  }
}, []);


useEffect(() => {
  const handleRefresh = (userId: string) => {
    console.log('📥 Nhận challenge:refresh từ socket:', userId);
    // Gọi lại logic fetch user hoặc challenges
    fetchUser(); // nhớ khai báo hàm này bên ngoài useEffect hoặc dùng useCallback
  };

  socket.on('challenge:refresh', handleRefresh);

  return () => {
    socket.off('challenge:refresh', handleRefresh); // cleanup khi component unmount
  };
}, []);

useFocusEffect(
  React.useCallback(() => {
    let currentUserId = '';
    let currentWaitUserId = '';

    const fetchUser = async () => {
      try {
        const userJson = await AsyncStorage.getItem('currentUser');
        const currentUser = userJson ? JSON.parse(userJson) : null;
        if (!currentUser?._id) return;

        currentUserId = currentUser._id;

        const userData = await getUserById(currentUser._id);
        setAccountLogin(userData);

        const formattedChallenges = userData.challenges?.map((challenge: any) => ({
          id: challenge._id,
          user: {
            _id: challenge.challengerId._id,
            displayName: challenge.challengerId.displayName,
            avatar: challenge.challengerId.avatarUrl,
          },
          createdAt: challenge.createdAt,
        })) || [];
        setChallenges(formattedChallenges);

        if (userData.waitId && typeof userData.waitId === 'object') {
          setWaitUser(userData.waitId);
          setWaitUserId(userData.waitId._id);
          currentWaitUserId = userData.waitId._id;
        } else {
          setWaitUser(null);
          setWaitUserId(null);
        }
      } catch (err) {
        console.error('❌ Lỗi khi fetch user:', err);
      }
    };

    fetchUser();

    return () => {
      const clearChallenge = async () => {
        try {
          if (currentUserId) {
            await outChallenge(currentUserId);
            socket.emit('challenge:refresh', currentUserId);
            console.log("MEEEEE", currentUserId,currentWaitUserId)
            if (currentWaitUserId) {
              socket.emit('challenge:refresh', currentWaitUserId);
            }
            console.log('🧹 Đã gọi outChallenge và emit refresh');
          }
        } catch (err) {
          console.error('❌ Lỗi khi gọi outChallenge:', err);
        }
      };

      clearChallenge();
    };
  }, [])
);


  useEffect(() => {
    return () => {
      setSelectedTime(`${t.host_time_default} ${t.host_time_min}`);
      setFriend(null);
      setSelectedPiece(null);
      setIsRankingMode(false);
    };
  }, []);

  const handleMoreTimeSetting = () => {
    navigation.replace('HostTimeSetting', {
      accountLogin,
      friend,
      selectedTime,
      match,
    });
  };

  const handleFriend = () => {
    navigation.replace('HostFriend', {accountLogin, selectedTime, match});
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
  if (!waitUser || waitUser.waitId !== accountLogin._id) return;

  const fromUser = accountLogin._id;
  const toUser = waitUser._id;
console.log(fromUser,toUser)

  socket.emit("custom:play", {
    fromUser,
    toUser,
  });

  console.log("📤 Gửi lời mời custom play tới:", toUser);

  // 👉 Tự chuyển màn hình luôn (người mời)
  navigation.navigate("HostMatch", {
    user: fromUser,
    opponent: toUser,
  });
};


useEffect(() => {
  const handlePlay = ({ fromUser }: { fromUser: string }) => {
    const userId = accountLogin?._id;
    if (!userId || !fromUser) return;

    console.log("🎮 Nhận custom play từ:", fromUser);

    navigation.navigate("HostMatch", {
      user: userId,
      opponent: fromUser,
    });
  };

  socket.on("custom:play", handlePlay);

  return () => {
    socket.off("custom:play", handlePlay);
  };
}, [accountLogin, navigation]);

 


  const handleChallengePress = (challenge: any) => {
    setMoreFunctionVisible(true);
    setSelectedChallenge(challenge);
  };


 const renderChallenge = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.challengeContainer}
      onPress={() => handleChallengePress(item)}>
    <Image
      source={
        item.user.avatar && item.user.avatar.startsWith('http')
          ? { uri: item.user.avatar }
          : require('../images/user.png')
      }
      style={styles.challengeAvatar}
    />
      <View style={styles.challengeInfo}>
        <Text style={styles.challengeUserName}>{item.user.displayName}</Text>
        <Text style={styles.challengeTitle}>{t.host_challenge_title}</Text>
      </View>
    </TouchableOpacity>
  );

  const [roomId, setRoomId] = useState('');

  const handleJoinRoom = () => {
    if (!roomId.trim()) {
      notify({
        message: t.noti_warning,
        description: t.host_room_id_required,
        type: 'warning',
        systemNotification: true,
        pushState: notification,
        inapp: true,
      });
      return;
    }
    //Tiếp tục code chức năng tham gia phòng
  };

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={{alignItems: 'center'}}>
      {/* Header */}
      <Header title={t.host} />

      {/* Id Room */}
      {/* <View style={[styles.ranking_mode, {marginTop: '10%'}]}>
        <Text style={styles.ranking_mode_title}>{t.host_room_id}</Text>
        <TextInput
          style={styles.input}
          value={'Thay bằng match._id'}></TextInput>
      </View> */}

      {/* Join Room */}
      {/* <View style={styles.divider} />
      <View>
        <View style={styles.ranking_mode}>
          <Text style={styles.ranking_mode_title}>{t.host_join_room}</Text>
          <TextInput
            style={styles.input}
            value={roomId}
            onChangeText={setRoomId}
            placeholder={t.host_enter_room_id}
            placeholderTextColor={isDark ? '#999' : '#aaa'}
          />
        </View>

        <TouchableOpacity onPress={handleJoinRoom}>
          <LinearGradient
            colors={['#6B50F6', '#CC8FED']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.buttonJoin}>
            <Text style={styles.buttonJoinText}>{t.host_join}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View> */}

      {/* Choose Friend */}
      <View style= {{marginTop:50}}/>
      {/* <ButtonHostFriend accountFriend={friend} onPress={handleFriend} /> */}
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignSelf: 'center',
        }}>
        <View style={{flexDirection: 'column', alignItems: 'center'}}>
          <Image
            source={
              accountLogin.avatarUrl
                ? {uri: accountLogin.avatarUrl}
                : require('../images/user.png')
            }
            style={styles.avatar}
          />
          <Text style={styles.ranking_mode_title}>
            {accountLogin?.displayName || t.home_guest}
          </Text>
        </View>
        <SwordIcon width={60} height={60} style={{marginHorizontal: '10%'}} />
        <View style={{flexDirection: 'column', alignItems: 'center'}}>
          <Image
  source={
    waitUser?.avatarUrl
      ? {uri: waitUser.avatarUrl}
      : require('../images/user_question_mark.png')
  }
  style={styles.avatar}
/>
<Text style={styles.ranking_mode_title}>
  {waitUser?.displayName || t.home_guest}
</Text>

         
        </View>
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
<Button_Save
  text={
    !waitUser
      ? language === 'vi'
        ? 'Chưa có đối thủ'
        : 'No opponent yet'
      : waitUser.waitId !== accountLogin._id
        ? language === 'vi'
          ? 'Đối phương chưa chấp nhận'
          : "Opponent hasn't accepted"
        : t.ai_button
  }
  onPress={handlePlay}
  disabled={!waitUser || waitUser.waitId !== accountLogin._id}
/>



      {/* List of Challenges */}
      <View style={styles.divider} />
      <View style={styles.challengesSection}>
        <Text style={styles.challengesTitle}>
          {t.host_challenges} ({challenges.length})
        </Text>
        {challenges.length > 0 ? (
          <FlatList
            data={challenges}
            renderItem={renderChallenge}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.challengesList}
            scrollEnabled={false}
          />
        ) : (
          <Text style={styles.noChallengesText}>{t.host_no_challenges}</Text>
        )}
      </View>

    
   <HostMoreFunctionModal
     visible={modalMoreFunctionVisible}
        setModalVisible={setMoreFunctionVisible}
        onClose={() => setMoreFunctionVisible(false)}
        challenge={selectedChallenge}
  userId={accountLogin._id}
  opponentId={selectedChallenge?.user._id}
/>

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
    padding: 5,
    color: '#000',
    borderRadius: 5,
    borderWidth: 1,
    marginLeft: 50,
    borderColor: '#ccc',
    backgroundColor: '#fff',
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
    marginBottom: '5%',
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
  buttonJoin: {
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: '5%',
    width: '100%',
  },
  buttonJoinText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
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
    padding: 5,
    color: 'white',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'white',
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
    backgroundColor: '#535353',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: 'white',
    marginBottom: '5%',
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
    color: 'white',
  },
  noChallengesText: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
  },
  buttonJoin: {
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: '5%',
    width: '100%',
  },
  buttonJoinText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default HostScreen;
