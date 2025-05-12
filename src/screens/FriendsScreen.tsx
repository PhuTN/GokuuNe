import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Image, Modal, TouchableWithoutFeedback } from 'react-native';
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
import SearchBlackIcon from '../assets/icons/search_black_icon.svg';
import SearchWhiteIcon from '../assets/icons/search_white_icon.svg';
import LeaderBoardIcon from '../assets/icons/leader_board_icon.svg';
import AddFriendIcon from '../assets/icons/add_friend_icon.svg';
import PointIcon from '../assets/icons/point_icon.svg';
import MoreFunctionIcon from '../assets/icons/more_function_icon.svg';
import ChallengeIcon from '../assets/icons/challenge_icon.svg';
import { notify } from '../untils/notify';
import { useNotification } from '../asycnc_store/NotificationContext';

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
            friend.idFriend.toString() === searchText || // Kiểm tra ID
            friend.usernameFriend.toLowerCase().includes(searchText.toLowerCase()) // Tìm kiếm theo username
        );
    const filteredAccounts = searchText.trim() === ''
        ? []
        : accounts.filter(account =>
            (account.id.toString() === searchText || // Kiểm tra ID
                account.username.toLowerCase().includes(searchText.toLowerCase())) && // Tìm kiếm theo username
            !accountFriends.some(friend => friend.idFriend === account.id) && // Chỉ hiển thị những account chưa là bạn bè
            account.id !== accountLogin.id // Loại bỏ accountLogin
        );

    const { language, toggleLanguage } = useLanguage();
    const t = translations[language];

    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';
    const styles = isDark ? darkStyles : lightStyles;

    const { notification, toggleNotification } = useNotification();

    // Lấy mã ISO từ tên quốc gia
    const countryCode = accountLogin?.country ? countryMap[accountLogin.country] || 'VN' : 'VN'; // Default là 'VN' nếu không tìm thấy

    const [isMoreModalVisible, setMoreModalVisible] = useState(false);
    const [selectedFriend, setSelectedFriend] = useState(null);

    const openMoreModal = (friend: any) => {
        setSelectedFriend(friend);
        setMoreModalVisible(true);
    };

    const closeMoreModal = () => {
        setSelectedFriend(null);
        setMoreModalVisible(false);
    };

    const handleAddFriend = () => {
        notify({
            message: t.noti_success,
            description: t.noti_friends_add_new,
            type: 'success',
            systemNotification: true,
            pushState: notification,
        });
    };

    const handleMoreFunction = (friend: any) => {
        openMoreModal(friend);
    };

    const handleMoreFunctionChallenge = () => {
        notify({
            message: t.noti_info,
            description: t.noti_go_friends_challenge,
            type: 'info',
            systemNotification: true,
            pushState: notification,
        });
        navigation.navigate('Host', { accountLogin, friend: selectedFriend });
        closeMoreModal();
    };

    const handleMoreFunctionSendMessage = () => {
        notify({
            message: t.noti_info,
            description: t.noti_go_friends_message,
            type: 'info',
            systemNotification: true,
            pushState: notification,
        });
        navigation.navigate('ChatDetail', { accountLogin, friend: selectedFriend });
        closeMoreModal();
    };

    const handleMoreFunctionUnfriend = (friend: any) => {
        notify({
            message: t.noti_success,
            description: t.noti_friends_remove_success,
            type: 'success',
            systemNotification: true,
            pushState: notification,
        });
        closeMoreModal();
        // hàm xóa friend
    };

    const handleChallenge = (friend: any) => {
        notify({
            message: t.noti_info,
            description: t.noti_go_friends_challenge,
            type: 'info',
            systemNotification: true,
            pushState: notification,
        });
        navigation.navigate('Host', { accountLogin, friend });
    };

    const handleLeaderBoard = () => {
        notify({
            message: t.noti_info,
            description: t.noti_go_leader_board,
            type: 'info',
            systemNotification: true,
            pushState: notification,
        });
        navigation.navigate('FriendLeaderBoard', { accountLogin });
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
                {!isDark ? (
                    <SearchBlackIcon width={22} height={22} />
                ) : (
                    <SearchWhiteIcon width={22} height={22} />
                )}
            </View>

            {/* No users found */}
            {searchText.trim() !== '' && filteredFriends.length === 0 && filteredAccounts.length === 0 && (
                <Text style={styles.noUserFound}>{t.friends_no_user_found}</Text>
            )}

            <View style={{ width: '100%', alignItems: 'center' }}>
                {searchText.trim() === '' && (
                    <View style={styles.friendsHeader}>
                        <Text style={styles.friendsTitle}>
                            {`${t.friends_title} (${filteredFriends.length})`}
                        </Text>
                        <TouchableOpacity style={styles.leaderboardBtn} onPress={handleLeaderBoard}>
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
                                    <Button_AddFriend Icon={MoreFunctionIcon} onPress={() => handleMoreFunction(item)} />
                                    <Button_AddFriend Icon={ChallengeIcon} onPress={() => handleChallenge(item)} />
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

            <Modal
                visible={isMoreModalVisible}
                transparent
                animationType="fade"
                onRequestClose={closeMoreModal}
            >
                <TouchableWithoutFeedback onPress={closeMoreModal}>
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback onPress={() => { }}>
                            <View style={styles.modalContainer}>
                                <TouchableOpacity onPress={handleMoreFunctionChallenge}>
                                    <Text style={styles.modalOption}>{t.friends_challenge}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleMoreFunctionSendMessage}>
                                    <Text style={styles.modalOption}>{t.friends_send_message}</Text>
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
        color: 'black'
    },
    noUserFound: {
        fontSize: 16,
        color: "black"
    }
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
        color: 'white'
    },
    noUserFound: {
        fontSize: 16,
        color: "white"
    }
});

export default FriendsScreen;