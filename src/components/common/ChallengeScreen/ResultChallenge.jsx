import AsyncStorage from '@react-native-async-storage/async-storage';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { useLanguage } from '../../../asycnc_store/LanguageContext';
import { translations } from '../../../untils/i18n';

const ResultChallenge = ({  isWin, navigation,setLoseOrWin, isReachFinalLevel }) => {
  const {language, toggleLanguage} = useLanguage();
  const t=translations[language];
  async function onNextLevel() {
     let currentPassLevel =await AsyncStorage.getItem("current_pass_level");
     let currentPassLevelNumber = parseInt(currentPassLevel);
     currentPassLevelNumber++;
     if(currentPassLevelNumber>=11) {
      currentPassLevel=1;
     }
     await AsyncStorage.setItem("current_pass_level",currentPassLevelNumber+"");
     await AsyncStorage.setItem("challenge_level",currentPassLevelNumber+"");
     navigation.replace("ChallengeDetail");

  }
  async function onBack() {
    let currentPassLevel =await AsyncStorage.getItem("current_pass_level");
    let currentPassLevelNumber = parseInt(currentPassLevel);
    currentPassLevelNumber++;
    await AsyncStorage.setItem("current_pass_level",""+currentPassLevelNumber);
    navigation.goBack();
  }
  
  
  return (
    
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 4,
      }}>
        <View style={{
          backgroundColor: '#F5D7FF',
          borderRadius: 20,
          padding: 30,
          alignItems: 'center',
          width: '80%',
        }}>
          <Text style={{
            fontSize: 24,
            fontWeight: 'bold',
            color: isWin ? '#FFD700' : '#FF4500',
            marginBottom: 20,
          }}>
            {isWin ? t.win_text+'!' : t.lose_text+'!'}
          </Text>

          {!isWin?<TouchableOpacity
            onPress={(e)=>{
                setLoseOrWin(1); 
                navigation.replace("ChallengeDetail");
            }}
            style={{
              backgroundColor: '#C084FC',
              paddingVertical: 10,
              paddingHorizontal: 40,
              borderRadius: 10,
              marginBottom: 15,
            }}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>{t.try_again_text}</Text>
          </TouchableOpacity>:  
          !isReachFinalLevel?<TouchableOpacity
            onPress={(e)=>{
                setLoseOrWin(1); 
                onNextLevel();
            }}
            style={{
              backgroundColor: '#C084FC',
              paddingVertical: 10,
              paddingHorizontal: 40,
              borderRadius: 10,
              marginBottom: 15,
            }}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>{t.next_level_text}</Text>
          </TouchableOpacity>:<></>
          }

          <TouchableOpacity
            onPress={(e)=>{
                e.preventDefault();
                onBack();
            }}
            style={{
              borderColor: '#C084FC',
              borderWidth: 2,
              paddingVertical: 10,
              paddingHorizontal: 40,
              borderRadius: 10,
            }}>
            <Text style={{ color: '#C084FC', fontWeight: 'bold' }}>{t.back_text}</Text>
          </TouchableOpacity>
        </View>
      </View>
   
  );
};
export default ResultChallenge;
