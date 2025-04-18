import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { LanguageProvider } from './src/asycnc_store/LanguageContext';
import { ThemeProvider } from './src/asycnc_store/ThemeContext';
import { NotificationProvider } from './src/asycnc_store/NotificationContext';
import FlashMessage from "react-native-flash-message";

export default function App() {
  return (
    <NotificationProvider>
      <ThemeProvider>
        <FlashMessage position="top" />
        <LanguageProvider>
          <AppNavigator />
        </LanguageProvider>
      </ThemeProvider>
    </NotificationProvider>
  );
}

