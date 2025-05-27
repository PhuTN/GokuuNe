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
import PostReportModal from './PostReportModal';

type Props = {
    visible: boolean;
    setModalVisible: (visible: boolean) => void;
    onClose: () => void;
    post: any
};

const PostMoreFunctionModal: React.FC<Props> = ({
    visible,
    setModalVisible,
    onClose,
    post
}) => {
    const { language } = useLanguage();
    const t = translations[language];
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const styles = isDark ? darkStyles : lightStyles;

    const hanldeBlockUser = (user: any) => {
        setModalVisible(false);
    };

    const hanldeHidePost = () => {
        setModalVisible(false);
    };

    const hanldeReportPost = () => {
        onClose();
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
                            <TouchableOpacity style={styles.modalButton} onPress={() => hanldeBlockUser(post?.user)}>
                                <Text style={styles.modalText}>
                                    {t.post_more_function_block_user}
                                    {post?.user?.displayName ?? ''}
                                </Text>
                            </TouchableOpacity>
                            <View style={styles.separator} />
                            <TouchableOpacity style={styles.modalButton} onPress={hanldeHidePost}>
                                <Text style={styles.modalText}>{t.post_more_function_hide_post}</Text>
                            </TouchableOpacity>
                            <View style={styles.separator} />
                            <TouchableOpacity style={styles.modalButton} onPress={hanldeReportPost}>
                                <Text style={styles.modalText}>{t.post_more_function_report_post}</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default PostMoreFunctionModal;

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
