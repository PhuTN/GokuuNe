import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableWithoutFeedback,
    TouchableOpacity,
} from 'react-native';
import { useLanguage } from '../../../asycnc_store/LanguageContext';
import { useTheme } from '../../../asycnc_store/ThemeContext';
import { translations } from '../../../untils/i18n';
import { acceptChallengeDirect, declineChallengeDirect } from '../../../api/userApi';
import { socket } from '../../../untils/socket';

type Props = {
    visible: boolean;
    setModalVisible: (visible: boolean) => void;
    onClose: () => void;
    challenge: any
     userId: string;        // 👈 Thêm ID của người hiện tại
  opponentId: string;    // 👈 Thêm ID của người đối thủ
};

const HostMoreFunctionModal: React.FC<Props> = ({
    visible,
    setModalVisible,
    onClose,
    challenge,
    opponentId,
    userId,
}) => {
    const { language } = useLanguage();
    const t = translations[language];
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const styles = isDark ? darkStyles : lightStyles;

const hanldeAccept = async () => {
  try {
    await acceptChallengeDirect(userId, opponentId);
    setModalVisible(false);
    socket.emit('challenge:refresh', userId); // refresh lại tất cả các bên liên quan
    socket.emit('challenge:refresh', opponentId);
    console.log('✅ Đã chấp nhận thách đấu');
  } catch (err) {
    console.error('❌ Lỗi khi chấp nhận thách đấu:', err);
  }
};

const hanldeDeny = async () => {
  try {
    await declineChallengeDirect(userId, opponentId);
    setModalVisible(false);
    socket.emit('challenge:refresh', userId);
    socket.emit('challenge:refresh', opponentId);
    console.log('🚫 Đã từ chối thách đấu');
  } catch (err) {
    console.error('❌ Lỗi khi từ chối thách đấu:', err);
  }
};
console.log("MEE",opponentId,userId)
    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={() => setModalVisible(false)}>
            <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback onPress={() => { }}>
                        <View style={styles.container}>
                            <TouchableOpacity style={styles.modalButton} onPress={hanldeAccept}>
                                <Text style={styles.modalText}> {t.host_challenge_accept}</Text>
                            </TouchableOpacity>
                            <View style={styles.separator} />
                            <TouchableOpacity style={styles.modalButton} onPress={hanldeDeny}>
                                <Text style={styles.modalText}>{t.host_challenge_deny}</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default HostMoreFunctionModal;

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
    modalButton: {
        paddingVertical: 12,
    },
    modalText: {
        fontSize: 16,
        textAlign: 'left',
        fontWeight: '500',
    },
    separator: {
        height: 1,
        backgroundColor: '#DDD',
        marginVertical: 4,
        alignSelf: 'stretch',
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
        backgroundColor: '#535353',
        borderRadius: 16,
        paddingVertical: 24,
        paddingHorizontal: 16,
        alignItems: 'center',
    },
    modalButton: {
        paddingVertical: 12,
    },
    modalText: {
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold',
    },
    separator: {
        height: 1,
        backgroundColor: 'white',
        marginVertical: 4,
        alignSelf: 'stretch',
    },
});
