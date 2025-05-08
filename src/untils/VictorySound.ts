// // src/untils/VictorySound.ts

// import Sound from 'react-native-sound';

// let victorySound: Sound | null = null;

// export const loadVictorySound = () => {
//   victorySound = new Sound(
//     require('../assets/sounds/Nhacchienthang.wav'),
//     error => {
//       if (error) {
//         console.log('❌ Lỗi load nhạc chiến thắng:', error);
//       }
//     },
//   );
// };

// export const playVictorySound = () => {
//   victorySound?.stop(() => victorySound?.play());
// };

// export const stopVictorySound = () => {
//   victorySound?.stop(() => {});
// };
