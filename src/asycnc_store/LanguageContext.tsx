import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type LanguageType = 'vi' | 'en';

interface LanguageContextType {
  language: LanguageType;
  toggleLanguage: () => Promise<void>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<LanguageType>('vi');

  useEffect(() => {
    const loadLang = async () => {
      const savedLang = await AsyncStorage.getItem('appLanguage');
      if (savedLang === 'vi' || savedLang === 'en') {
        setLanguage(savedLang);
      }
    };
    loadLang();
  }, []);

  const toggleLanguage = async () => {
    const newLang: LanguageType = language === 'vi' ? 'en' : 'vi';
    setLanguage(newLang);
    await AsyncStorage.setItem('appLanguage', newLang);
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
