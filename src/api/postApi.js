import axios from 'axios';
import config from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const postApi = axios.create({
  baseURL: `${config.API_URL}/api/posts`,
  timeout: config.TIMEOUT,
  headers: { 'Content-Type': 'application/json' },
});

// 🛡️ Tự động gắn token vào mỗi request
postApi.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  console.log(token)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const getAllPosts = async () => {
  const response = await postApi.get('/');
  return response.data;
};

export const createPost = async (postData) => {
  const response = await postApi.post('/', postData);
  return response.data;
};

export const getMyPosts = async () => {
  const response = await postApi.get('/me');
  return response.data;
};

export const getFriendPosts = async () => {
  const response = await postApi.get('/friends');
  return response.data;
};

export const getGlobalPosts = async () => {
  const response = await postApi.get('/global');
  return response.data;
};

export const getPostById = async (postId) => {
  const response = await postApi.get(`/${postId}`);
  return response.data;
};

export const toggleLikePost = async (postId) => {
  const response = await postApi.post(`/${postId}/like`);
  return response.data;
};

export const commentOnPost = async (postId, content) => {
  const response = await postApi.post(`/${postId}/comment`, { content });
  return response.data;
};

export default postApi;
