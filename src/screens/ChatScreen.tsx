import React from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import ChatHeader from '../components/common/ChatHeader';
import SearchBar from '../components/common/SearchBar';
import SectionLabel from '../components/common/SectionLabel';
import ActiveUserItem from '../components/chat/ActiveUserItem';
import ChatCardItem from '../components/chat/ChatCardItem';
import {activeUsers, recentChats} from '../fake_data/Phuc/fake_data';
import ActiveUserSection from '../components/chat/ActiveUserItem';

export default function ChatScreen() {
  return (
    <View style={styles.container}>
      <ChatHeader />
      <SearchBar />
      <FlatList
        data={activeUsers}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.activeList}
        keyExtractor={item => item.id}
        renderItem={({item}) => <ActiveUserItem user={item} />}
      />
      <SectionLabel label="Recents" iconName="clock-o" iconColor="#fff" />
      <FlatList
        data={recentChats}
        keyExtractor={item => item.id}
        renderItem={({item}) => <ChatCardItem chat={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  activeList: {paddingHorizontal: 20, paddingVertical: 12},
});
