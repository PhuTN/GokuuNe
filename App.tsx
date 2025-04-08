import React from 'react';

import AppNavigator from './src/navigation/AppNavigator';

<<<<<<< HEAD
const App = () => {
  return <AppNavigator />;
};

export default App;
=======
import { LanguageProvider } from './src/asycnc_store/LanguageContext';
import { ThemeProvider } from './src/asycnc_store/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppNavigator />
      </LanguageProvider>
    </ThemeProvider>
  );
}
>>>>>>> main
