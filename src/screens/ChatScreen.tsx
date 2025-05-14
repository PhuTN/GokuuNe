import React, {useCallback, useEffect, useState} from 'react';
import {View, FlatList, StyleSheet, Text, ImageBackground} from 'react-native';
import ChatHeader from '../components/common/ChatScreen/ChatHeader';
import SearchBar from '../components/common/ChatScreen/SearchBar';
import SectionLabel from '../components/common/ChatScreen/SectionLabel';
import ActiveUserItem from '../components/common/ChatScreen/ActiveUserItem';
import ChatCardItem from '../components/common/ChatScreen/ChatCardItem';
import {activeUsers, recentChats} from '../fake_data/Phuc/fake_data';
import {useTheme} from '../asycnc_store/ThemeContext';
import {useLanguage} from '../asycnc_store/LanguageContext';
import {translations} from '../untils/i18n';
import ScreenHeader from '../components/common/ScreenHeader';
import Header from '../components/common/Header';
import { getUserById } from '../api/userApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserConversations } from '../api/messageApi';
import { useFocusEffect } from '@react-navigation/native';
import { socket } from '../untils/socket';

export default function ChatScreen({navigation}) {
  const { theme } = useTheme();
const isDark = theme === 'dark';
const { language } = useLanguage();
const t = translations[language];
const [chats, setChats] = useState([]);  
const [searchQuery, setSearchQuery] = useState('');
const [currentUser, setCurrentUser] = useState(null);
const [currentUserDetail, setCurrentUserDetail] = useState(null);

// 🟢 Lấy currentUser từ AsyncStorage khi vào màn
useEffect(() => {
  const loadCurrentUser = async () => {
    try {
      const userJson = await AsyncStorage.getItem('currentUser');
     
      const user = userJson ? JSON.parse(userJson) : null;

       console.log(user,2)
      setCurrentUser(user);
    } catch (error) {
      console.error("Lỗi khi load current user:", error);
    }
  };

  loadCurrentUser();
}, []);

// 🟢 Khi có currentUser → gọi API lấy chi tiết + friends
useEffect(() => {
  const fetchFriends = async () => {
    try {
      if (currentUser?._id) {
        const userDetail = await getUserById(currentUser._id);
        setCurrentUserDetail(userDetail);   // có luôn friends
      }
    } catch (error) {
      console.error("Lỗi khi lấy friends:", error);
    }
  };

  fetchFriends();
}, [currentUser]);

// 🟢 Lọc danh sách bạn bè đã là friend + search theo displayName
const filteredUsers = (currentUserDetail?.friends ?? [])
    .filter(f => f.status === 'friend' && f.friendId && f.friendId.onlineStatus === 'online') // ✅ thêm check online
    .map(f => f.friendId)
    .filter(user =>
        user?.displayName &&
        user.displayName.trim().toLowerCase().includes(searchQuery.trim().toLowerCase())
    );



// 🟢 Giữ nguyên nếu bạn vẫn dùng recentChats (hoặc thay sau)
useFocusEffect(
  useCallback(() => {
    const fetchChats = async () => {
      try {
        const currentUser = await AsyncStorage.getItem('currentUser');
        const user = currentUser ? JSON.parse(currentUser) : null;
        if (user && user._id) {
          const conversations = await getUserConversations(user._id);
          setChats(conversations);
        }
      } catch (err) {
        console.error('Lỗi khi load conversations:', err);
      }
    };

    fetchChats();
  }, [])
);

// ✅ filteredChats dùng để lọc theo search
const filteredChats = chats.filter(chat =>
    chat.friend?.displayName?.toLowerCase().includes(searchQuery.toLowerCase())
);
console.log("HEE", chats)
console.log(filteredChats)
useEffect(() => {
    const handleChatUpdate = () => {
        console.log("📥 [ChatScreen] Có chat mới, reload conversations");
        // Gọi lại fetchChats
        if (currentUser?._id) {
            getUserConversations(currentUser._id).then(setChats).catch(err => {
                console.error('Lỗi khi reload conversations:', err);
            });
        }
    };

    socket.on("chat:list:refresh", handleChatUpdate);

    return () => {
        socket.off("chat:list:refresh", handleChatUpdate);
    };
}, [currentUser]);


useEffect(() => {
    const reloadFriends = async () => {
        try {
            if (currentUser?._id) {
                console.log("📥 [ChatScreen] Có user online/offline, reload friends");
                const userDetail = await getUserById(currentUser._id);
                setCurrentUserDetail(userDetail);
            }
        } catch (error) {
            console.error("Lỗi khi reload friends:", error);
        }
    };

    socket.on("user:online", reloadFriends);
    socket.on("user:offline", reloadFriends);

    return () => {
        socket.off("user:online", reloadFriends);
        socket.off("user:offline", reloadFriends);
    };
}, [currentUser]);

  const renderContent = () => (
    <>
      <Header title="Chat"></Header>
      {/* <ScreenHeader screenName={'Chat'} navigation={navigation}></ScreenHeader> */}
      {/* <ChatHeader /> */}
      <SearchBar onSearch={setSearchQuery} value={searchQuery} />

      {/* Currently Active Section */}
      <View style={styles.sectionWrapper}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{t.currently_active}</Text>
          <View style={styles.dot} />
        </View>

        {filteredUsers.length === 0 ? (
          <Text style={styles.noUserText}>{t.no_user_found}</Text>
        ) : (
          <FlatList
            data={filteredUsers}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.activeList}
            keyExtractor={(item) => item.id ?? item.friend?._id ?? Math.random().toString()}
            renderItem={({item}) => <ActiveUserItem user={item} />}
          />
        )}
      </View>

      {/* Recent Chats Section */}
      <View style={styles.scrollArea}>
        <SectionLabel label={t.recents} iconType="clock" />
        <FlatList
          data={filteredChats}
          keyExtractor={item => item.id}
          renderItem={({item}) =>  <ChatCardItem chat={item} currentUserId={currentUser._id} />}
          contentContainerStyle={styles.chatList}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </>
  );

  return isDark ? (
    <ImageBackground
      source={require('../assets/images/BackGround.png')}
      style={styles.container}
      resizeMode="cover">
      {renderContent()}
    </ImageBackground>
  ) : (
    <View style={styles.container}>{renderContent()}</View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionWrapper: {
    paddingHorizontal: 20,
    marginTop: 12,
    marginBottom: 8,
  },
  scrollArea: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 0,
    paddingTop: 10,
  },
  activeList: {
    paddingVertical: 12,
  },
  chatList: {
    paddingBottom: 30,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B2CFF',
    alignSelf: 'flex-start',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 10,
    marginLeft: 10,
  },
  label: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFD700',
    marginLeft: 8,
  },
  noUserText: {
    color: '#aaa',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 12,
  },
});
