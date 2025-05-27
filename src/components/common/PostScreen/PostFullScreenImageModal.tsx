import React from 'react';
import { Image, Modal, StyleSheet, Text, TouchableOpacity, Dimensions, View, TouchableWithoutFeedback } from 'react-native';
import { useTheme } from '../../../asycnc_store/ThemeContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type FullScreenImageModalProps = {
    visible: boolean;
    image: any;
    setModalVisible: (visible: boolean) => void;
    onClose: () => void;
};

const PostFullScreenImageModal = ({ visible, image, setModalVisible, onClose }: FullScreenImageModalProps) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const styles = isDark ? darkStyles : lightStyles;

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={() => setModalVisible(false)}>
            <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                <View style={styles.overlay}>
                    <View style={styles.modalContainer}>
                        {image && (
                            <Image
                                source={image}
                                style={styles.fullScreenImage}
                                resizeMode="contain"
                            />
                        )}
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const lightStyles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        flex: 1,
    },
    fullScreenImage: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
    },
});

const darkStyles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        flex: 1,
    },
    fullScreenImage: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
    },
});

export default PostFullScreenImageModal;