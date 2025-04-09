import React from 'react';
import {View, FlatList, StyleSheet, Text, ImageBackground} from 'react-native';
import ChatHeader from '../components/common/ChatScreen/ChatHeader';
import SearchBar from '../components/common/ChatScreen/SearchBar';
import SectionLabel from '../components/common/ChatScreen/SectionLabel';
import ActiveUserItem from '../components/common/ChatScreen/ActiveUserItem';
import ChatCardItem from '../components/common/ChatScreen/ChatCardItem';
import {activeUsers, recentChats} from '../fake_data/Phuc/fake_data';
import {useTheme} from '../asycnc_store/ThemeContext';

export default function ChatScreen() {
  const {theme} = useTheme();
  const isDark = theme === 'light';

  const renderContent = () => (
    <>
      <ChatHeader />
      <SearchBar />

      {/* Currently Active section */}
      <View style={styles.sectionWrapper}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>Currently Active</Text>
          <View style={styles.dot} />
        </View>
        <FlatList
          data={activeUsers}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.activeList}
          keyExtractor={item => item.id}
          renderItem={({item}) => <ActiveUserItem user={item} />}
        />
      </View>

      {/* Recents section */}
      <View style={styles.scrollArea}>
        <SectionLabel label="Recents" iconType="clock" />
        <FlatList
          data={recentChats}
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
    marginBottom: -10,
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
});
