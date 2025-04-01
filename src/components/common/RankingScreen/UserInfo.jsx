import { Text,View ,Image, StyleSheet} from "react-native";

import UserNameCountry from "./Username_Country";

export default function UserInfo({user}) { 
    
    return (
    <View style={styles.container}>
        <Image source={{
            uri:user.userAvatarURL
        }} style={styles.image}></Image> 
        <UserNameCountry user={user}></UserNameCountry>
    </View> 
    );
}
const styles = StyleSheet.create({
    container:{
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        gap:'20'
    },
    image:{
        width:60,
        height:60
    }
})