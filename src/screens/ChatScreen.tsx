import React, {useState} from 'react';
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

export default function ChatScreen() {
  const {theme} = useTheme();
  const isDark = theme === 'dark';
  const {language} = useLanguage();
  const t = translations[language];

  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = activeUsers.filter(
    user =>
      user.name &&
      user.name.trim().toLowerCase().includes(searchQuery.trim().toLowerCase()),
  );

  const filteredChats = recentChats.filter(chat =>
    chat.user.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const renderContent = () => (
    <>
      <ChatHeader />
      <SearchBar onSearch={setSearchQuery} value={searchQuery} />

      {/* Currently Active Section */}
      <View style={styles.sectionWrapper}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{t.currently_active}</Text>
          <View style={styles.dot} />
        </View>

        {filteredUsers.length === 0 ? (
          <Text style={styles.noUserText}>
            {t.no_user_found}
          </Text>
        ) : (
          <FlatList
            data={filteredUsers}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.activeList}
            keyExtractor={item => item.id}
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
          renderItem={({item}) => <ChatCardItem chat={item} />}
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
