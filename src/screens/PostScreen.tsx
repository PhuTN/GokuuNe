import React, { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useLanguage } from '../asycnc_store/LanguageContext';
import { useTheme } from '../asycnc_store/ThemeContext';
import { translations } from '../untils/i18n';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Header from '../components/common/Header';
import Button_Add from '../components/common/Button/Button_AddFriend';
import CreatePostIcon from '../assets/icons/add_friend_icon.svg';
import PostMoreFunctionModal from '../components/common/PostScreen/PostMoreFunctionModal';
import MoreFunctionIcon from '../assets/icons/more_function_icon.svg';
import CommentLightIcon from '../assets/icons/comment_light_icon.svg';
import CommentDarkIcon from '../assets/icons/comment_dark_icon.svg';
import LikeIcon from '../assets/icons/like_icon.svg';
import UnlikeLightIcon from '../assets/icons/unlike_light_icon.svg';
import UnlikeDarkIcon from '../assets/icons/unlike_dark_icon.svg';
import PostReportModal from '../components/common/PostScreen/PostReportModal';
import FullScreenImageModal from '../components/common/PostScreen/PostFullScreenImageModal';

type Props = NativeStackScreenProps<RootStackParamList, 'Post'>;

// Dữ liệu mẫu
const mockPosts = [
    {
        id: '1',
        user: { _id: 'userid1', displayName: 'Nguyen Van A', avatar: require('../images/avatar_01.jpg') },
        caption: 'Chiều 27/5, Chính phủ trình Quốc hội dự án Luật Đường sắt (sửa đổi) với nhiều nội dung nhằm thúc đẩy phát triển kết cấu hạ tầng, công nghiệp đường sắt. Bộ trưởng Bộ Xây dựng Trần Hồng Minh cho biết tại dự thảo này, Nhà nước xác định ưu tiên tập trung nguồn lực để đầu tư phát triển, nâng cấp, bảo trì, bảo vệ kết cấu hạ tầng đường sắt quốc gia, đường sắt địa phương và công nghiệp đường sắt. Mục tiêu là từng bước đưa đường sắt trở thành phương thức vận tải chủ đạo trong hệ thống giao thông vận tải cả nước.',
        image: require('../images/avatar_04.jpg'),
        comments: [
            {
                _id: 'c1', displayName: 'User B', avatar: require('../images/avatar_02.jpg'), text: 'Tuyệt quá!',
                createdAt: '2025-05-25T03:58:03.055+00:00',
                updatedAt: '2025-05-26T04:33:40.169+00:00',
            },
            {
                _id: 'c2', displayName: 'User C', avatar: require('../images/avatar_03.jpg'), text: 'Chúc mừng!',
                createdAt: '2025-05-25T03:58:03.055+00:00',
                updatedAt: '2025-05-27T04:33:40.169+00:00',
            },
        ],
        likes: [
            {
                _id: 'c1', displayName: 'User B',
                createdAt: '2025-05-25T03:58:03.055+00:00',
                updatedAt: '2025-05-25T04:33:40.169+00:00',
            },
            {
                _id: 'c2', displayName: 'User C',
                createdAt: '2025-05-25T03:58:03.055+00:00',
                updatedAt: '2025-05-25T04:33:40.169+00:00',
            },
        ],
        createdAt: '2025-05-25T03:58:03.055+00:00',
        updatedAt: '2025-05-25T04:33:40.169+00:00',
    },
    {
        id: '2',
        user: { _id: 'userid2', displayName: 'Tran Thi B', avatar: require('../images/avatar_04.jpg') },
        caption: 'Cảm giác mùa thu thật dễ chịu.',
        image: require('../images/avatar_02.jpg'),
        comments: [
            {
                _id: 'c3', displayName: 'User A', avatar: require('../images/avatar_01.jpg'), text: 'Đẹp quá!',
                createdAt: '2025-05-25T03:58:03.055+00:00',
                updatedAt: '2025-05-25T04:33:40.169+00:00',
            }
        ],
        likes: [
            {
                _id: 'c3', displayName: 'User A',
                createdAt: '2025-05-25T03:58:03.055+00:00',
                updatedAt: '2025-05-25T04:33:40.169+00:00',
            }
        ],
        createdAt: '2025-05-25T03:58:03.055+00:00',
        updatedAt: '2025-05-25T04:33:40.169+00:00',
    },
    {
        id: '3',
        user: { _id: 'userid1', displayName: 'Nguyen Van A', avatar: require('../images/avatar_01.jpg') },
        caption: 'Thử món mới ở quán ăn Nhật. Ngon hết sẩy!',
        image: require('../images/avatar_05.jpg'),
        comments: [
            {
                _id: 'c4', displayName: 'User D', avatar: require('../images/avatar_03.jpg'), text: 'Cho xin địa chỉ!',
                createdAt: '2025-05-26T08:00:00.000+00:00',
                updatedAt: '2025-05-26T08:10:00.000+00:00',
            }
        ],
        likes: [
            { _id: 'c5', displayName: 'User E', createdAt: '2025-05-26T08:20:00.000+00:00', updatedAt: '2025-05-26T08:20:00.000+00:00' },
        ],
        createdAt: '2025-05-26T07:50:00.000+00:00',
        updatedAt: '2025-05-26T08:00:00.000+00:00',
    },
    {
        id: '4',
        user: { _id: 'userid3', displayName: 'Le Van C', avatar: require('../images/avatar_02.jpg') },
        caption: 'Hôm nay trời đẹp quá, lên đồ đi chơi liền!',
        image: require('../images/avatar_03.jpg'),
        comments: [],
        likes: [],
        createdAt: '2025-05-26T09:00:00.000+00:00',
        updatedAt: '2025-05-26T09:15:00.000+00:00',
    },
    {
        id: '5',
        user: { _id: 'userid2', displayName: 'Tran Thi B', avatar: require('../images/avatar_04.jpg') },
        caption: 'Thử vẽ digital art lần đầu. Mọi người góp ý giúp mình với nhé!',
        image: require('../images/avatar_06.jpg'),
        comments: [
            {
                _id: 'c6', displayName: 'User F', avatar: require('../images/avatar_01.jpg'), text: 'Quá đẹp!',
                createdAt: '2025-05-27T01:00:00.000+00:00',
                updatedAt: '2025-05-27T01:30:00.000+00:00',
            }
        ],
        likes: [
            { _id: 'c7', displayName: 'User G', createdAt: '2025-05-27T01:20:00.000+00:00', updatedAt: '2025-05-27T01:20:00.000+00:00' },
        ],
        createdAt: '2025-05-27T00:50:00.000+00:00',
        updatedAt: '2025-05-27T01:00:00.000+00:00',
    },
    {
        id: '6',
        user: { _id: 'userid1', displayName: 'Nguyen Van A', avatar: require('../images/avatar_01.jpg') },
        caption: 'Một ngày làm việc hiệu quả! #productivity',
        image: require('../images/avatar_07.jpg'),
        comments: [],
        likes: [
            { _id: 'c8', displayName: 'User H', createdAt: '2025-05-27T03:00:00.000+00:00', updatedAt: '2025-05-27T03:00:00.000+00:00' },
        ],
        createdAt: '2025-05-27T02:30:00.000+00:00',
        updatedAt: '2025-05-27T03:00:00.000+00:00',
    },
];

const PostScreen = ({ route, navigation }: Props) => {
    const { language } = useLanguage();
    const t = translations[language];
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const styles = isDark ? darkStyles : lightStyles;

    const [accountLogin] = useState(route.params?.accountLogin ?? null);
    const [posts, setPosts] = useState(
        [...mockPosts].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    );
    const [modalMoreFunctionVisible, setModalMoreFunctionVisible] = useState(false);
    const [selectedPost, setSelectedPost] = useState();
    const [modalReportVisible, setModalReportVisible] = useState(false);
    const [modalImageVisible, setImageVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState();

    const [expandedCaptions, setExpandedCaptions] = useState<string[]>([]);

    // Hàm tính thời gian hiển thị giống Facebook
    const getTimeAgo = (updatedAt: string) => {
        const now = new Date();
        const updated = new Date(updatedAt);
        const diffInMs = now.getTime() - updated.getTime();
        const diffInSeconds = Math.floor(diffInMs / 1000);
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInSeconds < 60) {
            return t.post_time_just_now;
        } else if (diffInMinutes < 60) {
            return `${diffInMinutes} ${t.post_time_min}`;
        } else if (diffInHours < 24) {
            return `${diffInHours} ${t.post_time_hour}`;
        } else if (diffInDays < 7) {
            return `${diffInDays} ${t.post_time_day}`;
        } else {
            const date = updated.getDate().toString().padStart(2, '0');
            const month = (updated.getMonth() + 1).toString().padStart(2, '0');
            const year = updated.getFullYear();
            return `${date}/${month}/${year}`;
        }
    };

    const handleCreate = () => {
        navigation.navigate('PostCreate', {
            accountLogin,
            onPostCreated: (newPost: any) => {
                const updatedPosts = [newPost, ...posts];
                updatedPosts.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
                setPosts(updatedPosts);
            }
        });
    };

    const handleMoreFunction = (post: any) => {
        setSelectedPost(post);
        setModalMoreFunctionVisible(true);
    };

    const handleReportFromMoreFunction = () => {
        setModalMoreFunctionVisible(false);
        setTimeout(() => {
            setModalReportVisible(true); // Mở sau 1 chút để tránh trùng Modal
        }, 200); // delay 200ms cho mượt
    };

    const handleImagePress = (image: any) => {
        if (image) {
            setSelectedImage(image);
            setImageVisible(true);
        }
    };

    const toggleLike = (postId: string) => {
        setPosts((prevPosts) =>
            prevPosts.map((post) => {
                if (post.id === postId) {
                    const isLiked = post.likes.some((like) => like._id === accountLogin._id);
                    return {
                        ...post,
                        likes: isLiked
                            ? post.likes.filter((like) => like._id !== accountLogin._id)
                            : [
                                ...post.likes,
                                {
                                    _id: accountLogin._id,
                                    displayName: accountLogin.displayName,
                                    createdAt: new Date().toISOString(),
                                    updatedAt: new Date().toISOString(),
                                },
                            ],
                    };
                }
                return post;
            })
        );
    };

    const toggleCaption = (postId: string) => {
        setExpandedCaptions((prev) =>
            prev.includes(postId)
                ? prev.filter((id) => id !== postId)
                : [...prev, postId]
        );
    };

    return (
        <View style={styles.container}>
            <Header title={t.post} />
            <View style={styles.header}>
                <Button_Add Icon={CreatePostIcon} onPress={handleCreate} />
            </View>
            <View style={{ marginBottom: 15 }}></View>
            <FlatList
                data={posts}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.postList}
                renderItem={({ item }) => {
                    const isLiked = item.likes.some((like) => like._id === accountLogin._id);
                    const isCaptionExpanded = expandedCaptions.includes(item.id);
                    const MAX_LINES = 3;
                    const shouldShowMore = item.caption.split(' ').length > 100;
                    return (
                        <View style={styles.postContainer}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                                <Image source={item.user.avatar || require('../images/user.png')} style={styles.avatar} />
                                <View style={{ flexDirection: 'column', flex: 1 }}>
                                    <View style={styles.userInfo}>
                                        <Text style={styles.userName}>{item.user.displayName}</Text>
                                        <TouchableOpacity onPress={() => handleMoreFunction(item)}>
                                            <MoreFunctionIcon width={30} height={30} />
                                        </TouchableOpacity>
                                    </View>
                                    <Text style={styles.timeAgo}>{getTimeAgo(item.updatedAt)}</Text>
                                </View>
                            </View>
                            <Text
                                style={styles.caption}
                                numberOfLines={isCaptionExpanded ? undefined : MAX_LINES}
                            >
                                {item.caption}
                            </Text>

                            {shouldShowMore && (
                                <TouchableOpacity onPress={() => toggleCaption(item.id)}>
                                    <Text style={styles.showMoreText}>
                                        {isCaptionExpanded ? t.post_caption_hide : t.post_caption_show_more}
                                    </Text>
                                </TouchableOpacity>
                            )}
                            {item.image && (
                                <TouchableOpacity onPress={() => handleImagePress(item.image)}>
                                    <Image source={item.image} style={styles.postImage} />
                                </TouchableOpacity>
                            )}
                            <View style={styles.interactionBar}>
                                <TouchableOpacity
                                    onPress={() => toggleLike(item.id)}
                                >
                                    {isLiked ? (
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <LikeIcon width={22} height={22} />
                                            <Text style={styles.like}> {item.likes.length} {t.post_unlike}</Text>
                                        </View>
                                    ) : isDark ? (
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <UnlikeDarkIcon width={22} height={22} />
                                            <Text style={styles.like}> {item.likes.length} {t.post_like}</Text>
                                        </View>

                                    ) : (
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <UnlikeLightIcon width={22} height={22} />
                                            <Text style={styles.like}> {item.likes.length} {t.post_like}</Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{ flexDirection: 'row', alignItems: 'center' }}
                                    onPress={() => navigation.navigate('PostDetail', { accountLogin, post: item })}
                                >
                                    {isDark ? <CommentDarkIcon width={22} height={22} /> : <CommentLightIcon width={22} height={22} />}
                                    <Text style={styles.commnet}> {item.comments.length} {t.post_comment}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    );
                }}
            />
            <PostMoreFunctionModal
                visible={modalMoreFunctionVisible}
                setModalVisible={setModalMoreFunctionVisible}
                onClose={handleReportFromMoreFunction}
                post={selectedPost}
            />
            <PostReportModal
                visible={modalReportVisible}
                setModalVisible={setModalReportVisible}
                onClose={() => setModalReportVisible(false)}
                post={selectedPost}
            />
            <FullScreenImageModal
                visible={modalImageVisible}
                setModalVisible={setImageVisible}
                onClose={() => setImageVisible(false)}
                image={selectedImage}
            />
        </View>
    );
};

const lightStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f2f5',
    },
    header: {
        flex: 1,
        position: 'absolute',
        width: 'auto',
        right: 30,
        top: 28,
        zIndex: 10,
    },
    postContainer: {
        alignSelf: "center",
        backgroundColor: '#fff',
        marginTop: 15,
        width: "90%",
        padding: 10,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    userInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
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
    },
    caption: {
        fontSize: 14,
        marginBottom: 10,
    },
    showMoreText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
    },
    postImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 10,
    },
    interactionBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    postList: {
        paddingBottom: 20,
    },
    timeAgo: { fontSize: 12, color: '#666' },
    like: {
        fontSize: 14,
    },
    commnet: {
        fontSize: 14,
    }
});

const darkStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#535353',
    },
    header: {
        flex: 1,
        position: 'absolute',
        width: 'auto',
        right: 30,
        top: 28,
        zIndex: 10,
    },
    postContainer: {
        alignSelf: "center",
        backgroundColor: '#535353',
        marginTop: 15,
        width: "90%",
        padding: 10,
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    userInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
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
        color: 'white'
    },
    caption: {
        fontSize: 14,
        marginBottom: 10,
        color: 'white'
    },
    showMoreText: {
        fontSize: 14,
        color: '#999',
        marginBottom: 10,
    },
    postImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 10,
    },
    interactionBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    postList: {
        paddingBottom: 20,
    },
    timeAgo: { fontSize: 12, color: '#999' },
    like: {
        fontSize: 14,
        color: 'white'
    },
    commnet: {
        fontSize: 14,
        color: 'white'
    }
});

export default PostScreen;
