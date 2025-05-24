import axios from 'axios';
import config from './config';

const aiApi = axios.create({
    baseURL: `${config.API_URL}/api/gameofgo`,
    timeout: config.TIMEOUT,
    headers: { 'Content-Type': 'application/json' }
});

// 🟢 Bắt đầu phiên chơi AI
export const startAIMatch = async ({ userId, difficulty = 'normal', playerColor = 'B', boardSize = 19 }) => {
    const response = await aiApi.post('/start-ai-match', {
        userId,
        difficulty,
        playerColor,
        boardSize
    });
    return response.data;
};

// 🟢 Gửi nước đi và nhận phản hồi của AI
export const playMoveWithAI = async ({ userId, move }) => {
    const response = await aiApi.post('/play-ai', {
        userId,
        move
    });
    return response.data; // { playerMove: 'D4', aiMove: 'Q16' }
};

// 🟢 Tắt engine của người chơi (kết thúc phiên)
export const stopAIMatch = async (userId) => {
    const response = await aiApi.post('/stop-ai', { userId });
    return response.data;
};
