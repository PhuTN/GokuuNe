import { useEffect, useState } from 'react';
import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import LinearGradient from 'react-native-linear-gradient';
import Button_Home from '../components/common/Button_Home';
import RankingIcon from '../assets/icons/ranking_icon.svg';
import AIChallengeIcon from '../assets/icons/AIChallenge_icon.svg';
import FriendsIcon from '../assets/icons/friends_icon.svg';
import HostIcon from '../assets/icons/host_icon.svg';
import ChatIcon from '../assets/icons/chat_icon.svg';
import SettingIcon from '../assets/icons/setting_icon.svg';
import LoginIcon from '../assets/icons/login_icon.svg';
import LogoutIcon from '../assets/icons/logout_icon.svg';
import ChessPieceBlackIcon from '../assets/icons/chess_piece_black.svg';
import ChessPieceWhiteIcon from '../assets/icons/chess_piece_white.svg';
import ChessRowIcon from '../assets/icons/chess_row_icon.svg';
import ChessColumnIcon from '../assets/icons/chess_column_icon.svg';
import { useLanguage } from '../asycnc_store/LanguageContext';
import { useTheme } from '../asycnc_store/ThemeContext';
import { translations } from '../untils/i18n';
import { Dimensions } from 'react-native';
import { notify } from '../untils/Notify';
import { useNotification } from '../asycnc_store/NotificationContext';
import { socket } from '../untils/socket';
import { useFocusEffect } from '@react-navigation/native';
import { getUserById } from '../api/userApi';
import { getUnreadConversationCount } from '../api/messageApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen = ({ route, navigation }: Props) => {
  const { language, toggleLanguage } = useLanguage();
  const t = translations[language];

  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const styles = isDark ? darkStyles : lightStyles;

  const { notification, toggleNotification } = useNotification();

  const [accountLogin, setAccountLogin] = useState(
    route.params?.accountLogin ?? null,
  );
  const [selectedTime, setSelectedTime] = useState<string>(
    `${t.host_time_default} ${t.host_time_min}`,
  );

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  useEffect(() => {
    setAccountLogin(route.params?.accountLogin ?? null);
  }, [route.params]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchUser = async () => {
        try {
          if (accountLogin?._id) {
            const freshUser = await getUserById(accountLogin._id);
            setAccountLogin(freshUser); // 👉 cập nhật avatar + thông tin mới
          }
        } catch (error) {
          console.error('Lỗi khi tải lại user:', error);
        }
      };

      fetchUser();
    }, [accountLogin?._id]),
  );

  const handleSetting = () => {
    // notify({
    //   message: t.noti_info,
    //   description: t.noti_go_setting,
    //   type: 'info',
    //   systemNotification: true,
    //   pushState: notification,
    // });
    navigation.navigate('Setting', { accountLogin });
  };

  const handleFriends = () => {
    navigation.navigate('SoloMatch', { accountLogin });
  };

  const handleAIChallenge = () => {
    // notify({
    //   message: t.noti_success,
    //   description: t.noti_go_ai,
    //   type: 'success',
    //   systemNotification: true,
    //   pushState: notification,
    // });
    navigation.navigate('AIChallenge', { accountLogin });
  };

  const handleLogin = () => {
    // notify({
    //   message: t.noti_info,
    //   description: t.noti_login,
    //   type: 'info',
    //   systemNotification: true,
    //   pushState: notification,
    // });
    navigation.navigate('Login');
  };

  const handleLogout = async () => {
    try {
      // ✅ Ngắt kết nối socket nếu còn kết nối
      if (socket && socket.connected) {
        socket.disconnect();
        console.log('✅ Socket disconnected on logout');
      }

      // ✅ Xóa user khỏi AsyncStorage
      await AsyncStorage.removeItem('currentUser');
      console.log('✅ currentUser removed from AsyncStorage');

      // ✅ Hiển thị thông báo
      notify({
        message: t.noti_success,
        description: t.noti_logout,
        type: 'success',
        systemNotification: true,
        pushState: notification,
      });

      // ✅ Quay về trang Home (hoặc Login nếu cần)
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home', params: { accountLogin: null } }],
      });
    } catch (error) {
      console.error('❌ Lỗi khi logout:', error);
      notify({
        message: t.noti_danger,
        description: 'Có lỗi xảy ra khi đăng xuất.',
        type: 'danger',
        systemNotification: true,
        pushState: notification,
      });
    }
  };
  const handleRanking = () => {
    navigation.navigate('Ranking', { accountLogin });
    /*if (accountLogin) {
      // notify({
      //   message: t.noti_success,
      //   description: t.noti_go_rank,
      //   type: 'success',
      //   systemNotification: true,
      //   pushState: notification,
      // });
      navigation.navigate('Ranking', {accountLogin});
    } else {
      notify({
        message: t.noti_warning,
        description: t.noti_login_require,
        type: 'warning',
        systemNotification: true,
        pushState: notification,
      });
    }*/
  };

  const handleHost = (friend: any) => {
    if (accountLogin) {
      // notify({
      //   message: t.noti_success,
      //   description: t.noti_go_host,
      //   type: 'success',
      //   systemNotification: true,
      //   pushState: notification,
      // });
      navigation.navigate('Host', { accountLogin, selectedTime, friend });
    } else {
      notify({
        message: t.noti_warning,
        description: t.noti_login_require,
        type: 'warning',
        systemNotification: true,
        pushState: notification,
      });
    }
  };

  const handleChat = () => {
    if (accountLogin) {
      // notify({
      //   message: t.noti_info,
      //   description: t.noti_go_chat,
      //   type: 'info',
      //   systemNotification: true,
      //   pushState: notification,
      // });
      navigation.navigate('Chat', { accountLogin });
    } else {
      notify({
        message: t.noti_warning,
        description: t.noti_login_require,
        type: 'warning',
        systemNotification: true,
        pushState: notification,
      });
    }
  };

  const [unreadCount, setUnreadCount] = useState(0);
  useFocusEffect(
    React.useCallback(() => {
      const fetchUserAndUnread = async () => {
        try {
          if (accountLogin?._id) {
            const freshUser = await getUserById(accountLogin._id);
            setAccountLogin(freshUser);

            // 🟣 Gọi API đếm tin nhắn chưa đọc
            const unreadRes = await getUnreadConversationCount(
              accountLogin._id,
            );
            setUnreadCount(unreadRes.count || 0);
          }
        } catch (error) {
          console.error('Lỗi khi tải lại user hoặc unread count:', error);
        }
      };

      fetchUserAndUnread();
    }, [accountLogin?._id]),
  );

  useEffect(() => {
    const handleChatUpdate = () => {
      if (accountLogin?._id) {
        getUnreadConversationCount(accountLogin._id)
          .then(res => setUnreadCount(res.count || 0))
          .catch(console.error);
      }
    };

    socket.on('chat:list:refresh', handleChatUpdate);

    return () => {
      socket.off('chat:list:refresh', handleChatUpdate);
    };
  }, [accountLogin?._id]);

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={{ alignItems: 'center' }}>
      {/* Header - Chess */}
      <View style={styles.chessBoard}>
        {/* Cột */}
        {[...Array(6)].map((_, i) => (
          <ChessColumnIcon
            key={`col-${i}`}
            width={40}
            height={150}
            style={{ position: 'absolute', left: i * 60 }}
          />
        ))}

        {/* Hàng */}
        {[...Array(3)].map((_, i) => (
          <ChessRowIcon
            key={`row-${i}`}
            width={360}
            height={40}
            style={{ position: 'absolute', top: i * 60 }}
          />
        ))}

        {/* Quân cờ */}
        {[
          { row: 0, col: 1, color: 'white' },
          { row: 0, col: 2, color: 'white' },
          { row: 0, col: 3, color: 'black' },
          { row: 0, col: 4, color: 'black' },
          { row: 1, col: 1, color: 'black' },
          { row: 1, col: 2, color: 'black' },
          { row: 1, col: 3, color: 'white' },
          { row: 1, col: 4, color: 'white' },
          { row: 2, col: 2, color: 'white' },
          { row: 2, col: 3, color: 'black' },
          { row: 2, col: 4, color: 'black' },
        ].map((piece, idx) => {
          const PieceIcon =
            piece.color === 'black' ? ChessPieceBlackIcon : ChessPieceWhiteIcon;
          return (
            <PieceIcon
              key={`piece-${idx}`}
              width={60}
              height={60}
              style={{
                position: 'absolute',
                left: piece.col * 60 - 8,
                top: piece.row * 60 - 8,
              }}
            />
          );
        })}
      </View>

      {/* Header - Avatar + Name */}
      <View style={styles.avatarHeader}>
        <LinearGradient
          colors={['rgba(107, 80, 246, 0.6)', 'rgba(188, 44, 255, 0.6)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.profileGradient}>
          <View style={styles.profileContainer}>
            <Image
              source={
                accountLogin?.avatarUrl
                  ? { uri: accountLogin.avatarUrl }
                  : require('../images/user.png')
              }
              style={styles.avatar}
            />

            <Text style={styles.username}>
              {accountLogin?.displayName || t.home_guest}
            </Text>
          </View>
        </LinearGradient>
      </View>

      {/* Title */}
      <Text style={styles.title}>GOKUU</Text>

      {/* Menu Buttons */}
      <View style={styles.buttonGroup}>
        <Button_Home
          title={t.home_ranking}
          Icon={RankingIcon}
          onPress={handleRanking}
        />
        <Button_Home
          title={t.home_host}
          Icon={HostIcon}
          onPress={() => handleHost(null)}
        />
        <Button_Home
          title={t.home_AI}
          Icon={AIChallengeIcon}
          onPress={handleAIChallenge}
        />
        <Button_Home
          title={t.home_friends}
          Icon={FriendsIcon}
          onPress={handleFriends}
        />
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <Button_Home
          Icon={ChatIcon}
          onPress={handleChat}
          isIconOnly
          badgeCount={unreadCount}
        />

        <Button_Home Icon={SettingIcon} onPress={handleSetting} isIconOnly />
        {accountLogin ? (
          <Button_Home Icon={LogoutIcon} onPress={handleLogout} isIconOnly />
        ) : (
          <Button_Home Icon={LoginIcon} onPress={handleLogin} isIconOnly />
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
  chessBoard: {
    width: 360,
    height: 150,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  rowIcon: {
    marginVertical: 2,
  },
  columnContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  columnIcon: {
    marginHorizontal: 5,
  },
  avatarHeader: {
    position: 'absolute',
    width: 'auto',
    right: -10,
    top: -10,
    zIndex: 10,
  },
  profileGradient: {
    borderRadius: 10,
    padding: 20,
  },
  profileContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 30,
    left: -5,
    top: 15,
    borderColor: '#6B50F6',
    borderWidth: 1,
  },
  username: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 8,
    left: -5,
    top: 15,
  },
  title: {
    fontSize: 33,
    fontWeight: 'bold',
    color: '#FFCF26',
    marginBottom: 10,
  },
  buttonGroup: {
    width: '80%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: '10%',
  },
});

const darkStyles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#535353',
  },
  chessBoard: {
    width: 360,
    height: 150,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  rowIcon: {
    marginVertical: 2,
  },
  columnContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  columnIcon: {
    marginHorizontal: 5,
  },
  avatarHeader: {
    position: 'absolute',
    width: 'auto',
    right: -10,
    top: -10,
    zIndex: 10,
  },
  profileGradient: {
    borderRadius: 10,
    padding: 30,
  },
  profileContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 30,
    left: -5,
    top: 15,
    borderColor: '#6B50F6',
    borderWidth: 1,
  },
  username: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 8,
    left: -5,
    top: 15,
  },
  title: {
    fontSize: 33,
    fontWeight: 'bold',
    color: '#FFCF26',
    marginBottom: 10,
  },
  buttonGroup: {
    width: '80%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: '10%',
  },
});

export default HomeScreen;
