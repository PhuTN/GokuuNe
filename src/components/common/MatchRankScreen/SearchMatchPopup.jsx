import {Image, StyleSheet, Text, View} from 'react-native';
import {useLanguage} from '../../../asycnc_store/LanguageContext';
import {translations} from '../../../untils/i18n';
import {useTheme} from '../../../asycnc_store/ThemeContext';
const clockIcon = require('../../../assets/images/alarm.png');

export default function SearchMatchPopup() {
  const {language, toggleLanguage} = useLanguage();
  const t = translations[language];
  const {theme, toggleTheme} = useTheme();
  const isDark = theme === 'dark';
  const style = isDark ? darkStyle : whiteStyle;
  return (
    <View style={style.container}>
      <View style={style.searchView}>
        <Image style={style.clockImage} source={clockIcon}></Image>
        <Text style={style.text}>{t.search_match_text}</Text>
      </View>
    </View>
  );
}
const darkStyle = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 2,
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  clockImage: {
    width: 50,
    height: 50,
  },
  searchView: {
    alignSelf: 'center',
    position: 'absolute',
    top: 270,
    borderRadius: 20,
    backgroundColor: 'black',
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    display: 'flex',
    flexDirection: 'column',
  },
  text: {
    color: 'white',
    fontSize: 20,
  },
});
const whiteStyle = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clockImage: {
    width: 50,
    height: 50,
  },
  searchView: {
    position: 'absolute',
    top: 270,
    borderRadius: 20,
    backgroundColor: 'white',
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    display: 'flex',
    flexDirection: 'column',
  },
  text: {
    color: 'black',
    fontSize: 20,
  },
});
