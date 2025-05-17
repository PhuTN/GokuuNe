import axios from 'axios';
import config from './config';

const chatApi = axios.create({
    baseURL: `${config.API_URL}/api/chat`,
    timeout: config.TIMEOUT,
    headers: { 'Content-Type': 'application/json' }
});

// 🟢 Create or get conversation between 2 users
export const createOrGetConversation = async (user1, user2) => {
    const response = await chatApi.post('/conversations', { user1, user2 });
    return response.data;
};

// 🟢 Get conversation details by ID
export const getConversationById = async (conversationId) => {
    const response = await chatApi.get(`/conversations/${conversationId}`);
    return response.data;
};

// 🟢 Send message to conversation
export const sendMessage = async (conversationId, sender, text) => {
    const response = await chatApi.post(`/conversations/${conversationId}/messages`, { sender, text });
    return response.data;
};

// 🟢 Get all conversations of a user
export const getUserConversations = async (userId) => {
    const response = await chatApi.get(`/users/${userId}/conversations`);
    return response.data;
};

export const markAllMessagesRead = async (conversationId, userId) => {
    const response = await chatApi.put(`/conversations/${conversationId}/mark-read/${userId}`);
    return response.data;
};
export const getUnreadConversationCount = async (userId) => {
    const response = await chatApi.get(`/conversations/unread-count/${userId}`);
    return response.data;
};