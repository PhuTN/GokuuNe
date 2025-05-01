import Sound from 'react-native-sound';

let backgroundSound: Sound | null = null;

export const playBackgroundMusic = () => {
  Sound.setCategory('Playback');

  // 👉 Load nhạc bằng require nếu nằm trong project (như src/assets/sounds)
  backgroundSound = new Sound(
    require('../assets/sounds/Nhacnen.mp3'),
    error => {
      if (error) {
        console.log('Failed to load sound', error);
        return;
      }
      backgroundSound.setNumberOfLoops(-1); // Lặp lại
      backgroundSound.play(success => {
        if (!success) {
          console.log('Playback failed');
        }
      });
    },
  );
};

export const stopBackgroundMusic = () => {
  if (backgroundSound) {
    backgroundSound.stop(() => backgroundSound?.release());
    backgroundSound = null;
  }
};
