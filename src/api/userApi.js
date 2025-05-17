import axios from 'axios';
import config from './config';

const api = axios.create({
    baseURL: `${config.API_URL}/api/users`,
    timeout: config.TIMEOUT,
    headers: { 'Content-Type': 'application/json' }
});

// 🟢 Login
export const login = async (username, password) => {
    const response = await api.post('/login', { username, password });
    return response.data;
};

// 🟢 Register
export const register = async (userData) => {
    const response = await api.post('/', userData);
    return response.data;
};

// 🟢 Get all users
export const getAllUsers = async () => {
    const response = await api.get('/');
    return response.data;
};

// 🟢 Get user by ID
export const getUserById = async (id) => {
    const response = await api.get(`/${id}`);
    return response.data;
};

// 🟢 Update user
export const updateUser = async (id, userData) => {
    const response = await api.put(`/${id}`, userData);
    return response.data;
};

// 🟢 Delete user
export const deleteUser = async (id) => {
    const response = await api.delete(`/${id}`);
    return response.data;
};

// 🟢 Add friend
export const addFriend = async (userId, friendId) => {
    const response = await api.post(`/${userId}/friends`, { friendId });
    return response.data;
};

// 🟢 Update friend status
export const updateFriendStatus = async (userId, friendId, status) => {
    const response = await api.patch(`/${userId}/friends`, { friendId, status });
    return response.data;
};

// 🟢 Send challenge
export const sendChallenge = async (userId, challengerId, receiverId) => {
    const response = await api.post(`/${userId}/challenges/send`, { challengerId, receiverId });
    return response.data;
};

// 🟢 Accept challenge
export const acceptChallenge = async (userId, challengeId) => {
    const response = await api.patch(`/${userId}/challenges/${challengeId}/accept`);
    return response.data;
};

// 🟢 Decline challenge
export const declineChallenge = async (userId, challengeId) => {
    const response = await api.patch(`/${userId}/challenges/${challengeId}/decline`);
    return response.data;
};

// 🟢 Cancel challenge
export const cancelChallenge = async (receiverId, challengeId) => {
    const response = await api.patch(`/${receiverId}/challenges/${challengeId}/cancel`);
    return response.data;
};


export const registerUser = async (userData) => {
    const response = await api.post('/register', userData);
    return response.data;
};

// 🟢 Request change password (Step 1)
export const requestChangePassword = async (email) => {
    const response = await api.post('/request-change-password', { email });
    return response.data;
};

// 🟢 Confirm change password (Step 2)
export const confirmChangePassword = async (email, code, newPassword) => {
    const response = await api.post('/confirm-change-password', { email, code, newPassword });
    return response.data;
};

// 🟢 Search users not yet friends or requested
export const searchUsers = async (query, userId) => {
    const response = await api.get(`/search?query=${encodeURIComponent(query)}&userId=${userId}`);
    return response.data;
};

// 🟢 Send friend request
export const sendFriendRequest = async (fromUserId, toUserId) => {
    const response = await api.post(`/friends/request`, { fromUserId, toUserId });
    return response.data;
};




// 🟢 Respond to friend request (accept or reject)
export const respondToFriendRequest = async (fromUserId, toUserId, accepted) => {
    const response = await api.post(`/friends/respond`, { fromUserId, toUserId, accepted });
    return response.data;
};


// 🟢 Get friend requests received by user
export const getFriendRequests = async (userId) => {
    const response = await api.get(`/${userId}/friends/requests`);
    return response.data;
};


export const unfriendUser = async (userId, friendId) => {
  const response = await api.delete(`/${userId}/unfriend/${friendId}`);
  return response.data;
};

