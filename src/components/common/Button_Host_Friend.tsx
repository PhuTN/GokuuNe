import React from "react";
import { TouchableOpacity, View, Text, StyleSheet, Image } from "react-native";
import ArrowCustomIcon from "../../assets/icons/arrow_custom_icon.svg";
import LinearGradient from "react-native-linear-gradient";
import countries from "world-countries";
import CountryFlag from "react-native-country-flag";
import { useLanguage } from "../../asycnc_store/LanguageContext";
import { translations } from "../../untils/i18n";

// Ánh xạ từ tên quốc gia sang mã ISO
const countryMap: Record<string, string> = countries.reduce((map, country) => {
    map[country.name.common] = country.cca2;
    return map;
}, {} as Record<string, string>);

interface ButtonProps {
    accountFriend: any,
    onPress: () => void;
}

const Button_Host_Friend: React.FC<ButtonProps> = ({ accountFriend: friend, onPress }) => {
    const { language, toggleLanguage } = useLanguage();
    const t = translations[language];

    return (
        <TouchableOpacity onPress={onPress}>
            <LinearGradient
                colors={["#6B50F6", "#CC8FED"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.rowItem}
            >
                <View style={styles.friendItemContent}>
                    <Image
                        source={friend?.avatarFriend || require('../../images/user_question_mark.png')}
                        style={styles.avatar}
                    />
                    <View style={styles.friendInfo}>
                        <View style={styles.friendUsernameContainer}>
                            <Text style={styles.friendUsername}>{friend?.usernameFriend || t.host_random_user}</Text>
                            <CountryFlag isoCode={countryMap[friend?.countryFriend] || 'VN'} size={25} style={styles.flag} />
                        </View>
                    </View>
                    <ArrowCustomIcon width={30} height={30} />
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    rowItem: {
        flexDirection: "row",
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "space-between",
        width: "90%",
        padding: 15,
        borderRadius: 10,
    },
    friendItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 5,
        marginRight: 12,
    },
    friendInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    friendUsernameContainer: {
        flexDirection: "row",
        alignItems: "center",
        maxWidth: "80%", // Giới hạn chiều rộng để không đè lên icon
    },
    friendUsername: {
        fontSize: 16,
        fontWeight: "bold",
        color: "white",
    },
    flag: {
        marginLeft: 5,
        borderRadius: 5,
        alignSelf: 'center'
    },
});

export default Button_Host_Friend;
