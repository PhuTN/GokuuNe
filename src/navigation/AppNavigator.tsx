import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
//import ChatScreen from '../screens/ChatScreen';
//import ChatDetailScreen from '../screens/ChatDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';
//import RankingScreen from '../screens/RankingScreen';
//import RankingMatchScreen from '../screens/RankingMatchScreen';
import SettingScreen from '../screens/SettingScreen';
import ThemeLanguageTester from '../components/test_ui/ThemeLanguageTester';

export type RootStackParamList = {
  Login: undefined;
  Home: { accountLogin: any } | undefined;
  //Chat: { accountLogin: any } | undefined;
  //ChatDetail: undefined;
  Profile: { accountLogin: any } | undefined;
  //Ranking: { accountLogin: any } | undefined;
  //RankingMatch: undefined;
  Setting: { accountLogin: any } | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
<<<<<<< HEAD
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
=======
      <Stack.Navigator initialRouteName="TestThemeAndLanguage" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TestThemeAndLanguage" component={ThemeLanguageTester} />
>>>>>>> main
        <Stack.Screen name="Home" component={HomeScreen} />
        {/* <Stack.Screen name="Chat" component={ChatScreen} /> */}
        {/* <Stack.Screen name="ChatDetail" component={ChatDetailScreen} /> */}
        <Stack.Screen name="Profile" component={ProfileScreen} />
        {/* <Stack.Screen name="Ranking" component={RankingScreen} /> */}
        {/* <Stack.Screen name="RankingMatch" component={RankingMatchScreen} /> */}
        <Stack.Screen name="Setting" component={SettingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
