import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";
import { Text,View,StyleSheet,Image } from "react-native";
export default function Top1Avatar({topInfo}) {
    console.log(topInfo.avatarURL);
    const avatar = require('../../../assets/images/Top1.png');
    const crown = require('../../../assets/images/Crown.png');
    return (

        <View style={styles.container}>
          {/* Purple circular frame */}
          <View style={styles.circle}>
            {/* Profile image */}
            <Image
              source={{
                uri:topInfo.userAvatarURL
              }} // Replace with your image URL
              style={styles.image}
            />
            {
              generateCrown(topInfo.rank,crown)
            }
            
          </View>
          {/* Number indicator */}
          <View style={styles.numberContainer}>
            <Text style={styles.number}>{topInfo.rank}</Text>
          </View>
        </View>
      );
}
function generateCrown(rank,crown) {
  if(rank==1) {
    return <View style={styles.crownContainer}>
    <Image style={styles.crown} source={crown}></Image>
  </View>
  }
  return <></>

}
const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      
      alignSelf:'center'
    },
    circle: {
      width: 84,
      height: 84,
      borderRadius: 75,
      borderWidth: 5,
      borderColor: '#6B50F6', // Purple border
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    },
    image: {
      width: 84,
      height: 84,
      borderRadius: 65, // Profile image inside the circle
    },
    crownContainer: {
      position: 'absolute',
      top: -20, // Adjust the crown position
      
      padding: 5,
      borderRadius: 10,
    },
    crown: {
      width:30,
      height:20,
      
    },
    numberContainer: {
      position: 'absolute',
      bottom: -20, // Adjust the number position
      backgroundColor: '#6B50F6', // Purple background
      borderRadius: 20,
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
    number: {
      color: '#FFCF26',
      fontSize: 18,
      fontWeight: 'bold',

    },
  });
