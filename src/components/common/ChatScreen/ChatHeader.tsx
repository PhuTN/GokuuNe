import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Modal,
  Pressable,
} from 'react-native';
import { useLanguage } from '../../../asycnc_store/LanguageContext';
import { translations } from '../../../untils/i18n';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/AppNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFriendRequests } from '../../../api/userApi';
import { socket } from '../../../untils/socket';

export default function ChatDetailHeader() {
  const { language } = useLanguage();
  const t = translations[language];
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const title = language === 'vi' ? 'Trò Chuyện' : 'Chat';

  // 🧠 State quản lý modal và số lượng yêu cầu kết bạn
  const [modalVisible, setModalVisible] = useState(false);
const [friendRequests, setFriendRequests] = useState(0);
const [currentUser, setCurrentUser] = useState(null);


  const handleFindFriends = () => {
  setModalVisible(false);
  navigation.navigate('Friends'); // ← điều hướng đến màn hình Friends
};


 const handleFriendRequests = () => {
  setModalVisible(false);
  if (currentUser) {
    navigation.navigate('FriendRequests', { accountLogin: currentUser });
  }
};


useEffect(() => {
  const fetchFriendRequests = async () => {
    try {
      const userJson = await AsyncStorage.getItem('currentUser');
      const user = userJson ? JSON.parse(userJson) : null;
      setCurrentUser(user);

      if (user?._id) {
        const requests = await getFriendRequests(user._id);
        setFriendRequests(requests.length);
      }
    } catch (error) {
      console.error("Lỗi khi lấy yêu cầu kết bạn:", error);
    }
  };

  fetchFriendRequests();
}, []);


useEffect(() => {
  const refreshRequests = async () => {
    if (currentUser?._id) {
      const requests = await getFriendRequests(currentUser._id);
      setFriendRequests(requests.length);
    }
  };

  socket.on("friend:request:refresh", refreshRequests);

  return () => {
    socket.off("friend:request:refresh", refreshRequests);
  };
}, [currentUser]);

useEffect(() => {
  const refreshRequests = async () => {
    console.log("📨 [ChatDetailHeader] Nhận sự kiện → Reload yêu cầu kết bạn");
    if (currentUser?._id) {
      try {
        const requests = await getFriendRequests(currentUser._id);
        setFriendRequests(requests.length);
      } catch (err) {
        console.error("Lỗi khi reload friend requests:", err);
      }
    }
  };

  socket.on("friend:refresh", refreshRequests);
  socket.on("friend:request:refresh", refreshRequests);
  socket.on("user:online", refreshRequests);
  socket.on("user:offline", refreshRequests);

  return () => {
    socket.off("friend:refresh", refreshRequests);
    socket.off("friend:request:refresh", refreshRequests);
    socket.off("user:online", refreshRequests);
    socket.off("user:offline", refreshRequests);
  };
}, [currentUser]);
useFocusEffect(
  useCallback(() => {
    const fetchRequests = async () => {
      try {
        const userJson = await AsyncStorage.getItem('currentUser');
        const user = userJson ? JSON.parse(userJson) : null;
        setCurrentUser(user);

        if (user?._id) {
          const requests = await getFriendRequests(user._id);
          setFriendRequests(requests.length);
          console.log("📥 [Focus] Reload friend requests");
        }
      } catch (error) {
        console.error("Lỗi khi fetch yêu cầu kết bạn khi focus:", error);
      }
    };

    fetchRequests();
  }, [])
);

  return (
    <>
      <View style={styles.wrapper}>
        {/* Back button */}
        <TouchableOpacity style={styles.sideButton} onPress={() => navigation.goBack()}>
          <Image
            source={require('../../../assets/images/ChatDetailScreen/backIcon.png')}
            style={styles.icon}
          />
        </TouchableOpacity>

        {/* Title */}
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>{title}</Text>
        </View>

        {/* Note icon + badge */}
        <TouchableOpacity style={styles.sideButton} onPress={() => setModalVisible(true)}>
          <Image
            source={require('../../../assets/images/note.png')}
            style={styles.iconImage}
          />
          {friendRequests > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{friendRequests}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Modal lựa chọn */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <Pressable style={styles.modalButton} onPress={handleFindFriends}>
              <Text style={styles.modalText}>Tìm bạn</Text>
            </Pressable>

            <View style={styles.separator} />

            <Pressable style={styles.modalButton} onPress={handleFriendRequests}>
              <Text style={styles.modalText}>
                Yêu cầu kết bạn {friendRequests > 0 && `(${friendRequests})`}
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 25,
    backgroundColor: '#BC2CFF80',
    borderBottomLeftRadius: 300,
    borderBottomRightRadius: 300,
    justifyContent: 'space-between',
  },
  sideButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  icon: {
    width: 30,
    height: 24,
    marginLeft: 15,
  },
  iconImage: {
    width: 24,
    height: 24,
    marginRight: 15,
  },
  titleWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFC107',
    textAlign: 'center',
  },
badge: {
  position: 'absolute',
  top: 1,          // 📌 đẩy lên trên một chút
  right: 6,        // 📌 sát mép phải icon
  backgroundColor: 'red',
  borderRadius: 10,
  paddingHorizontal: 5,
  minWidth: 18,
  height: 18,
  justifyContent: 'center',
  alignItems: 'center',
},

  badgeText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: 260,
    elevation: 10,
  },
  modalButton: {
    paddingVertical: 12,
  },
  modalText: {
    fontSize: 16,
    textAlign: 'left',
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: '#DDD',
    marginVertical: 4,
  },
});
