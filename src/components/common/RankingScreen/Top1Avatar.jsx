import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";
import { Text,View,StyleSheet,Image } from "react-native";
export default function Top1Avatar({topInfo}) {
    console.log(topInfo.avatarURL);
    const avatar = require('../../../assets/images/Top1.png');
    return (

        <View style={styles.container}>
          {/* Purple circular frame */}
          <View style={styles.circle}>
            {/* Profile image */}
            <Image
              source={avatar} // Replace with your image URL
              style={styles.image}
            />
            {
              generateCrown(topInfo.rank)
            }
            
          </View>
          {/* Number indicator */}
          <View style={styles.numberContainer}>
            <Text style={styles.number}>{topInfo.rank}</Text>
          </View>
        </View>
      );
}
function generateCrown(rank) {
  if(rank==1) {
    return <View style={styles.crownContainer}>
    <Text style={styles.crown}>👑</Text> {/* You can replace this with an actual icon */}
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
      backgroundColor: 'yellow',
      padding: 5,
      borderRadius: 10,
    },
    crown: {
      fontSize: 10, // You can style the crown text or use an icon library
      fontWeight: 'bold',
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
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
    },
  });
