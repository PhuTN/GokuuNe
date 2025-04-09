import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {useLanguage} from '../../../asycnc_store/LanguageContext';
import {translations} from '../../../untils/i18n';

export default function ChatDetailHeader() {
  const {language} = useLanguage();
  const t = translations[language];

  return (
    <View style={styles.wrapper}>
      {/* Back button */}
      <TouchableOpacity style={styles.backIcon}>
        <Image
          source={require('../../../assets/images/ChatDetailScreen/backIcon.png')}
          style={styles.icon}
        />
      </TouchableOpacity>

      {/* Avatar and Name */}
      <View style={styles.avatarContainer}>
        <Image
          source={require('../../../assets/images/ChatDetailScreen/avatar.png')}
          style={styles.avatar}
        />
        <View style={styles.nameContainer}>
          <Text style={styles.username}>Harper</Text>
          <View style={styles.statusContainer}>
            {/* Chấm vàng */}
            <View style={styles.statusDot} />
            <Text style={styles.status}>{t.active_status}</Text>
          </View>
        </View>
      </View>

      {/* Right icons */}
      <View style={styles.iconContainer}>
        <TouchableOpacity style={styles.iconLeft}>
          <Image
            source={require('../../../assets/images/ChatDetailScreen/fightIcon.png')}
            style={styles.iconImage}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#E5A8FF',
    borderBottomLeftRadius: 300, // Bo tròn đáy header nhiều hơn
    borderBottomRightRadius: 300, // Bo tròn đáy header nhiều hơn
    alignItems: 'center',
    paddingTop: 50, // Đảm bảo phần trên không bị che khuất
  },
  backIcon: {
    marginRight: 16, // Đẩy back icon sang phải
    marginLeft: 30,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center', // Đảm bảo các phần ở giữa căn giữa
  },
  avatar: {
    width: 65,
    height: 65,
    borderRadius: 50,
    marginRight: 8,
  },
  nameContainer: {
    alignItems: 'center',
  },
  username: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4, // Thêm khoảng cách
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFD700',
    marginRight: 6, // Khoảng cách giữa chấm và chữ Active
  },
  status: {
    color: '#FFD700',
    fontSize: 18,
  },
  iconContainer: {
    flexDirection: 'row',
    marginLeft: 'auto',
    alignItems: 'center',
  },
  iconLeft: {
    marginLeft: -10, // Đẩy fightIcon sang trái một chút
    marginRight: 30,
  },
  icon: {
    width: 24,
    height: 24,
  },
  iconImage: {
    width: 24,
    height: 24,
  },
});
