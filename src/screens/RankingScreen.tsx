import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/AppNavigator';

import UserView from '../components/common/RankingScreen/UserView';
import PlayButton from '../components/common/Button/PlayButton';
import Top1Avatar from '../components/common/RankingScreen/Top1Avatar';
import TopInfo from '../components/common/RankingScreen/TopInfo';
import LeaderBoardInfo from '../components/common/RankingScreen/LeaderBoardInfo';
import LeaderBoard from '../components/common/RankingScreen/LeaderBoard';
import ScreenHeader from '../components/common/ScreenHeader';
import {User, Top10} from '../fake_data/Binh/fake_data';
import {useTheme} from '../asycnc_store/ThemeContext';
import Header from '../components/common/Header';
import {he} from 'date-fns/locale';
import {useLanguage} from '../asycnc_store/LanguageContext';
import {translations} from '../untils/i18n';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { getLeaderBoard, getUserById } from '../api/userApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = NativeStackScreenProps<RootStackParamList, 'Ranking'>;
const listLeaderBoard = [
  {name: 'Alex White', elo: 3900},
  {name: 'Alex White', elo: 3900},
  {name: 'Alex White', elo: 3900},
  {name: 'Alex White', elo: 3900},
  {name: 'Alex White', elo: 3900},
  {name: 'Alex White', elo: 3900},
  {name: 'Alex White', elo: 3900},
];
const playerPosition = 5;

const RankingScreen = ({navigation}: Props) => {
  const {theme, toggleTheme} = useTheme();
  const isDark = theme === 'dark';
  const style = isDark ? darkStyle : whiteStyle;
  const {height} = useWindowDimensions();

  const {language, toggleLanguage} = useLanguage();
  const t = translations[language];
const [user, setUser] = useState(null);
const [accountLogin, setAccountLogin] = useState<any>(null);
const [leaderBoardData, setListLeaderBoardData] = useState([]);
const isFocuse = useIsFocused();
useEffect(() => {
  const loadAccountLogin = async () => {
    const acc = await AsyncStorage.getItem('currentUser');
    if (acc) setAccountLogin(JSON.parse(acc));
  };
  loadAccountLogin();
}, []);

  useFocusEffect(
  useCallback(() => {
    const fetchUser = async () => {
      try {
        if (accountLogin?._id) {
          const freshUser = await getUserById(accountLogin._id);
          const userMapped = {
            userId: freshUser._id,
            userName: freshUser.displayName ?? 'Unknown',
            country: freshUser.nationality ?? 'VietNam',
            matches: freshUser.matchHistory.length,
            elo: freshUser.elo ?? 2200,
            userCountryImageURL:
              'https://www.shutterstock.com/image-vector/vietnam-flag-made-vectors-260nw-1928345522.jpg',
            userAvatarURL:
              freshUser.avatarUrl ??
              'https://example.com/default-avatar.jpg',
            rank: freshUser.rank ?? 4,
          };
          console.log("Fresh User--------------",freshUser);
          setUser(userMapped);
        }
      } catch (error) {
        console.error('❌ Lỗi khi tải lại user:', error);
      }
    };
    

    fetchUser();
    
    
  }, [accountLogin?._id]),
);
useEffect(()=>{ 
  console.log("Focuse");
  const fetchLeaderBoard = async () =>{
      const leaderBoard = await getLeaderBoard();
      console.log("Leader Board -----------------");
      console.log(leaderBoard);
      const mapData = leaderBoard.map((item,index)=>{
        return {
           userId: item._id,
        userName: item.username,
        country: item.nationality,
        matches: item.matchHistory.length,
        elo: item.elo,
        userCountryImageURL: "https://www.pngmart.com/files/13/American-Flag-Logo-PNG-Picture.png",
        userAvatarURL: item.avatarUrl,
        rank: index+1
        }
      });
      setListLeaderBoardData(mapData);
    }
    fetchLeaderBoard();
},[isFocuse])
  return (
    <View style={style.container}>
      <Header title={t.ranking}></Header>

      <ScrollView style={{paddingBottom: 30, height: height}}>
        <UserView user={user}></UserView>
        <PlayButton navigation={navigation} destination={"RankingMatch"}></PlayButton>
        <View style={style.topContainer}>
          <View>
            <TopInfo topInfo={leaderBoardData.length==0?Top10[1]:leaderBoardData[2]}></TopInfo>
          </View>
          <View style={style.top1View}>
            <TopInfo topInfo={leaderBoardData.length==0?Top10[1]:leaderBoardData[0]}></TopInfo>
          </View>
          <View>
            <TopInfo topInfo={leaderBoardData.length==0?Top10[1]:leaderBoardData[1]}></TopInfo>
          </View>
        </View>
        <LeaderBoard
          listLeaderBoard={leaderBoardData?.slice(3, 10)}
          user={user}></LeaderBoard>
      </ScrollView>
    </View>
  );
};
const whiteStyle = StyleSheet.create({
  container: {},
  heading: {
    textAlign: 'center',
  },
  topContainer: {
    height: 100,
    paddingHorizontal: 40,
    marginTop: 100,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  top1View: {
    alignSelf: 'flex-end',
  },
});
const darkStyle = StyleSheet.create({
  container: {
    backgroundColor: 'black',
  },
  heading: {
    textAlign: 'center',
  },
  topContainer: {
    height: 100,
    paddingHorizontal: 40,
    marginTop: 100,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  top1View: {
    alignSelf: 'flex-end',
  },
});
export default RankingScreen;
