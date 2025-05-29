import React, { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useLanguage } from '../asycnc_store/LanguageContext';
import { useTheme } from '../asycnc_store/ThemeContext';
import { translations } from '../untils/i18n';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, SafeAreaView, KeyboardAvoidingView, Platform, Dimensions, Modal } from 'react-native';
import Header from '../components/common/Header';
import MoreFunctionIcon from '../assets/icons/more_function_icon.svg';
import PostReportModal from '../components/common/PostScreen/PostReportModal';
import FullScreenImageModal from '../components/common/PostScreen/PostFullScreenImageModal';
import NoCommnetLightIcon from '../assets/icons/no_comment_light_icon.svg';
import NoCommnetDarkIcon from '../assets/icons/no_comment_dark_icon.svg';
import SendMessageIcon from '../assets/icons/send_message_icon.svg';

type Props = NativeStackScreenProps<RootStackParamList, 'PostDetail'>;

const getTimeAgo = (updatedAt: string) => {
    const now = new Date();
    const updated = new Date(updatedAt);
    const diffInMs = now.getTime() - updated.getTime();
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInSeconds < 60) {
        return 'Vừa xong';
    } else if (diffInMinutes < 60) {
        return `${diffInMinutes} phút trước`;
    } else if (diffInHours < 24) {
        return `${diffInHours} giờ trước`;
    } else if (diffInDays < 7) {
        return `${diffInDays} ngày trước`;
    } else {
        const date = updated.getDate().toString().padStart(2, '0');
        const month = (updated.getMonth() + 1).toString().padStart(2, '0');
        const year = updated.getFullYear();
        return `${date}/${month}/${year}`;
    }
};

const PostDetailScreen = ({ route, navigation }: Props) => {
    const { language } = useLanguage();
    const t = translations[language];

    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const styles = isDark ? darkStyles : lightStyles;

    const [accountLogin, setAccountLogin] = useState(route.params?.accountLogin ?? null);
    const [post, setPost] = useState(route.params?.post ?? null);
    const [commentText, setCommentText] = useState('');
    const [modalReportVisible, setReportVisible] = useState(false);
    const [modalImageVisible, setImageVisible] = useState(false);
    const [commentOrder, setCommentOrder] = useState<'newest' | 'oldest'>('newest');

    const handleReportPost = (post: any) => {
        setReportVisible(true);
    };

    const handleImagePress = (image: any) => {
        if (image) {
            setImageVisible(true);
        }
    };

    const handleSubmitComment = () => {
        if (commentText.trim()) {
            // Add logic to submit the comment to your backend or update the post state
            // For example, append to post.comments array
            const newComment = {
                avatar: accountLogin?.avatar || require('../images/user.png'),
                displayName: accountLogin?.displayName || 'Anonymous',
                text: commentText,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            setPost({
                ...post,
                comments: [...(post.comments || []), newComment],
            });
            setCommentText(''); // Clear input after submission
        }
    };

    const sortedComments = [...(post.comments || [])].sort((a, b) => {
        const timeA = new Date(a.updatedAt).getTime();
        const timeB = new Date(b.updatedAt).getTime();
        return commentOrder === 'newest' ? timeB - timeA : timeA - timeB;
    });

    return (
        <SafeAreaView style={styles.container}>
            <Header title={t.post_detail} />
            <View style={{ marginBottom: 15 }}></View>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
                    <View style={styles.postContainer}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                            <Image source={post.user.avatar || require('../images/user.png')} style={styles.avatar} />
                            <View style={{ flexDirection: 'column', flex: 1 }}>
                                <View style={styles.userInfo}>
                                    <Text style={styles.userName}>{post.user.displayName}</Text>
                                    <TouchableOpacity onPress={() => handleReportPost(post)}>
                                        <MoreFunctionIcon width={30} height={30} />
                                    </TouchableOpacity>
                                </View>
                                <Text style={styles.timeAgo}>{getTimeAgo(post.updatedAt)}</Text>
                            </View>
                        </View>
                        <Text style={styles.caption}>{post.caption}</Text>
                        {post.image && (
                            <TouchableOpacity onPress={() => handleImagePress(post.image)}>
                                <Image source={post.image} style={styles.postImage} />
                            </TouchableOpacity>
                        )}
                    </View>
                    <View style={styles.postContainer}>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginHorizontal: 15, marginBottom: 10 }}>
                            <TouchableOpacity onPress={() => setCommentOrder(prev => prev === 'newest' ? 'oldest' : 'newest')}>
                                <Text style={{ color: isDark ? 'white' : 'black' }}>
                                    {commentOrder === 'newest' ? t.post_detail_sort_newest : t.post_detail_sort_oldest}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        {sortedComments.length > 0 ? (
                            sortedComments.map((comment, index) => (
                                <View key={index} style={styles.commentContainer}>
                                    <Image source={comment.avatar} style={styles.commentAvatar} />
                                    <View style={styles.commentContent}>
                                        <Text style={styles.commentAuthor}>{comment.displayName}</Text>
                                        <Text style={styles.commentText}>{comment.text}</Text>
                                        <Text style={styles.commentTime}>{getTimeAgo(comment.updatedAt)}</Text>
                                    </View>
                                </View>
                            ))
                        ) : (
                            <View style={{ alignItems: 'center', marginTop: 20 }}>
                                {isDark ? <NoCommnetDarkIcon width={60} height={60} /> : <NoCommnetLightIcon width={60} height={60} />}
                                <Text style={{ color: isDark ? 'white' : 'black', marginTop: 10 }}>{t.post_detail_no_comment}</Text>
                            </View>
                        )}
                    </View>
                </ScrollView>
                <View style={styles.commentInputContainer}>
                    <TextInput
                        style={styles.commentInput}
                        placeholder={t.post_detail_write_comment}
                        placeholderTextColor={isDark ? '#888' : '#666'}
                        value={commentText}
                        onChangeText={setCommentText}
                        multiline
                    />
                    <TouchableOpacity onPress={handleSubmitComment}>
                        <SendMessageIcon width={40} height={40} />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
            <PostReportModal
                visible={modalReportVisible}
                setModalVisible={setReportVisible}
                onClose={() => setReportVisible(false)}
                post={post}
            />
            <FullScreenImageModal
                visible={modalImageVisible}
                setModalVisible={setImageVisible}
                onClose={() => setImageVisible(false)}
                image={post.image}
            />
        </SafeAreaView>
    );
};

const lightStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f2f5',
    },
    postContainer: {
        alignSelf: 'center',
        backgroundColor: '#fff',
        marginTop: 15,
        width: '100%',
        padding: 10,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: 'white',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    userInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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
    caption: {
        fontSize: 14,
        marginBottom: 10,
        color: '#000',
    },
    postImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 10,
    },
    timeAgo: {
        fontSize: 12,
        color: '#666',
    },
    commentContainer: {
        flexDirection: 'row',
        marginBottom: 15,
    },
    commentAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    commentContent: {
        flex: 1,
        flexDirection: 'column',
    },
    commentAuthor: {
        fontWeight: 'bold',
        marginBottom: 3,
        color: '#000',
    },
    commentText: {
        marginBottom: 3,
        color: '#000',
    },
    commentTime: {
        fontSize: 12,
        color: 'gray',
    },
    commentInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#ddd',
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },
    commentInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 20,
        padding: 10,
        maxHeight: 100,
        color: '#000',
    },
});

const darkStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#535353',
    },
    postContainer: {
        alignSelf: 'center',
        backgroundColor: '#535353',
        marginTop: 15,
        width: '100%',
        padding: 10,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: 'white',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    userInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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
    caption: {
        fontSize: 14,
        marginBottom: 10,
        color: '#fff',
    },
    postImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 10,
    },
    timeAgo: {
        fontSize: 12,
        color: '#aaa',
    },
    commentContainer: {
        flexDirection: 'row',
        marginBottom: 15,
    },
    commentAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    commentContent: {
        flex: 1,
        flexDirection: 'column',
    },
    commentAuthor: {
        fontWeight: 'bold',
        marginBottom: 3,
        color: '#fff',
    },
    commentText: {
        marginBottom: 3,
        color: '#fff',
    },
    commentTime: {
        fontSize: 12,
        color: '#aaa',
    },
    commentInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#535353',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: 'white',
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },
    commentInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 20,
        padding: 10,
        maxHeight: 100,
        color: '#fff',
    },
});

export default PostDetailScreen;