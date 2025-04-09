import { StyleSheet, Text,View ,Image, TouchableOpacity} from "react-native";
import React from "react"; 
import { useNavigation } from "@react-navigation/native";
export default function ScreenHeader({screenName,navigation}) { 
    
    const backIcon= require("../../assets/images/backIcon.png");
    return (
        <>
          {/* Elip nền */}
          <View style={styles.ellipseBackground} />
    
          {/* Header */}
          <View style={styles.container}>
            
              <TouchableOpacity onPress={(e) => {navigation.goBack()}} style={styles.backButton}>
                <Image source={backIcon} style={{width:35,height:35}}></Image>
              </TouchableOpacity>
            
            <Text style={styles.title}>{screenName}</Text>
          </View>
        </>
      );
    
}
const styles =StyleSheet.create({
    ellipseBackground: {
        position: 'absolute',
        top: -400,
        width: '270%',
        height: 480,
        borderBottomLeftRadius: 1000,
        borderBottomRightRadius: 1000,
        backgroundColor: '#BC2CFF80',
        zIndex: 1,
        alignSelf: 'center',
        marginBottom:20
      },
      container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        paddingVertical: 10,
        position: "relative",
      },
      backButton: {
        position: "absolute",
        left: 16,
       
        zIndex:2
      },
      title: {
        fontSize: 35,
        fontWeight: "bold",
        color: "#FFC107",
        textAlign: "center",
      },
    
});