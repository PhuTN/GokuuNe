import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { accounts, friends } from '../fake_data/Dien/fake_data';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useLanguage } from "../asycnc_store/LanguageContext";
import { useTheme } from "../asycnc_store/ThemeContext";
import { translations } from "../untils/i18n";
import { Card } from "react-native-paper";
import Button_AddFriend from '../components/common/Button_AddFriend';
import countries from 'world-countries';
import CountryFlag from 'react-native-country-flag';
import Header from '../components/common/Header';
import SearchIcon from '../assets/icons/search_icon.svg';
import LeaderBoardIcon from '../assets/icons/leader_board_icon.svg';
import AddFriendIcon from '../assets/icons/add_friend_icon.svg';
import PointIcon from '../assets/icons/point_icon.svg';
import MoreFunctionIcon from '../assets/icons/more_function_icon.svg';
import ChallengeIcon from '../assets/icons/challenge_icon.svg';

type Props = NativeStackScreenProps<RootStackParamList, 'Friends'>;

// Ánh xạ từ tên quốc gia sang mã ISO
const countryMap: Record<string, string> = countries.reduce((map, country) => {
    map[country.name.common] = country.cca2;
    return map;
}, {} as Record<string, string>);

const FriendsScreen = ({ route, navigation }: Props) => {
    const [accountLogin, setAccountLogin] = useState(route.params?.accountLogin ?? null);

    const accountFriends = friends.filter(friend => friend.idAccount === accountLogin.id);
    const [searchText, setSearchText] = useState('');
    const filteredFriends = searchText.trim() === ''
        ? accountFriends
        : accountFriends.filter(friend =>
            friend.usernameFriend.toLowerCase().includes(searchText.toLowerCase()) ||
            friend.nameFriend.toLowerCase().includes(searchText.toLowerCase())
        );
    const filteredAccounts = searchText.trim() === ''
        ? []
        : accounts.filter(account =>
            (account.id.toString() === searchText ||
                account.username.toLowerCase().includes(searchText.toLowerCase())) &&
            !accountFriends.some(friend => friend.idFriend === account.id) // Chỉ hiển thị những account chưa là bạn bè
        );

    const { language, toggleLanguage } = useLanguage();
    const t = translations[language];

    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';
    const styles = isDark ? darkStyles : lightStyles;

    // Lấy mã ISO từ tên quốc gia
    const countryCode = accountLogin?.country ? countryMap[accountLogin.country] || 'VN' : 'VN'; // Default là 'VN' nếu không tìm thấy

    const handleAddFriend = () => {
        // navigation.navigate('Login');
    };

    const handleMoreFunction = () => {
        // navigation.navigate('Login');
    };

    const handleChallenge = () => {
        // navigation.navigate('Login');
    };

    return (
        <View style={styles.scrollView}>
            {/* Header */}
            <Header title={t.friends} />

            {/* Search Box */}
            <View style={styles.searchBox}>
                <TextInput
                    style={styles.input}
                    value={searchText}
                    onChangeText={setSearchText}
                    placeholder={t.friends_searchbox_placeholder}
                    placeholderTextColor={isDark ? '#888' : '#666'}
                />
                <SearchIcon width={16} height={16} />
            </View>

            <View style={{ width: '100%', alignItems: 'center' }}>
                {searchText.trim() === '' && (
                    <View style={styles.friendsHeader}>
                        <Text style={styles.friendsTitle}>
                            {`${t.friends_title} (${filteredFriends.length})`}
                        </Text>
                        <TouchableOpacity style={styles.leaderboardBtn}>
                            <LeaderBoardIcon width={30} height={30} />
                            <Text style={styles.leaderboardText}>{t.friends_leaderboard}</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Friends List */}
                <FlatList
                    data={filteredFriends}
                    keyExtractor={(item) => item.idFriend.toString()}
                    style={styles.list}
                    renderItem={({ item }) => (
                        <Card style={styles.friendItem}>
                            <View style={styles.friendItemContent}>
                                <Image
                                    source={item.avatarFriend}
                                    style={styles.avatar}
                                />
                                <View style={styles.friendInfo}>
                                    <View style={styles.friendUsernameContainer}>
                                        <Text style={styles.friendUsername}>{item.usernameFriend}</Text>
                                        <CountryFlag isoCode={countryCode} size={15} style={styles.flag} />
                                    </View>
                                    <Text style={styles.friendName}>{item.nameFriend}</Text>
                                    <View style={styles.friendPoint}>
                                        <PointIcon width={15} height={15} />
                                        <Text style={styles.friendPointText}>{item.pointFriend}</Text>
                                    </View>
                                </View>
                                <View style={styles.buttonContainer}>
                                    <Button_AddFriend Icon={MoreFunctionIcon} onPress={handleMoreFunction} />
                                    <Button_AddFriend Icon={ChallengeIcon} onPress={handleChallenge} />
                                </View>
                            </View>
                        </Card>
                    )}
                />

                {/* Find Accounts List */}
                {searchText.trim() !== '' && (
                    <FlatList
                        data={filteredAccounts}
                        keyExtractor={(item) => item.id.toString()}
                        style={styles.list}
                        renderItem={({ item }) => (
                            <Card style={styles.friendItem}>
                                <View style={styles.friendItemContent}>
                                    <Image
                                        source={item.avatar}
                                        style={styles.avatar}
                                    />
                                    <View style={styles.friendInfo}>
                                        <View style={styles.friendUsernameContainer}>
                                            <Text style={styles.friendUsername}>{item.username}</Text>
                                            <CountryFlag isoCode={countryCode} size={15} style={styles.flag} />
                                        </View>
                                        <Text style={styles.friendName}>{item.name}</Text>
                                        <View style={styles.friendPoint}>
                                            <PointIcon width={15} height={15} />
                                            <Text style={styles.friendPointText}>{item.point}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.buttonContainer}>
                                        <Button_AddFriend Icon={AddFriendIcon} onPress={handleAddFriend} />
                                    </View>
                                </View>
                            </Card>
                        )}
                    />
                )}
            </View>
        </View>
    );
};

const lightStyles = StyleSheet.create({
    scrollView: {
        flex: 1,
        flexGrow: 1,
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
        fontSize: 16,
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
    },
    friendItem: {
        backgroundColor: '#fff',
        marginBottom: 10,
        borderRadius: 10,
        padding: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
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
        flexDirection: "row",
    },
    friendUsername: {
        fontSize: 16,
        fontWeight: "bold",
    },
    flag: {
        marginLeft: 5,
        alignSelf: 'center'
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
});

const darkStyles = StyleSheet.create({
    scrollView: {
        flex: 1,
        flexGrow: 1,
        alignItems: 'center',
        backgroundColor: "#535353",
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
        marginVertical: 30,
        width: '90%',
    },
    input: {
        flex: 1,
        fontSize: 16,
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
    },
    friendItem: {
        backgroundColor: "#535353",
        borderColor: 'white',
        borderWidth: 1,
        marginBottom: 10,
        borderRadius: 10,
        padding: 10,
        elevation: 2,
        shadowColor: 'white',
        shadowOffset: { width: 0, height: 2 },
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
        flexDirection: "row",
        alignItems: 'center'
    },
    friendUsername: {
        fontSize: 16,
        fontWeight: "bold",
        color: 'white'
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
});

export default FriendsScreen;