import io from 'socket.io-client';
import config from '../api/config';        // ✅ nếu bạn có config.API_URL

// ✅ Tạo socket instance
export const socket = io(config.API_URL || 'http://localhost:3000', {
    autoConnect: false      // ✅ không tự connect, chỉ connect khi login
});

// ✅ Connect + emit user:online
export const connectSocket = (userId) => {
    if (!socket.connected) {
        socket.connect();
    }
    socket.emit('user:online', userId);   // ✅ đúng với BE của bạn
};

// ✅ Disconnect khi logout hoặc app close
export const disconnectSocket = () => {
    if (socket.connected) {
        socket.disconnect();
    }
};
