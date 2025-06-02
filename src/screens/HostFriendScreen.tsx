import React, {useState} from 'react';
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
  TouchableOpacity,
  View,
} from 'react-native';
import Header from '../components/common/Header';
import {accounts, friends} from '../fake_data/Dien/fake_data';
import SearchBlackIcon from '../assets/icons/search_black_icon.svg';
import SearchWhiteIcon from '../assets/icons/search_white_icon.svg';
import {Card} from 'react-native-paper';
import CountryFlag from 'react-native-country-flag';
import countries from 'world-countries';

type Props = NativeStackScreenProps<RootStackParamList, 'HostFriend'>;

// Ánh xạ từ tên quốc gia sang mã ISO
const countryMap: Record<string, string> = countries.reduce((map, country) => {
  map[country.name.common] = country.cca2;
  return map;
}, {} as Record<string, string>);

const HostFriendScreen = ({route, navigation}: Props) => {
  const {language, toggleLanguage} = useLanguage();
  const t = translations[language];

  const {theme, toggleTheme} = useTheme();
  const isDark = theme === 'dark';
  const styles = isDark ? darkStyles : lightStyles;

  const {notification, toggleNotification} = useNotification();

  const [selectedTime, setSelectedTime] = useState(
    route.params?.selectedTime ?? null,
  );
  const [accountLogin, setAccountLogin] = useState(
    route.params?.accountLogin ?? null,
  );
  const accountFriends = friends.filter(
    friend => friend.idAccount === accountLogin.id,
  );
  const [match, setMatch] = useState(route.params?.match ?? null);
  const [searchText, setSearchText] = useState('');
  const filteredFriends =
    searchText.trim() === ''
      ? accountFriends
      : accountFriends.filter(
          friend =>
            friend.idFriend.toString() === searchText || // Kiểm tra ID
            friend.usernameFriend
              .toLowerCase()
              .includes(searchText.toLowerCase()), // Tìm kiếm theo username
        );

  const handleChooseFriend = (friend: any) => {
    navigation.replace('Host', {accountLogin, selectedTime, friend, match});
  };

  return (
    <View style={styles.scrollView}>
      <Header title={t.host_friend} />

      {/* Search Box */}
      <View style={styles.searchBox}>
        <TextInput
          style={styles.input}
          value={searchText}
          onChangeText={setSearchText}
          placeholder={t.host_friend_search}
          placeholderTextColor={isDark ? '#888' : '#666'}
        />
        {!isDark ? (
          <SearchBlackIcon width={22} height={22} />
        ) : (
          <SearchWhiteIcon width={22} height={22} />
        )}
      </View>

      {/* No users found */}
      {searchText.trim() !== '' && filteredFriends.length === 0 && (
        <Text style={styles.noUserFound}>{t.host_friend_not_found}</Text>
      )}

      {searchText.trim() === '' && (
        <View style={styles.friendsHeader}>
          <Text style={styles.friendsTitle}>
            {`${t.friends_title} (${filteredFriends.length})`}
          </Text>
        </View>
      )}
      {/* Friends List */}
      <FlatList
        data={filteredFriends}
        keyExtractor={item => item.idFriend.toString()}
        style={styles.list}
        contentContainerStyle={{paddingBottom: 10}}
        renderItem={({item}) => (
          <TouchableOpacity onPress={() => handleChooseFriend(item)}>
            <Card style={styles.friendItem}>
              <View style={styles.friendItemContent}>
                <Image source={item.avatarFriend} style={styles.avatar} />
                <View style={styles.friendInfo}>
                  <View style={styles.friendUsernameContainer}>
                    <Text style={styles.friendUsername}>
                      {item.usernameFriend}
                    </Text>
                    <CountryFlag
                      isoCode={countryMap[item.countryFriend]}
                      size={25}
                      style={styles.flag}
                    />
                  </View>
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        )}
      />
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
  noUserFound: {
    fontSize: 16,
    color: 'black',
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
    width: 40,
    height: 40,
    borderRadius: 5,
    marginRight: 12,
  },
  friendInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  friendUsernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '80%', // Giới hạn chiều rộng để không đè lên icon
  },
  friendUsername: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  flag: {
    marginLeft: 5,
    borderRadius: 5,
    alignSelf: 'center',
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
  noUserFound: {
    fontSize: 16,
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
    width: 40,
    height: 40,
    borderRadius: 5,
    marginRight: 12,
  },
  friendInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  friendUsernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '80%', // Giới hạn chiều rộng để không đè lên icon
  },
  friendUsername: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  flag: {
    marginLeft: 5,
    borderRadius: 5,
    alignSelf: 'center',
  },
});

export default HostFriendScreen;
