import Sound from 'react-native-sound';

let soundAttack: Sound | null = null;
let soundCapture: Sound | null = null;

export const loadSoundEffects = () => {
    soundAttack = new Sound(require('../assets/sounds/Nhacdanhquan.wav'), e => {
        if (e) console.log('Failed to load attack sound', e);
    });

    soundCapture = new Sound(require('../assets/sounds/Nhacanquan.mp3'), e => {
        if (e) console.log('Failed to load capture sound', e);
    });
};

export const playAttackSound = () => {
    soundAttack?.stop(() => soundAttack?.play());
};

export const playCaptureSound = () => {
    soundCapture?.stop(() => soundCapture?.play());
};
