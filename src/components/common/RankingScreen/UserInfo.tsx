import { Text,View ,Image, StyleSheet} from "react-native";

import UserNameCountry from "./Username_Country";

export default function UserInfo() { 
    const userAvatar = require('../../../assets/images/avatar.png');
    return (
    <View style={styles.container}>
        <Image source={userAvatar}></Image> 
        <UserNameCountry></UserNameCountry>
    </View> 
    );
}
const styles = StyleSheet.create({
    container:{
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        gap:'20'
    }
})