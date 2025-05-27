import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import {RootStackParamList} from '../navigation/AppNavigator';
import {friends} from '../fake_data/Dien/fake_data';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useLanguage} from '../asycnc_store/LanguageContext';
import {useTheme} from '../asycnc_store/ThemeContext';
import {translations} from '../untils/i18n';
import {Card} from 'react-native-paper';
import Button_AddFriend from '../components/common/Button/Button_AddFriend';
import countries from 'world-countries';
import CountryFlag from 'react-native-country-flag';
import Header from '../components/common/Header';
import SearchBlackIcon from '../assets/icons/search_black_icon.svg';
import SearchWhiteIcon from '../assets/icons/search_white_icon.svg';
import LeaderBoardIcon from '../assets/icons/leader_board_icon.svg';
import AddFriendIcon from '../assets/icons/add_friend_icon.svg';
import PointIcon from '../assets/icons/point_icon.svg';
import MoreFunctionIcon from '../assets/icons/more_function_icon.svg';
import ChallengeIcon from '../assets/icons/challenge_icon.svg';
import {notify} from '../untils/Notify';
import {useNotification} from '../asycnc_store/NotificationContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import {searchUsers, sendFriendRequest} from '../api/userApi';

type Props = NativeStackScreenProps<RootStackParamList, 'Friends'>;

const countryMap: Record<string, string> = countries.reduce((map, country) => {
  map[country.name.common] = country.cca2;
  return map;
}, {} as Record<string, string>);

const FriendsScreen = ({navigation}: Props) => {
  const [accountLogin, setAccountLogin] = useState<any>(null);
  const [searchText, setSearchText] = useState('');
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [isMoreModalVisible, setMoreModalVisible] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  const {language} = useLanguage();
  const t = translations[language];
  const {theme} = useTheme();
  const isDark = theme === 'dark';
  const styles = isDark ? darkStyles : lightStyles;
  const {notification} = useNotification();
  const [selectedTime, setSelectedTime] = useState<string>(
    `${t.host_time_default} ${t.host_time_min}`,
  );

  useFocusEffect(
    useCallback(() => {
      const fetchUser = async () => {
        const userStr = await AsyncStorage.getItem('currentUser');
        if (userStr) {
          const user = JSON.parse(userStr);
          setAccountLogin(user);
        }
      };
      fetchUser();
    }, []),
  );

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchText.trim() !== '' && accountLogin?._id) {
        try {
          const results = await searchUsers(searchText, accountLogin._id);
          const mapped = results.map((u: any) => ({
            id: u._id ?? '',
            username: u._id ?? 'unknown', // Hiển thị _id làm username
            name: u.displayName || 'Chưa cập nhật',
            point: u.elo ?? 0,
            avatar: u.avatarUrl
              ? {uri: u.avatarUrl}
              : require('../images/user.png'),
            //    country: countryMap[u.nationality ?? ''] ?? 'US',
          }));
          setFilteredAccounts(mapped);
        } catch (err) {
          console.error('Lỗi khi tìm kiếm bạn bè:', err);
          setFilteredAccounts([]);
        }
      } else {
        setFilteredAccounts([]);
      }
    };

    fetchSearchResults();
  }, [searchText, accountLogin]);

  if (!accountLogin) {
    return (
      <Text
        style={{
          marginTop: 50,
          textAlign: 'center',
          color: isDark ? 'white' : 'black',
        }}>
        Đang tải thông tin người dùng...
      </Text>
    );
  }

  const accountFriends = friends.filter(
    friend => friend.idAccount === accountLogin.id,
  );
  const filteredFriends = searchText.trim() === '' ? accountFriends : [];

  const openMoreModal = (friend: any) => {
    setSelectedFriend(friend);
    setMoreModalVisible(true);
  };

  const closeMoreModal = () => {
    setSelectedFriend(null);
    setMoreModalVisible(false);
  };

  const handleAddFriend = async (toUserId: string) => {
    try {
      console.log('HELLO');
      await sendFriendRequest(accountLogin._id, toUserId);

      notify({
        message: t.noti_success,
        description: t.noti_friends_add_new,
        type: 'success',
        systemNotification: true,
        pushState: notification,
      });

      // 🔁 Gọi lại tìm kiếm sau khi gửi lời mời
      const result = await searchUsers(searchText, accountLogin._id);
      const mapped = result.map((u: any) => ({
        id: u._id ?? '',
        username: u._id ?? 'unknown',
        name: u.displayName || 'Chưa cập nhật',
        point: u.elo ?? 0,
        avatar: u.avatarUrl
          ? {uri: u.avatarUrl}
          : require('../images/user.png'),
        country: countryMap[u.nationality || 'Vietnam'] || 'VN',
      }));
      setFilteredAccounts(mapped);
    } catch (err: any) {}
  };

  const handleMoreFunctionChallenge = () => {
    navigation.navigate('Host', {
      accountLogin,
      friend: selectedFriend,
      selectedTime,
    });
    closeMoreModal();
  };

  const handleMoreFunctionSendMessage = () => {
    navigation.navigate('ChatDetail', {accountLogin, friend: selectedFriend});
    closeMoreModal();
  };

  const handleMoreFunctionUnfriend = () => {
    closeMoreModal();
  };

  const handleChallenge = (friend: any) => {
    navigation.navigate('Host', {accountLogin, selectedTime, friend});
  };

  const handleLeaderBoard = () => {
    navigation.navigate('FriendLeaderBoard', {accountLogin});
  };

  return (
    <View style={styles.scrollView}>
      <Header title={t.friends} />

      <View style={styles.searchBox}>
        <TextInput
          style={styles.input}
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

      {/* Nếu searchText rỗng, hiển thị danh sách bạn bè hiện có */}
      {searchText.trim() === '' && (
        <View style={{width: '100%', alignItems: 'center'}}>
          <View style={styles.friendsHeader}>
            {/* <Text style={styles.friendsTitle}>{`${t.friends_title} (${filteredFriends.length})`}</Text> */}
            {/* <TouchableOpacity style={styles.leaderboardBtn} onPress={handleLeaderBoard}>
                            <LeaderBoardIcon width={30} height={30} />
                            <Text style={styles.leaderboardText}>{t.friends_leaderboard}</Text>
                        </TouchableOpacity> */}
          </View>
          <FlatList
            data={filteredFriends}
            keyExtractor={item => item.idFriend.toString()}
            style={styles.list}
            contentContainerStyle={{paddingBottom: 10}}
            renderItem={({item}) => (
              <Card style={styles.friendItem}>
                <View style={styles.friendItemContent}>
                  <Image source={item.avatarFriend} style={styles.avatar} />
                  <View style={styles.friendInfo}>
                    <View style={styles.friendUsernameContainer}>
                      <Text style={styles.friendUsername}>
                        {item.usernameFriend}
                      </Text>
                      {/* <CountryFlag isoCode={countryMap[item.countryFriend]} size={15} style={styles.flag} /> */}
                    </View>
                    <Text style={styles.friendName}>{item.nameFriend}</Text>
                    <View style={styles.friendPoint}>
                      <PointIcon width={15} height={15} />
                      <Text style={styles.friendPointText}>
                        {item.pointFriend}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.buttonContainer}>
                    <Button_AddFriend
                      Icon={AddFriendIcon}
                      onPress={() => handleAddFriend(item.id)}
                    />
                    <Button_AddFriend
                      Icon={ChallengeIcon}
                      onPress={() => handleChallenge(item)}
                    />
                  </View>
                </View>
              </Card>
            )}
          />
        </View>
      )}

      {/* Khi có searchText, chỉ hiển thị danh sách user (filteredAccounts) */}
      {searchText.trim() !== '' && (
        <FlatList
          data={filteredAccounts}
          keyExtractor={item => item.id.toString()}
          style={styles.list}
          contentContainerStyle={{paddingBottom: 10}}
          renderItem={({item}) => (
            <Card style={styles.friendItem}>
              <View style={styles.friendItemContent}>
                <Image source={item.avatar} style={styles.avatar} />
                <View style={styles.friendInfo}>
                  <View style={styles.friendUsernameContainer}>
                    <Text style={styles.friendUsername}>
                      ID: {item.username}
                    </Text>
                    {/* <CountryFlag isoCode={countryMap[item.country]} size={15} style={styles.flag} /> */}
                  </View>
                  <Text style={styles.friendName}>{item.name}</Text>
                  <View style={styles.friendPoint}>
                    <PointIcon width={15} height={15} />
                    <Text style={styles.friendPointText}>{item.point}</Text>
                  </View>
                </View>
                <View style={styles.buttonContainer}>
                  <Button_AddFriend
                    Icon={AddFriendIcon}
                    onPress={() => handleAddFriend(item.id)}
                  />
                </View>
              </View>
            </Card>
          )}
        />
      )}

      <Modal
        visible={isMoreModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeMoreModal}>
        <TouchableWithoutFeedback onPress={closeMoreModal}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.modalContainer}>
                <TouchableOpacity onPress={handleMoreFunctionChallenge}>
                  <Text style={styles.modalOption}>{t.friends_challenge}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleMoreFunctionSendMessage}>
                  <Text style={styles.modalOption}>
                    {t.friends_send_message}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleMoreFunctionUnfriend}>
                  <Text style={styles.modalOption}>{t.friends_unfriend}</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const lightStyles = StyleSheet.create({
  scrollView: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  searchBox: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    marginVertical: 30,
    width: '90%',
  },
  input: {
    flex: 1,
    fontSize: 12,
    paddingVertical: 8,
    color: '#000',
  },
  friendsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    marginBottom: 10,
  },
  friendsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  leaderboardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leaderboardText: {
    fontSize: 16,
    marginLeft: 5,
    color: '#000',
  },
  list: {
    width: '90%',
    marginBottom: 20,
  },
  friendItem: {
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  friendItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 12,
  },
  friendInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  friendName: {
    fontSize: 14,
    color: '#000',
  },
  friendUsernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  friendUsername: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  flag: {
    marginLeft: 5,
    alignSelf: 'center',
  },
  friendPoint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  friendPointText: {
    fontSize: 12,
    marginLeft: 4,
    color: '#000',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#F5F5F5',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalOption: {
    fontSize: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    color: 'black',
  },
  noUserFound: {
    fontSize: 16,
    color: 'black',
  },
});

const darkStyles = StyleSheet.create({
  scrollView: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#535353',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: '#535353',
    paddingHorizontal: 10,
    marginVertical: 30,
    width: '90%',
  },
  input: {
    flex: 1,
    fontSize: 12,
    paddingVertical: 8,
    color: 'white',
  },
  friendsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    marginBottom: 10,
  },
  friendsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  leaderboardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leaderboardText: {
    fontSize: 16,
    marginLeft: 5,
    color: '#fff',
  },
  list: {
    width: '90%',
    marginBottom: 20,
  },
  friendItem: {
    backgroundColor: '#535353',
    borderColor: 'white',
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    shadowColor: 'white',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  friendItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 12,
  },
  friendInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  friendName: {
    fontSize: 14,
    color: 'white',
  },
  friendUsernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  friendUsername: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  flag: {
    marginLeft: 5,
  },
  friendPoint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  friendPointText: {
    fontSize: 12,
    marginLeft: 4,
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#535353',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalOption: {
    fontSize: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    color: 'white',
  },
  noUserFound: {
    fontSize: 16,
    color: 'white',
  },
});

export default FriendsScreen;
