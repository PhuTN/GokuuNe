import React, { useCallback, useEffect, useState } from 'react';
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
import { getAllPosts, getFriendPosts, getMyPosts, getPostById, toggleLikePost } from '../api/postApi';
import { useFocusEffect } from '@react-navigation/native';

type Props = NativeStackScreenProps<RootStackParamList, 'Post'>;

// Dữ liệu mẫu



const PostScreen = ({ route, navigation }: Props) => {
    const { language } = useLanguage();
    const t = translations[language];
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const styles = isDark ? darkStyles : lightStyles;

    const [accountLogin] = useState(route.params?.accountLogin ?? null);
    const [posts, setPosts] = useState(
       []
    );
    const [modalMoreFunctionVisible, setModalMoreFunctionVisible] = useState(false);
    const [selectedPost, setSelectedPost] = useState();
    const [modalReportVisible, setModalReportVisible] = useState(false);
    const [modalImageVisible, setImageVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState();

    const [expandedCaptions, setExpandedCaptions] = useState<string[]>([]);
// useEffect(() => {
//     const fetchPosts = async () => {
//         try {
//             const myPosts = await getMyPosts();
//             const friendPosts = await getFriendPosts();
//             const allPosts = [...myPosts, ...friendPosts];

//             allPosts.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
//             setPosts(allPosts);
//         } catch (err) {
//             console.error("🚨 Error fetching posts:", err);
//         }
//     };

//     fetchPosts();
// }, []);
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

const toggleLike = async (postId: string) => {
  try {
    await toggleLikePost(postId);
    await fetchPosts(); // 👈 Reload lại toàn bộ bài viết
  } catch (error) {
    console.error("🚨 Lỗi khi like/unlike:", error);
  }
};


    const toggleCaption = (postId: string) => {
        setExpandedCaptions((prev) =>
            prev.includes(postId)
                ? prev.filter((id) => id !== postId)
                : [...prev, postId]
        );
    };
    console.log(posts)
const fetchPosts = async () => {
  try {
    let data = [];
    if (selectedTab === 'me') data = await getMyPosts();
    else if (selectedTab === 'friend') data = await getFriendPosts();
    else data = await getAllPosts();

    data.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    setPosts(data);
  } catch (err) {
    console.error("🚨 Error fetching posts:", err);
  }
};

    const [selectedTab, setSelectedTab] = useState<'me' | 'friend' | 'global'>('me');
useFocusEffect(
  useCallback(() => {
    const fetchPosts = async () => {
      try {
        let data = [];
        if (selectedTab === 'me') data = await getMyPosts();
        else if (selectedTab === 'friend') data = await getFriendPosts();
        else data = await getAllPosts();

        data.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        setPosts(data);
      } catch (err) {
        console.error("🚨 Error fetching posts:", err);
      }
    };

    fetchPosts();
  }, [selectedTab]) // 💥 vẫn truyền selectedTab nếu bạn muốn reload mỗi lần đổi tab khi quay lại screen
);

    return (
        <View style={styles.container}>
            <Header title={t.post} />
            <View style={styles.header}>
                <Button_Add Icon={CreatePostIcon} onPress={handleCreate} />
            </View>
            <View style={{ marginBottom: 15 }}></View>
<View style={{
  flexDirection: 'row',
  justifyContent: 'space-around',
  marginHorizontal: 10,
  marginTop: 10,
  paddingVertical: 8,
  borderRadius: 12,
  backgroundColor: '#E6E6FA', // 💜 tím nhạt dễ thương
}}>
  <TouchableOpacity onPress={() => setSelectedTab('me')} style={{ paddingHorizontal: 10 }}>
    <Text style={{
      fontWeight: selectedTab === 'me' ? 'bold' : '600',
      color: selectedTab === 'me' ? '#4B0082' : '#666', // tím đậm khi active
      borderBottomWidth: selectedTab === 'me' ? 2 : 0,
      borderBottomColor: '#4B0082',
      paddingBottom: 4,
      fontSize: 15
    }}>
     🧍 {language === 'vi' ? 'Cá nhân' : 'My Posts'}
    </Text>
  </TouchableOpacity>
  <TouchableOpacity onPress={() => setSelectedTab('friend')} style={{ paddingHorizontal: 10 }}>
    <Text style={{
      fontWeight: selectedTab === 'friend' ? 'bold' : '600',
      color: selectedTab === 'friend' ? '#4B0082' : '#666',
      borderBottomWidth: selectedTab === 'friend' ? 2 : 0,
      borderBottomColor: '#4B0082',
      paddingBottom: 4,
      fontSize: 15
    }}>
      👯 {language === 'vi' ? 'Bạn bè' : 'Friends'}
    </Text>
  </TouchableOpacity>
  <TouchableOpacity onPress={() => setSelectedTab('global')} style={{ paddingHorizontal: 10 }}>
    <Text style={{
      fontWeight: selectedTab === 'global' ? 'bold' : '600',
      color: selectedTab === 'global' ? '#4B0082' : '#666',
      borderBottomWidth: selectedTab === 'global' ? 2 : 0,
      borderBottomColor: '#4B0082',
      paddingBottom: 4,
      fontSize: 15
    }}>
      🌍 {language === 'vi' ? 'Thế giới' : 'Global'}
    </Text>
  </TouchableOpacity>
</View>

            <FlatList
                data={posts}
                keyExtractor={(item, index) => item.id || `post-${index}`}
                contentContainerStyle={styles.postList}
                renderItem={({ item }) => {
                    const isLiked = item.likes.some((like) => like === accountLogin._id);
                    const isCaptionExpanded = expandedCaptions.includes(item.id);
                    const MAX_LINES = 3;
                    const shouldShowMore = item.caption.split(' ').length > 100;
                    return (
                        <View style={styles.postContainer}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                               <Image
  source={{ uri: item.user.avatarUrl || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y' }}
  style={styles.avatar}
/>
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
                            {item.imageUrl&& (
                                <TouchableOpacity onPress={() => handleImagePress(item.imageUrl)}>
  <Image source={{ uri: item.imageUrl }} style={styles.postImage} />
</TouchableOpacity>
                            )}
                            <View style={styles.interactionBar}>
                                <TouchableOpacity
                                    onPress={() => toggleLike(item._id)}
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
