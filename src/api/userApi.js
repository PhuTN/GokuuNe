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
