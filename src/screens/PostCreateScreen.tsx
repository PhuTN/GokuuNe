import React, { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useLanguage } from '../asycnc_store/LanguageContext';
import { useTheme } from '../asycnc_store/ThemeContext';
import { translations } from '../untils/i18n';
import { notify } from '../untils/notify';
import { useNotification } from '../asycnc_store/NotificationContext';
import { Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Header from '../components/common/Header';
import { ScrollView } from 'react-native-gesture-handler';
import { launchImageLibrary } from 'react-native-image-picker';
import CloseIcon from '../assets/icons/close_icon.svg';
import LinearGradient from 'react-native-linear-gradient';

type Props = NativeStackScreenProps<RootStackParamList, 'PostCreate'>;

const PostCreateScreen = ({ route, navigation }: Props) => {
    const { language } = useLanguage();
    const t = translations[language];

    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const styles = isDark ? darkStyles : lightStyles;

    const { notification, toggleNotification } = useNotification();

    const [accountLogin] = useState(route.params?.accountLogin ?? null);
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState<string | null>(null); // Store image URI
    const onPostCreated = route.params?.onPostCreated;

    const handleImage = async () => {
        try {
            const result = await launchImageLibrary({
                mediaType: 'photo',
                maxWidth: 1000,
                maxHeight: 1000,
                quality: 0.8,
            });

            if (!result.didCancel && result.assets && result.assets.length > 0) {
                const uri = result.assets[0].uri;
                setImage(uri || null); // Set the selected image URI
            }
        } catch (error) {
        }
    };

    const handleRemoveImage = () => {
        setImage(null); // Clear the selected image
    };

    const handleCreatePost = () => {
        if (!caption.trim() && !image) {
            return;
        }

        const newPost = {
            id: `${Date.now()}`, // Use timestamp for unique ID;
            user: {
                _id: accountLogin._id,
                displayName: accountLogin.displayName,
                avatar: accountLogin.avatar,
            },
            caption: caption.trim(),
            image: image ? { uri: image } : null, // Use URI for image
            comments: [],
            likes: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        if (onPostCreated) {
            onPostCreated(newPost); // Call callback to update PostScreen
        }

        // Clear form and navigate back
        setCaption('');
        setImage(null);
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header title={t.post_create} />
            <View style={{ marginBottom: 15 }}></View>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.createPostContainer}>
                    {/* Part 1: Avatar and Username */}
                    <View style={styles.headerContainer}>
                        <View style={styles.userInfo}>
                            <Image
                                source={accountLogin?.avatar || require('../images/user.png')} // Fallback avatar
                                style={styles.avatar}
                            />
                            <Text style={styles.userName}>{accountLogin?.displayName || 'Anonymous'}</Text>
                        </View>
                        <TouchableOpacity onPress={handleCreatePost}>
                            <LinearGradient
                                colors={["#6B50F6", "#CC8FED"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.submitButton}
                            >
                                <Text style={styles.submitButtonText}>{t.post_create_submit}</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    {/* Part 2: Caption Input */}
                    <TextInput
                        style={styles.input}
                        placeholder={t.post_create_caption_placeholder}
                        placeholderTextColor={isDark ? '#888' : '#666'}
                        value={caption}
                        onChangeText={setCaption}
                        multiline
                        maxLength={1000} // Limit caption length
                    />

                    {/* Part 3: Image Selection */}
                    <TouchableOpacity onPress={handleImage}>
                        <LinearGradient
                            colors={["#6B50F6", "#CC8FED"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.imagePicker}
                        >
                            <Text style={styles.imagePickerText}>{t.post_create_add_photo}</Text>
                        </LinearGradient>

                    </TouchableOpacity>
                    {image && (
                        <View style={styles.imageContainer}>
                            <Image source={{ uri: image }} style={styles.postImage} />
                            <TouchableOpacity style={styles.removeImageButton} onPress={handleRemoveImage}>
                                <CloseIcon width={20} height={20} />
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const lightStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f2f5',
    },
    scrollContainer: {
        padding: 10,
    },
    createPostContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    userName: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#000',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
        minHeight: 60,
        fontSize: 16,
        color: '#000',
    },
    imagePicker: {
        padding: 15,
        backgroundColor: '#e0e0e0',
        borderRadius: 8,
        marginBottom: 15,
        alignItems: 'center',
    },
    imagePickerText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '500',
    },
    imageContainer: {
        position: 'relative',
        marginBottom: 15,
    },
    postImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
    },
    removeImageButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    submitButton: {
        backgroundColor: '#1b74e4',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
    },
    submitButtonDisabled: {
        backgroundColor: '#a0c4ff',
    },
    submitButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

const darkStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a1a',
    },
    scrollContainer: {
        padding: 10,
    },
    createPostContainer: {
        backgroundColor: '#2c2c2c',
        borderRadius: 8,
        padding: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    userName: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#fff',
    },
    input: {
        borderWidth: 1,
        borderColor: '#444',
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
        minHeight: 60,
        fontSize: 16,
        color: '#fff',
    },
    imagePicker: {
        padding: 15,
        backgroundColor: '#444',
        borderRadius: 8,
        marginBottom: 15,
        alignItems: 'center',
    },
    imagePickerText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    imageContainer: {
        position: 'relative',
        marginBottom: 15,
    },
    postImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
    },
    removeImageButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    submitButton: {
        backgroundColor: '#1b74e4',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
    },
    submitButtonDisabled: {
        backgroundColor: '#4a6fa5',
    },
    submitButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default PostCreateScreen;