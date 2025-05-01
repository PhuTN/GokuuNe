// src/components/Notification_Permission_Custom.tsx
import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { useLanguage } from "../../asycnc_store/LanguageContext";
import { useTheme } from "../../asycnc_store/ThemeContext";
import { translations } from "../../untils/i18n";
import NotificationIcon from "../../assets/icons/notification_permission_icon.svg";

type Props = {
    visible: boolean;
    onClose: () => void;
};

const NotificationPermissionCustom: React.FC<Props> = ({ visible, onClose }) => {
    const { language, toggleLanguage } = useLanguage();
    const t = translations[language];

    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';
    const styles = isDark ? darkStyles : lightStyles;

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    {/* Hàng đầu - Icon */}
                    <NotificationIcon width={60} height={60} />

                    {/* Hàng giữa - Nội dung */}
                    <View style={styles.contentContainer}>
                        {/* <Text style={styles.title}>Thông báo</Text> */}
                        <Text style={styles.message}>{t.noti_permission_deny}</Text>
                    </View>

                    {/* Hàng cuối - Button */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                            <Text style={styles.cancelText}>{t.noti_permission_cancel}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.settingButton} onPress={Linking.openSettings}>
                            <Text style={styles.settingText}>{t.noti_permission_setting}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default NotificationPermissionCustom;

const lightStyles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: '85%',
        backgroundColor: 'white',
        borderRadius: 16,
        paddingVertical: 24,
        paddingHorizontal: 16,
        alignItems: 'center',
    },
    iconContainer: {
        marginBottom: 16,
    },
    icon: {
        width: 60,
        height: 60,
    },
    contentContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    message: {
        fontSize: 16,
        textAlign: 'center',
        color: 'black',
    },
    buttonContainer: {
        flexDirection: 'row',
        alignSelf: 'flex-end',
        gap: 30
    },
    cancelButton: {
        backgroundColor: '#ccc',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    settingButton: {
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    cancelText: {
        color: '#000',
        fontSize: 16,
    },
    settingText: {
        color: 'white',
        fontSize: 16,
    },
});

const darkStyles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: '85%',
        backgroundColor: "#535353",
        borderRadius: 16,
        paddingVertical: 24,
        paddingHorizontal: 16,
        alignItems: 'center',
    },
    iconContainer: {
        marginBottom: 16,
    },
    icon: {
        width: 60,
        height: 60,
    },
    contentContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    message: {
        fontSize: 16,
        textAlign: 'center',
        color: 'white',
    },
    buttonContainer: {
        flexDirection: 'row',
        alignSelf: 'flex-end',
        gap: 30
    },
    cancelButton: {
        backgroundColor: '#ccc',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    settingButton: {
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    cancelText: {
        color: '#000',
        fontSize: 16,
    },
    settingText: {
        color: 'white',
        fontSize: 16,
    },
});
