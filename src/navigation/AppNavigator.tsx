import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import ChatScreen from '../screens/ChatScreen';
import ChatDetailScreen from '../screens/ChatDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';
import RankingScreen from '../screens/RankingScreen';
import RankingMatchScreen from '../screens/RankingMatchScreen';
import SettingScreen from '../screens/SettingScreen';
import FriendsScreen from '../screens/FriendsScreen';
import FriendLeaderBoardScreen from '../screens/FriendLeaderBoardScreen';
import AIChallengeScreen from '../screens/AIChallengeScreen';
import AIMatchScreen from '../screens/AIMatchScreen';
import ChatTabScreen from '../screens/ChatTabScreen';
import HostScreen from '../screens/HostScreen';
import HostTimeSettingScreen from '../screens/HostTimeSettingScreen';
import HostFriendScreen from '../screens/HostFriendScreen';
import HostMatchScreen from '../screens/HostMatchScreen';
import { StatusBar } from 'react-native';
import SigninScreen from '../screens/Signin';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import FriendRequestScreen from '../screens/FriendRequestScreen';

import SoloMatchScreen from '../screens/SoloMatchScreen';

import HistoryScreen from '../screens/HistoryScreen';
import HistoryDetail from '../screens/HistoryDetail';
import AiMatchSoloScreen from '../screens/AiMatchSoloScreen';
import ChallengeScreen from '../screens/ChallengeScreen';
import ChallengeDetail from '../screens/ChallengeDetailScreen';


export type RootStackParamList = {
  Login: undefined;
   Signin: undefined; 
   FriendRequests: { accountLogin: any } | undefined;
   ForgotPassword: undefined;
  Home: { accountLogin: any } | undefined;
  SoloMatch: { accountLogin: any } | undefined;
  Chat: { accountLogin: any } | undefined;
  ChatDetail: { accountLogin: any; friend: any } | undefined;
  ChatTab: { accountLogin: any } | undefined;
  Profile: { accountLogin: any } | undefined;
  Ranking: { accountLogin: any } | undefined;
  RankingMatch: { accountLogin: any } | undefined;
  Setting: { accountLogin: any } | undefined;
  Friends: { accountLogin: any } | undefined;
  FriendLeaderBoard: { accountLogin: any } | undefined;
  AIChallenge: { accountLogin: any } | undefined;
  AIMatch: { accountLogin: any; selectedPiece: any; selectedMode: any } | undefined;
  Host: { accountLogin: any; friend: any; selectedTime: any } | undefined;
  HostTimeSetting: { accountLogin: any; friend: any; selectedTime: any } | undefined;
  HostFriend: { accountLogin: any; selectedTime: any } | undefined;
  HostMatch: { accountLogin: any; selectedTime: any; friend: any; isRankingMode: any; selectedPiece: any } | undefined;
    History: { accountLogin: any } | undefined;
  HistoryDetail: { accountLogin: any; matchId: string } | undefined;
  AiMatchSolo: { accountLogin: any; selectedPiece: any; selectedMode: any } | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <StatusBar hidden={true}></StatusBar>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        {/* <Stack.Screen name="TestThemeAndLanguage" component={ThemeLanguageTester} /> */}
        <Stack.Screen name="ChatTab" component={ChatTabScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signin" component={SigninScreen} />
        <Stack.Screen name="ChatDetail" component={ChatDetailScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Ranking" component={RankingScreen} />
        <Stack.Screen name="RankingMatch" component={RankingMatchScreen} />
        <Stack.Screen name="Setting" component={SettingScreen} />
        <Stack.Screen name="Friends" component={FriendsScreen} />
        <Stack.Screen name="FriendLeaderBoard" component={FriendLeaderBoardScreen} />
        <Stack.Screen name="AIChallenge" component={AIChallengeScreen} />
        <Stack.Screen name="AIMatch" component={AIMatchScreen} />
        <Stack.Screen name="Host" component={HostScreen} />
        <Stack.Screen name="HostTimeSetting" component={HostTimeSettingScreen} />
        <Stack.Screen name="HostFriend" component={HostFriendScreen} />
        <Stack.Screen name="HostMatch" component={HostMatchScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="FriendRequests" component={FriendRequestScreen} />
        <Stack.Screen name="SoloMatch" component={SoloMatchScreen} />

        <Stack.Screen name="History" component={HistoryScreen} />
        <Stack.Screen name="HistoryDetail" component={HistoryDetail} />
        <Stack.Screen name="AiMatchSolo" component={AiMatchSoloScreen} />
        <Stack.Screen name ="Challenge" component={ChallengeScreen}/> 
        <Stack.Screen name="ChallengeDetail"  component={ChallengeDetail}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
