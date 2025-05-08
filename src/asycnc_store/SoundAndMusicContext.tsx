import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Sound from 'react-native-sound';

export type SoundEffectType = 'on' | 'off';
export type BackgroundMusicType = 'on' | 'off';
export type NotificationSoundType = 'on' | 'off';

interface SoundEffectContextType {
  soundEffectEnabled: SoundEffectType;
  toggleSoundEffect: () => Promise<void>;
  playMoveSound: () => void;
  playCaptureSound: () => void;
  playWinSound: () => void;
  playLoseSound: () => void;
  soundEffectVolume: number;
  setSoundEffectVolume: (volume: number) => void;
}

interface BackgroundMusicContextType {
  backgroundMusicEnabled: BackgroundMusicType;
  toggleBackgroundMusic: () => Promise<void>;
  backgroundMusicVolume: number;
  setBackgroundMusicVolume: (volume: number) => void;
}

const SoundEffectContext = createContext<SoundEffectContextType | undefined>(undefined);
const BackgroundMusicContext = createContext<BackgroundMusicContextType | undefined>(undefined);

// Background music instance
let backgroundMusic: Sound | null = null;
let moveSound: Sound | null = null;
let captureSound: Sound | null = null;
let winSound: Sound | null = null;
let loseSound: Sound | null = null;

export const SoundEffectProvider = ({ children }: { children: ReactNode }) => {
  const [soundEffectEnabled, setSoundEffectEnabled] = useState<SoundEffectType>('on');
  const [soundEffectVolume, setSoundEffectVolume] = useState(1); // Default volume to 1 (max)

  useEffect(() => {
    const loadSoundSetting = async () => {
      const savedSetting = await AsyncStorage.getItem('soundEffectEnabled');
      if (savedSetting === 'on' || savedSetting === 'off') {
        setSoundEffectEnabled(savedSetting);
      }
    };
    loadSoundSetting();

    moveSound = new Sound('move_piece.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('Failed to load move sound:', error);
      }
    });

    captureSound = new Sound('capture_piece.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('Failed to load capture sound:', error);
      }
    });

    winSound = new Sound('win_music.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('Failed to load win sound:', error);
      }
    });

    loseSound = new Sound('lose_music.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('Failed to load lose sound:', error);
      }
    });

    return () => {
      moveSound?.release();  // Giải phóng tài nguyên khi không còn sử dụng
      captureSound?.release();
      winSound?.release();
      loseSound?.release();
    };
  }, []);

  const toggleSoundEffect = async () => {
    const newSetting: SoundEffectType = soundEffectEnabled === 'on' ? 'off' : 'on';
    setSoundEffectEnabled(newSetting);
    await AsyncStorage.setItem('soundEffectEnabled', newSetting);
  };

  const playMoveSound = () => {
    if (soundEffectEnabled === 'on') {
      moveSound?.setVolume(soundEffectVolume);
      moveSound?.play();
    }
  };

  const playCaptureSound = () => {
    if (soundEffectEnabled === 'on') {
      captureSound?.setVolume(soundEffectVolume);
      captureSound?.play();
    }
  };

  const playWinSound = () => {
    if (soundEffectEnabled === 'on') {
      winSound?.setVolume(soundEffectVolume);
      winSound?.play();
    }
  };

  const playLoseSound = () => {
    if (soundEffectEnabled === 'on') {
      loseSound?.setVolume(soundEffectVolume);
      loseSound?.play();
    }
  };

  const setMusicVolume = (volume: number) => {
    setSoundEffectVolume(volume);
    captureSound?.setVolume(volume);
    moveSound?.setVolume(volume);
    winSound?.setVolume(volume);
    loseSound?.setVolume(volume);
  };

  return (
    <SoundEffectContext.Provider value={{ soundEffectEnabled, toggleSoundEffect, playMoveSound, playCaptureSound, playWinSound, playLoseSound, soundEffectVolume,setSoundEffectVolume: setMusicVolume}}>
      {children}
    </SoundEffectContext.Provider>
  );
};

export const BackgroundMusicProvider = ({ children }: { children: ReactNode }) => {
  const [backgroundMusicEnabled, setBackgroundMusicEnabled] = useState<BackgroundMusicType>('off');
  const [backgroundMusicVolume, setBackgroundMusicVolume] = useState(1); // Default volume to 1 (max)

  useEffect(() => {
    const loadMusicSetting = async () => {
      const savedSetting = await AsyncStorage.getItem('backgroundMusicEnabled');
      if (savedSetting === 'on' || savedSetting === 'off') {
        setBackgroundMusicEnabled(savedSetting);
        if (savedSetting === 'on') {
          initAndPlayMusic();
        }
      }
    };
    loadMusicSetting();

    return () => {
      backgroundMusic?.release(); // Giải phóng tài nguyên khi component unmount
    };
  }, []);

  const initAndPlayMusic = () => {
    // Khởi tạo nhạc nền
    if (!backgroundMusic) {
      backgroundMusic = new Sound('background_music.wav', Sound.MAIN_BUNDLE, (error) => {
        if (error) {
          console.log('Failed to load background music:', error);
          return;
        }
        backgroundMusic?.setVolume(backgroundMusicVolume);
        backgroundMusic?.setNumberOfLoops(-1); // Lặp vô hạn
        backgroundMusic?.play();
      });
    } else {
      // Reset và phát lại từ đầu
      backgroundMusic.setVolume(backgroundMusicVolume);
      backgroundMusic.setNumberOfLoops(-1);
      backgroundMusic.play();
    }
  };

  const toggleBackgroundMusic = async () => {
    const newSetting: BackgroundMusicType = backgroundMusicEnabled === 'on' ? 'off' : 'on';
    setBackgroundMusicEnabled(newSetting);
    await AsyncStorage.setItem('backgroundMusicEnabled', newSetting);

    if (newSetting === 'on') {
      initAndPlayMusic();
    } else {
      backgroundMusic?.stop(() => {
        backgroundMusic?.release(); // Giải phóng tài nguyên
        backgroundMusic = null;
      });
    }
  };

  const setMusicVolume = (volume: number) => {
    setBackgroundMusicVolume(volume);
    backgroundMusic?.setVolume(volume);
  };

  return (
    <BackgroundMusicContext.Provider value={{ backgroundMusicEnabled, toggleBackgroundMusic, backgroundMusicVolume, setBackgroundMusicVolume: setMusicVolume }}>
      {children}
    </BackgroundMusicContext.Provider>
  );
};

export const useSoundEffect = () => {
  const context = useContext(SoundEffectContext);
  if (!context) {
    throw new Error('useSoundEffect must be used within a SoundEffectProvider');
  }
  return context;
};

export const useBackgroundMusic = () => {
  const context = useContext(BackgroundMusicContext);
  if (!context) {
    throw new Error('useBackgroundMusic must be used within a BackgroundMusicProvider');
  }
  return context;
};
