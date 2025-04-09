import React from 'react';
import {View, TextInput, StyleSheet, Image, Dimensions} from 'react-native';
import {useTheme} from '../../../asycnc_store/ThemeContext';
import {useLanguage} from '../../../asycnc_store/LanguageContext';
import {translations} from '../../../untils/i18n';

const {width} = Dimensions.get('window');

export default function SearchBar() {
  const {theme} = useTheme();
  const isDark = theme === 'light';

  const {language} = useLanguage();
  const t = translations[language];
  return (
    <View
      style={[
        styles.container,
        isDark && {
          backgroundColor: '#1E1E1E',
          borderColor: '#444',
        },
      ]}>
      <TextInput
        placeholder={t.search || 'Search...'}
        placeholderTextColor={isDark ? '#999' : '#FFD700'}
        style={[
          styles.input,
          isDark && {
            backgroundColor: 'transparent',
            color: '#fff',
          },
        ]}
      />
      <Image
        source={require('../../../assets/images/ChatScreen/SearchIcon.png')}
        style={[styles.icon, isDark && {tintColor: '#999'}]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width * 0.9,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#00000033',
    alignSelf: 'center',
    marginVertical: 16,
    marginBlock: 20,
  },
  input: {
    flex: 1,
    fontSize: 20, // ← to hơn
    color: '#FFD700',
    paddingVertical: 6,
  },
  icon: {
    width: 50, // ← tăng từ 20 → 24
    height: 24,
    marginLeft: 10,
  },
});
