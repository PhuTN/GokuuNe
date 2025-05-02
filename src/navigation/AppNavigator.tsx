import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
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

export type RootStackParamList = {
  Login: undefined;
  Home: {accountLogin: any} | undefined;
  Chat: { accountLogin: any } | undefined;
  ChatDetail: {accountLogin: any, friend: any} | undefined;
  ChatTab: {accountLogin: any} | undefined;
  Profile: {accountLogin: any} | undefined;
  Ranking: { accountLogin: any } | undefined;
  RankingMatch: {accountLogin: any} | undefined;
  Setting: {accountLogin: any} | undefined;
  Friends: {accountLogin: any} | undefined;
  FriendLeaderBoard: {accountLogin: any} | undefined;
  AIChallenge: {accountLogin: any} | undefined;
  AIMatch: {accountLogin: any, selectedPiece: any, selectedMode: any} | undefined;
  Host: {accountLogin: any, friend: any} | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{headerShown: false}}>
        {/* <Stack.Screen
          name="TestThemeAndLanguage"
          component={ThemeLanguageTester}
        /> */}
        <Stack.Screen name="ChatTab" component={ChatTabScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
