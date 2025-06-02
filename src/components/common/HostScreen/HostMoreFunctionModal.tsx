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

type Props = {
    visible: boolean;
    setModalVisible: (visible: boolean) => void;
    onClose: () => void;
    challenge: any
};

const HostMoreFunctionModal: React.FC<Props> = ({
    visible,
    setModalVisible,
    onClose,
    challenge
}) => {
    const { language } = useLanguage();
    const t = translations[language];
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const styles = isDark ? darkStyles : lightStyles;

    const hanldeAccept = () => {
        setModalVisible(false);
    };

    const hanldeDeny = () => {
        setModalVisible(false);
    };

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
