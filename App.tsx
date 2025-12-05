/**
 * Speech to Text Mobile App
 * React Native CLI with TypeWriter Effect and Navigation
 *
 * @format
 */

import React, { useState } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LandingPage from './src/screens/LandingPage';
import LanguageSelectionPage from './src/screens/LanguageSelectionPage';
import SpeechToTextPage from './src/screens/SpeechToTextPage';
import { SettingsPage } from './src/screens/SettingsPage';
import { Language } from './src/components/LanguageSelector';

type Screen = 'landing' | 'languageSelection' | 'speechToText' | 'settings';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [selectedLanguage, setSelectedLanguage] = useState<Language | undefined>();
  const isDarkMode = useColorScheme() === 'dark';

  const handleNavigateToLanguageSelection = () => {
    setCurrentScreen('languageSelection');
  };

  const handleNavigateToSettings = () => {
    setCurrentScreen('settings');
  };

  const handleNavigateToSpeechToText = (language: Language) => {
    setSelectedLanguage(language);
    setCurrentScreen('speechToText');
  };

  const handleNavigateToLanding = () => {
    setCurrentScreen('landing');
  };

  const handleBackToLanguageSelection = () => {
    setCurrentScreen('languageSelection');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'landing':
        return <LandingPage onNext={handleNavigateToLanguageSelection} onSettings={handleNavigateToSettings} />;
      case 'languageSelection':
        return (
          <LanguageSelectionPage 
            onNext={handleNavigateToSpeechToText}
            onBack={handleNavigateToLanding}
          />
        );
      case 'speechToText':
        return (
          <SpeechToTextPage 
            selectedLanguage={selectedLanguage}
            onBack={handleBackToLanguageSelection} 
          />
        );
      case 'settings':
        return <SettingsPage onBack={handleNavigateToLanding} />;
      default:
        return <LandingPage onNext={handleNavigateToLanguageSelection} />;
    }
  };

  return (
    <SafeAreaProvider>
      <StatusBar 
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkMode ? '#000000' : '#ffffff'}
      />
      {renderScreen()}
    </SafeAreaProvider>
  );
}

export default App;
