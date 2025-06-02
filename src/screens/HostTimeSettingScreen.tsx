import React, {useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/AppNavigator';
import {useLanguage} from '../asycnc_store/LanguageContext';
import {useTheme} from '../asycnc_store/ThemeContext';
import {translations} from '../untils/i18n';
import {notify} from '../untils/Notify';
import {useNotification} from '../asycnc_store/NotificationContext';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Header from '../components/common/Header';
import Slider from '@react-native-community/slider';
import LinearGradient from 'react-native-linear-gradient';
import {Icon} from 'react-native-paper';
import BulletIcon from '../assets/icons/bullet_time_icon.svg';
import BlitzIcon from '../assets/icons/blitz_time_icon.svg';
import RapidIcon from '../assets/icons/rapid_time_icon.svg';
import DailyIcon from '../assets/icons/daily_time_icon.svg';
import CustomTimeIcon from '../assets/icons/custom_time_icon.svg';
import ArrowDropdownIcon from '../assets/icons/arrow_dropdown_icon.svg';
import ArrowDropupIcon from '../assets/icons/arrow_dropup_icon.svg';
import ButtonChoose from '../components/common/Button/Button_Save';

type Props = NativeStackScreenProps<RootStackParamList, 'HostTimeSetting'>;

const HostTimeSettingScreen = ({route, navigation}: Props) => {
  const {language, toggleLanguage} = useLanguage();
  const t = translations[language];

  const {theme, toggleTheme} = useTheme();
  const isDark = theme === 'dark';
  const styles = isDark ? darkStyles : lightStyles;

  const [accountLogin, setAccountLogin] = useState(
    route.params?.accountLogin ?? null,
  );
  const [friend, setFriend] = useState(route.params?.friend ?? null);
  const [match, setMatch] = useState(route.params?.match ?? null);
  const [selectedTime, setSelectedTime] = useState(
    route.params?.selectedTime ?? null,
  );

  const {notification, toggleNotification} = useNotification();
  const [showCustomTime, setShowCustomTime] = useState(false); // Trạng thái hiển thị thanh trượt

  const [customMinutes, setCustomMinutes] = useState(() => {
    const selectedTime = route.params?.selectedTime;
    if (typeof selectedTime === 'string' && selectedTime.includes(' | ')) {
      const parts = selectedTime.split(' | ');
      return parseInt(parts[0]) || 0;
    }
    if (
      typeof selectedTime === 'string' &&
      selectedTime.includes(t.host_time_min)
    ) {
      return parseInt(selectedTime.split(' ')[0]) || 0;
    }
    return 0;
  });

  const [customSeconds, setCustomSeconds] = useState(() => {
    const selectedTime = route.params?.selectedTime;
    if (typeof selectedTime === 'string' && selectedTime.includes(' | ')) {
      const parts = selectedTime.split(' | ');
      return parseInt(parts[1]) || 0;
    }
    return 0;
  });

  // Dữ liệu cho các nút thời gian nhanh
  const quickTimes = [
    {
      label: t.host_time_bullet,
      Icon: BulletIcon,
      times: ['1 ' + t.host_time_min, '1 | 1', '2 | 1'],
    },
    {
      label: t.host_time_blitz,
      Icon: BlitzIcon,
      times: showCustomTime
        ? [
            '3 ' + t.host_time_min,
            '3 | 2',
            '5 ' + t.host_time_min,
            '5 | 5',
            '5 | 2',
            '5 | 3',
          ]
        : ['3 ' + t.host_time_min, '3 | 2', '5 ' + t.host_time_min],
    },
    {
      label: t.host_time_rapid,
      Icon: RapidIcon,
      times: showCustomTime
        ? [
            '10 ' + t.host_time_min,
            '15 | 10',
            '30 ' + t.host_time_min,
            '10 | 5',
            '20 ' + t.host_time_min,
            '60 ' + t.host_time_min,
          ]
        : ['10 ' + t.host_time_min, '15 | 10', '30 ' + t.host_time_min],
    },
    {
      label: t.host_time_daily,
      Icon: DailyIcon,
      times: showCustomTime
        ? [
            '1 ' + t.host_time_day,
            '3 ' + t.host_time_days,
            '7 ' + t.host_time_days,
            '2 ' + t.host_time_days,
            '5 ' + t.host_time_days,
            '14 ' + t.host_time_days,
          ]
        : [
            '1 ' + t.host_time_day,
            '3 ' + t.host_time_days,
            '7 ' + t.host_time_days,
          ],
    },
  ];

  const handleChooseQuickTime = (time: string) => {
    setSelectedTime(time);
    setCustomMinutes(0);
    setCustomSeconds(0);
    // Sử dụng trực tiếp biến `time` thay vì `selectedTime`
    navigation.replace('Host', {accountLogin, friend, selectedTime: time, match});
  };

  const handleChooseCustomTime = () => {
    let time;
    if (customMinutes > 0 && customSeconds > 0) {
      time = `${customMinutes} | ${customSeconds}`;
    } else if (customMinutes > 0) {
      time = `${customMinutes} ${t.host_time_min}`;
    } else {
      time = `${customSeconds} ${t.host_time_sec}`;
    }

    setSelectedTime(time);
    setCustomMinutes(0);
    setCustomSeconds(0);
    // Truyền trực tiếp giá trị `time`
    navigation.replace('Host', {accountLogin, friend, selectedTime: time, match});
  };

  return (
    <ScrollView style={styles.container}>
      {/* Tiêu đề */}
      <Header title={t.host_time} />

      {/* Các nút thời gian nhanh */}
      {quickTimes.map((section, index) => (
        <View key={index} style={styles.section}>
          <View style={styles.sectionHeader}>
            <section.Icon width={25} height={25} style={styles.icon} />
            <Text style={styles.sectionTitle}>{section.label}</Text>
          </View>
          <View style={styles.buttonRow}>
            {section.times.map((time, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => handleChooseQuickTime(time)}
                style={[
                  styles.touchableContainer,
                  selectedTime === time && {
                    borderColor: '#FFCF26',
                    borderWidth: 5,
                    borderRadius: 20,
                  },
                ]}>
                <LinearGradient
                  colors={['#6B50F6', '#CC8FED']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}
                  style={styles.gradientButton}>
                  <Text style={styles.timeText}>{time}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      {/* Thanh trượt và nút tùy chỉnh (hiển thị khi nhấn Thêm điều khiển thời gian) */}
      {showCustomTime && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <CustomTimeIcon width={25} height={25} style={styles.icon} />
            <Text style={styles.sectionTitle}>{t.host_time_custom}</Text>
          </View>
          <View style={styles.customTimeSection}>
            {/* Thanh trượt tùy chỉnh */}
            <Text style={styles.sliderLabel}>
              {t.host_time_initial_time} {customMinutes} {t.host_time_min}
            </Text>
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderLimitLeft}>0</Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={120}
                step={1}
                value={customMinutes}
                onValueChange={value => setCustomMinutes(value)}
                minimumTrackTintColor="#6B50F6"
                maximumTrackTintColor="#CC8FED"
                thumbTintColor="#FFCF26"
              />
              <Text style={styles.sliderLimitRight}>120</Text>
            </View>

            <Text style={styles.sliderLabel}>
              {t.host_time_bonus_time} {customSeconds} {t.host_time_sec}
            </Text>
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderLimitLeft}>0</Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={60}
                step={1}
                value={customSeconds}
                onValueChange={value => setCustomSeconds(value)}
                minimumTrackTintColor="#6B50F6"
                maximumTrackTintColor="#CC8FED"
                thumbTintColor="#FFCF26"
              />
              <Text style={styles.sliderLimitRight}>60</Text>
            </View>

            {/* Nút Chọn */}
            <ButtonChoose
              text={t.host_time_button}
              onPress={handleChooseCustomTime}
            />
          </View>
        </View>
      )}

      {/* Nút Thêm điều khiển thời gian */}
      <TouchableOpacity onPress={() => setShowCustomTime(!showCustomTime)}>
        {!showCustomTime ? (
          <View style={styles.customTimeButton}>
            <Text style={styles.customTimeText}>
              {t.host_more_time_control}
            </Text>
            <ArrowDropdownIcon width={25} height={25} />
          </View>
        ) : (
          <View style={styles.customTimeButton}>
            <Text style={styles.customTimeText}>
              {t.host_fewer_time_control}
            </Text>
            <ArrowDropupIcon width={25} height={25} />
          </View>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const lightStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  section: {
    marginTop: '2.5%',
    width: '85%',
    alignSelf: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '2.5%',
    width: '85%',
  },
  icon: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  touchableContainer: {
    width: '30%',
    marginVertical: '2.5%',
  },
  gradientButton: {
    padding: 10,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50, // Đảm bảo chiều cao cố định
  },
  timeText: {
    fontSize: 18,
    textAlign: 'center',
    color: 'white',
  },
  customTimeButton: {
    flexDirection: 'row',
    marginVertical: '5%',
    alignSelf: 'center',
  },
  customTimeText: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
    marginRight: 10,
  },
  customTimeSection: {
    marginTop: '5%',
    width: '100%',
    alignSelf: 'center',
    paddingInline: 15,
    borderRadius: 15,
    borderColor: 'black',
    borderWidth: 2,
  },
  sliderLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginTop: 15,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  sliderLimitLeft: {
    fontSize: 16,
    textAlign: 'left',
    fontWeight: 'bold',
    width: 30,
  },
  sliderLimitRight: {
    fontSize: 16,
    textAlign: 'right',
    fontWeight: 'bold',
    width: 30,
  },
  slider: {
    flex: 1,
    height: 30,
  },
});

const darkStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#535353',
  },
  section: {
    marginTop: '2.5%',
    width: '85%',
    alignSelf: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '2.5%',
    width: '85%',
  },
  icon: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  touchableContainer: {
    width: '30%',
    marginVertical: '2.5%',
  },
  gradientButton: {
    padding: 10,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50, // Đảm bảo chiều cao cố định
  },
  timeText: {
    fontSize: 18,
    textAlign: 'center',
    color: 'white',
  },
  customTimeButton: {
    flexDirection: 'row',
    marginVertical: '5%',
    alignSelf: 'center',
  },
  customTimeText: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
    marginRight: 10,
    color: 'white',
  },
  customTimeSection: {
    marginTop: '5%',
    width: '100%',
    alignSelf: 'center',
    backgroundColor: '#535353',
    paddingInline: 15,
    borderRadius: 15,
    borderColor: 'white',
    borderWidth: 2,
  },
  sliderLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginTop: 15,
    color: 'white',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  sliderLimitLeft: {
    fontSize: 16,
    textAlign: 'left',
    fontWeight: 'bold',
    width: 30,
    color: 'white',
  },
  sliderLimitRight: {
    fontSize: 16,
    textAlign: 'right',
    fontWeight: 'bold',
    width: 30,
    color: 'white',
  },
  slider: {
    flex: 1,
    height: 30,
  },
});

export default HostTimeSettingScreen;
