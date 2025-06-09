import React, { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useLanguage } from '../asycnc_store/LanguageContext';
import { useTheme } from '../asycnc_store/ThemeContext';
import { translations } from '../untils/i18n';
import { notify } from '../untils/Notify';
import { useNotification } from '../asycnc_store/NotificationContext';
import { Alert, Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Header from '../components/common/Header';
import { ScrollView } from 'react-native-gesture-handler';
import { launchImageLibrary } from 'react-native-image-picker';
import CloseIcon from '../assets/icons/close_icon.svg';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import config from '../api/config';
import { createPost } from '../api/postApi';

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
const [localImageUri, setLocalImageUri] = useState<string | null>(null);
 const handleImage = async () => {
  try {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      maxWidth: 1000,
      maxHeight: 1000,
      quality: 0.8,
    });

    if (!result.didCancel && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      if (!asset.uri) return;

      // 👉 Hiển thị ảnh chọn trước (preview)
      setLocalImageUri(asset.uri);

      const formData = new FormData();
      formData.append('image', {
        uri: asset.uri,
        type: asset.type ?? 'image/jpeg',
        name: asset.fileName ?? `upload_${Date.now()}.jpg`,
      });

      const res = await axios.post(
        `${config.API_URL}/api/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // 👉 Lưu URL trả về để gửi về backend khi cần
      setImage(res.data.url);
    }
  } catch (error) {
    console.error(error);
    Alert.alert('Lỗi', 'Không thể chọn hoặc upload ảnh.');
  }
};



    const handleRemoveImage = () => {
        setImage(null); // Clear the selected image
    };

    const handleCreatePost = async () => {
  if (!caption.trim()) {
    notify({
      message: t.noti_warning,
      description: t.post_caption_require,
      type: 'warning',
      systemNotification: true,
      pushState: notification,
      inapp: true,
    });
    return;
  }

  if (!image) {
    notify({
      message: language === 'vi' ? '⚠️ Thiếu ảnh' : '⚠️ Missing image',
      description: language === 'vi' ? 'Vui lòng chọn ảnh để đăng bài' : 'Please select an image to post',
      type: 'warning',
      systemNotification: true,
      pushState: notification,
    });
    return;
  }

  try {
    const newPostData = {
      caption: caption.trim(),
      imageUrl: image, // ảnh từ server sau khi upload
    };

    // ✅ Gọi API backend để tạo bài viết
    const createdPost = await createPost(newPostData);

    // ✅ Gọi callback nếu có
    if (onPostCreated) {
      onPostCreated(createdPost); // đã là bài viết từ server
    }

    // ✅ Thông báo thành công
    notify({
      message: language === 'vi' ? '🎉 Đăng thành công' : '🎉 Posted!',
      description: language === 'vi' ? 'Bài viết của bạn đã được đăng' : 'Your post has been published',
      type: 'success',
      systemNotification: true,
      pushState: notification,
    });

    // ✅ Reset
    setCaption('');
    setImage(null);
    setLocalImageUri(null);

    navigation.goBack();
  } catch (error) {
    console.error('Lỗi tạo bài viết:', error);
    notify({
      message: language === 'vi' ? '❌ Thất bại' : '❌ Failed',
      description: language === 'vi'
        ? 'Không thể tạo bài viết, vui lòng thử lại.'
        : 'Unable to create post, please try again.',
      type: 'danger',
      systemNotification: true,
      pushState: notification,
    });
  }
};
console.log(accountLogin)

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
  source={
    accountLogin?.avatarUrl
      ? { uri: accountLogin.avatarUrl } // 🔥 ảnh từ mạng
      : require('../images/user.png')   // 🔄 fallback local
  }
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
                        placeholderTextColor={isDark ? '#999' : '#666'}
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
                          {(localImageUri || image) && (
  <Image
    source={{ uri: localImageUri || image }} // Ưu tiên ảnh local đã chọn
    style={styles.postImage}
  />
)}

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
        backgroundColor: '#535353',
    },
    scrollContainer: {
        padding: 10,
    },
    createPostContainer: {
        backgroundColor: '#535353',
        borderRadius: 8,
        padding: 15,
        borderWidth: 1,
        borderColor: 'white',
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
        borderColor: 'white',
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
        minHeight: 60,
        fontSize: 16,
        color: 'white',
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