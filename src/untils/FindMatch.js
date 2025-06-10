// import { socket } from "./socket";


// export default function FindMatch(userId) {
//   return new Promise((resolve, reject) => {
//     if (!socket || !socket.connected) {
//       console.log("❌ Socket chưa kết nối. Đảm bảo đã login trước khi gọi FindMatch.");
//       return reject("❌ Socket chưa kết nối.");
//     }

//     console.log("📡 Gửi yêu cầu rank:find với userId:", userId);
//     socket.emit('rank:find', userId);

//     // Nhận sự kiện khi match thành công
//     const onMatched = (data) => {
//       console.log("✅ Nhận rank:matched:", data);
//       const { opponent } = data;

//       const isCurrentPlayerWhite = opponent._id > userId;
//       console.log("🎯 Bạn là", isCurrentPlayerWhite ? "Trắng" : "Đen");

//       const matchResult = isCurrentPlayerWhite
//         ? [userId, opponent]
//         : [opponent, userId];

//       // Cleanup
//       socket.off('rank:matched', onMatched);
//       clearTimeout(timeoutId);

//       console.log("🎮 Ghép trận hoàn tất:", matchResult);
//       resolve({ matchResult, isCurrentPlayerWhite });
//     };

//     socket.on('rank:matched', onMatched);

//     // Timeout sau 15s nếu không match
//     const timeoutId = setTimeout(() => {
//       console.warn("⏱ Timeout: Không tìm được đối thủ sau 15s.");
//       socket.off('rank:matched', onMatched);
//       reject("⏱ Timeout khi tìm trận.");
//     }, 1500000);
//   });
// }

import { socket } from "./socket";

export default function FindMatch(userId, opponentId = null) {
  return new Promise((resolve, reject) => {
    if (!socket || !socket.connected) {
      console.log("❌ Socket chưa kết nối.");
      return reject("❌ Socket chưa kết nối.");
    }

    const payload = opponentId
      ? { userId, opponentId } // ✅ nếu có đối thủ xác định
      : { userId };            // ✅ nếu tìm ngẫu nhiên

    console.log("📡 Gửi yêu cầu rank:find với payload:", payload);
    socket.emit("rank:find", payload);

    const onMatched = (data) => {
      console.log("✅ Nhận rank:matched:", data);
      const { opponent } = data;

      socket.off("rank:matched", onMatched);
      clearTimeout(timeoutId);

      resolve(opponent); // ✅ trả về opponent
    };

    socket.on("rank:matched", onMatched);

    const timeoutId = setTimeout(() => {
      console.warn("⏱ Timeout: Không tìm được đối thủ sau 15s.");
      socket.off("rank:matched", onMatched);
      reject("⏱ Timeout khi tìm trận.");
    },30000000);
  });
}