import axios from 'axios';
import config from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: `${config.API_URL}/api/users`,
  timeout: config.TIMEOUT,
  headers: {'Content-Type': 'application/json'},
});

// 🟢 Login
export const login = async (username, password) => {
  const response = await api.post('/login', {username, password});
  return response.data;
};

// 🟢 Register
export const register = async userData => {
  const response = await api.post('/', userData);
  return response.data;
};

// 🟢 Get all users
export const getAllUsers = async () => {
  const token = await AsyncStorage.getItem('token');
  const response = await api.get('/', {
    headers: {Authorization: `Bearer ${token}`},
  });
  return response.data;
};

// 🟢 Get user by ID
export const getUserById = async id => {
  const token = await AsyncStorage.getItem('token');
  const response = await api.get(`/${id}`, {
    headers: {Authorization: `Bearer ${token}`},
  });
  return response.data;
};

// 🟢 Update user
export const updateUser = async (id, userData) => {
  const token = await AsyncStorage.getItem('token');
  const response = await api.put(`/${id}`, userData, {
    headers: {Authorization: `Bearer ${token}`},
  });
  return response.data;
};

// 🟢 Delete user
export const deleteUser = async id => {
  const token = await AsyncStorage.getItem('token');
  const response = await api.delete(`/${id}`, {
    headers: {Authorization: `Bearer ${token}`},
  });
  return response.data;
};

// 🟢 Add friend
export const addFriend = async (userId, friendId) => {
  const token = await AsyncStorage.getItem('token');
  const response = await api.post(
    `/${userId}/friends`,
    {friendId},
    {
      headers: {Authorization: `Bearer ${token}`},
    },
  );
  return response.data;
};

// 🟢 Update friend status
export const updateFriendStatus = async (userId, friendId, status) => {
  const token = await AsyncStorage.getItem('token');
  const response = await api.patch(
    `/${userId}/friends`,
    {friendId, status},
    {
      headers: {Authorization: `Bearer ${token}`},
    },
  );
  return response.data;
};

// 🟢 Send challenge
export const sendChallenge = async (userId, challengerId, receiverId) => {
  const token = await AsyncStorage.getItem('token');
  const response = await api.post(
    `/${userId}/challenges/send`,
    {
      challengerId,
      receiverId,
    },
    {
      headers: {Authorization: `Bearer ${token}`},
    },
  );
  return response.data;
};

// 🟢 Accept challenge
export const acceptChallenge = async (userId, challengeId) => {
  const token = await AsyncStorage.getItem('token');
  const response = await api.patch(
    `/${userId}/challenges/${challengeId}/accept`,
    {
      headers: {Authorization: `Bearer ${token}`},
    },
  );
  return response.data;
};

// 🟢 Decline challenge
export const declineChallenge = async (userId, challengeId) => {
  const token = await AsyncStorage.getItem('token');
  const response = await api.patch(
    `/${userId}/challenges/${challengeId}/decline`,
    {
      headers: {Authorization: `Bearer ${token}`},
    },
  );
  return response.data;
};

// 🟢 Cancel challenge
export const cancelChallenge = async (receiverId, challengeId) => {
  const token = await AsyncStorage.getItem('token');
  const response = await api.patch(
    `/${receiverId}/challenges/${challengeId}/cancel`,
    {
      headers: {Authorization: `Bearer ${token}`},
    },
  );
  return response.data;
};

export const registerUser = async userData => {
  const response = await api.post('/register', userData);
  return response.data;
};

// 🟢 Request change password (Step 1)
export const requestChangePassword = async email => {
  const response = await api.post('/request-change-password', {email});
  return response.data;
};

// 🟢 Confirm change password (Step 2)
export const confirmChangePassword = async (email, code, newPassword) => {
  const response = await api.post('/confirm-change-password', {
    email,
    code,
    newPassword,
  });
  return response.data;
};

// 🟢 Search users not yet friends or requested
export const searchUsers = async (query, userId) => {
  const token = await AsyncStorage.getItem('token');
  const response = await api.get(
    `/search?query=${encodeURIComponent(query)}&userId=${userId}`,
    {
      headers: {Authorization: `Bearer ${token}`},
    },
  );
  return response.data;
};

// 🟢 Send friend request
export const sendFriendRequest = async (fromUserId, toUserId) => {
  const token = await AsyncStorage.getItem('token');
  const response = await api.post(
    `/friends/request`,
    {fromUserId, toUserId},
    {
      headers: {Authorization: `Bearer ${token}`},
    },
  );
  return response.data;
};

// 🟢 Respond to friend request (accept or reject)
export const respondToFriendRequest = async (
  fromUserId,
  toUserId,
  accepted,
) => {
  const token = await AsyncStorage.getItem('token');
  const response = await api.post(
    `/friends/respond`,
    {
      fromUserId,
      toUserId,
      accepted,
    },
    {
      headers: {Authorization: `Bearer ${token}`},
    },
  );
  return response.data;
};

// 🟢 Get friend requests received by user
export const getFriendRequests = async userId => {
  const token = await AsyncStorage.getItem('token');
  const response = await api.get(`/${userId}/friends/requests`, {
    headers: {Authorization: `Bearer ${token}`},
  });
  return response.data;
};

export const unfriendUser = async (userId, friendId) => {
  const token = await AsyncStorage.getItem('token');
  const response = await api.delete(`/${userId}/unfriend/${friendId}`, {
    headers: {Authorization: `Bearer ${token}`},
  });
  return response.data;
};

export const getLeaderBoard = async () => {
  const response = await api.get('/leaderboard');
  return response.data;
};


// Gửi thách đấu trực tiếp
export const sendChallengeDirect = async (myId, opponentId) => {
  const token = await AsyncStorage.getItem('token');
  const response = await api.post(
    '/challenges/direct/send',
    { myId, opponentId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// Chấp nhận thách đấu trực tiếp
export const acceptChallengeDirect = async (myId, opponentId) => {
  const token = await AsyncStorage.getItem('token');
  const response = await api.post(
    '/challenges/direct/accept',
    { myId, opponentId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// Từ chối thách đấu trực tiếp
export const declineChallengeDirect = async (myId, opponentId) => {
  const token = await AsyncStorage.getItem('token');
  const response = await api.post(
    '/challenges/direct/decline',
    { myId, opponentId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// Thoát khỏi thách đấu
export const outChallenge = async userId => {
  const token = await AsyncStorage.getItem('token');
  const response = await api.post(
    '/challenges/out',
    { userId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// Xử lý khi offline (xóa waitId và tất cả challenge liên quan)
export const offlineChallenge = async userId => {
  const token = await AsyncStorage.getItem('token');
  const response = await api.post(
    '/challenges/offline',
    { userId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};
