import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFriendRequests, respondToFriendRequest } from '../api/userApi';
import Header from '../components/common/Header';
import { Card } from 'react-native-paper';
import { useLanguage } from '../asycnc_store/LanguageContext';
import { useTheme } from '../asycnc_store/ThemeContext';
import Button_AddFriend from '../components/common/Button_AddFriend';
import AddFriendIcon from '../assets/icons/add_friend_icon.svg';
import BackIcon from '../assets/icons/back_icon.svg';
import PointIcon from '../assets/icons/point_icon.svg';

const FriendRequestScreen = () => {
  const [requests, setRequests] = useState([]);
  const [accountLogin, setAccountLogin] = useState(null);
  const { language } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const styles = isDark ? darkStyles : lightStyles;

  const fetchRequests = async (userId) => {
    try {
      const result = await getFriendRequests(userId);
      setRequests(result);
    } catch (err) {
      console.error('❌ Failed to fetch requests:', err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const fetchUser = async () => {
        const userStr = await AsyncStorage.getItem('currentUser');
        if (userStr) {
          const user = JSON.parse(userStr);
          setAccountLogin(user);
          fetchRequests(user._id);
        }
      };
      fetchUser();
    }, [])
  );

  const handleRespond = async (fromUserId, accepted) => {
    try {
      await respondToFriendRequest(fromUserId, accountLogin._id, accepted);
      fetchRequests(accountLogin._id);
    } catch (err) {
      console.error('❌ Respond error:', err);
    }
  };

  if (!accountLogin) {
    return (
      <Text style={{ marginTop: 50, textAlign: 'center', color: isDark ? 'white' : 'black' }}>
        {language === 'vi' ? 'Đang tải dữ liệu người dùng...' : 'Loading user data...'}
      </Text>
    );
  }

  return (
    <View style={styles.scrollView}>
      <Header title={language === 'vi' ? 'Yêu cầu kết bạn' : 'Friend Requests'} />

      <FlatList
        data={requests}
        keyExtractor={(item) => item.friendId._id}
        style={styles.list}
        contentContainerStyle={{ paddingBottom: 10 }}
        renderItem={({ item }) => (
          <Card style={styles.friendItem}>
            <View style={styles.friendItemContent}>
              <Image
                source={item.friendId.avatarUrl ? { uri: item.friendId.avatarUrl } : require('../images/user.png')}
                style={styles.avatar}
              />
              <View style={styles.friendInfo}>
                <View style={styles.friendUsernameContainer}>
                  <Text style={styles.friendUsername}>ID: {item.friendId._id}</Text>
                </View>
                <Text style={styles.friendName}>{item.friendId.displayName || (language === 'vi' ? 'Chưa đặt tên' : 'Unnamed User')}</Text>
                <View style={styles.friendPoint}>
                  <PointIcon width={15} height={15} />
                  <Text style={styles.friendPointText}>{item.friendId.elo ?? 0}</Text>
                </View>
              </View>
              <View style={styles.buttonContainer}>
                <Button_AddFriend Icon={AddFriendIcon} onPress={() => handleRespond(item.friendId._id, true)} />
                <Button_AddFriend Icon={BackIcon} onPress={() => handleRespond(item.friendId._id, false)} />
              </View>
            </View>
          </Card>
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
        alignSelf: 'center',
        alignItems: "center",
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
        marginTop:50
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
        alignItems: "center",
    },
    friendUsername: {
        fontSize: 10,
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
        alignItems: 'center',
        backgroundColor: "#535353",
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: "center",
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
        marginBottom: 20,
        marginTop:50
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
        fontSize: 10,
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

export default FriendRequestScreen;
