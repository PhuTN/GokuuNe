import { Modal, View, Text, TouchableOpacity } from 'react-native';

const ResultChallenge = ({  isWin, navigation,setLoseOrWin }) => {
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
            {isWin ? 'Chiến thắng!' : 'Thất bại!'}
          </Text>

          {!isWin&&<TouchableOpacity
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
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Chơi lại</Text>
          </TouchableOpacity>}

          <TouchableOpacity
            onPress={(e)=>{
                e.preventDefault();
                navigation.goBack();
            }}
            style={{
              borderColor: '#C084FC',
              borderWidth: 2,
              paddingVertical: 10,
              paddingHorizontal: 40,
              borderRadius: 10,
            }}>
            <Text style={{ color: '#C084FC', fontWeight: 'bold' }}>Quay về</Text>
          </TouchableOpacity>
        </View>
      </View>
   
  );
};
export default ResultChallenge;
