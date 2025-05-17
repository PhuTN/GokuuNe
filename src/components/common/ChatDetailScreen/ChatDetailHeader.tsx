import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useLanguage } from '../../../asycnc_store/LanguageContext';
import { translations } from '../../../untils/i18n';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/AppNavigator';

export default function ChatDetailHeader({ user }: { user: any }) {
    const { language } = useLanguage();
    const t = translations[language];

    const isOnline = user?.onlineStatus === 'online';
    const dotColor = isOnline ? '#FFD700' : '#FF4C4C'; // vàng hoặc đỏ
    const statusText = isOnline ? (language === 'vi' ? 'Đang hoạt động' : 'Active') 
                                : (language === 'vi' ? 'Ngoại tuyến' : 'Offline');
 const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    return (
        <View style={styles.wrapper} >
            {/* Back button */}
            <TouchableOpacity style={styles.backIcon} onPress={() => navigation.goBack()}>
                <Image
                    source={require('../../../assets/images/ChatDetailScreen/backIcon.png')}
                    style={styles.icon}
                />
            </TouchableOpacity>

            {/* Avatar and Name */}
            <View style={styles.avatarContainer}>
                <Image
                    source={user?.avatarUrl ? { uri: user.avatarUrl } : require('../../../images/user.png')}
                    style={styles.avatar}
                />
                <View style={styles.nameContainer}>
                    <Text style={styles.username}>{user?.displayName ?? 'Unknown'}</Text>
                    <View style={styles.statusContainer}>
                        <View style={[styles.statusDot, { backgroundColor: dotColor }]} />
                        <Text style={[styles.status, { color: dotColor }]}>
                            {statusText}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Right icons */}
            <View style={styles.iconContainer}>
                <TouchableOpacity style={styles.iconLeft}>
                    <Image
                        source={require('../../../assets/images/ChatDetailScreen/fightIcon.png')}
                        style={styles.iconImage}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: '#BC2CFF80',
        borderBottomLeftRadius: 300,
        borderBottomRightRadius: 300,
        alignItems: 'center',
        paddingTop: 20,
    },
    backIcon: {
        marginRight: 16,
        marginLeft: 15,
    },
    avatarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 50,
        marginRight: 8,
    },
    nameContainer: {
        alignItems: 'center',
        marginRight:15
    },
    username: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    status: {
        fontSize: 18,
    },
    iconContainer: {
        flexDirection: 'row',
        marginLeft: 'auto',
        alignItems: 'center',
    },
    iconLeft: {
        marginLeft: -10,
        marginRight: 30,
    },
    icon: {
        width: 30,
        height: 24,
    },
    iconImage: {
        width: 24,
        height: 24,
    },
});