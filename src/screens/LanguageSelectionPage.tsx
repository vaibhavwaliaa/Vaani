import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LanguageSelector, { Language } from '../components/LanguageSelector';

interface LanguageSelectionPageProps {
  onNext: (selectedLanguage: Language) => void;
  onBack: () => void;
}

const LanguageSelectionPage: React.FC<LanguageSelectionPageProps> = ({
  onNext,
  onBack,
}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const [selectedLanguage, setSelectedLanguage] = useState<Language>({ 
    code: '', 
    name: 'Select a language', 
    nativeName: '' 
  });

  const handleNext = () => {
    if (!selectedLanguage.code) {
      Alert.alert('Language Required', 'Please select a language to continue.');
      return;
    }
    onNext(selectedLanguage);
  };

  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
    flex: 1,
  };

  const textColor = isDarkMode ? '#ffffff' : '#000000';
  const cardBg = isDarkMode ? '#2a2a2a' : '#f8f9fa';
  const buttonBg = isDarkMode ? '#4a90e2' : '#007AFF';
  const secondaryButtonBg = isDarkMode ? '#333333' : '#e0e0e0';
  const secondaryButtonText = isDarkMode ? '#ffffff' : '#333333';

  return (
    <SafeAreaView style={backgroundStyle}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: textColor }]}>
            Language Selection
          </Text>
          <Text style={[styles.subtitle, { color: textColor }]}>
            What language do you want your output?
          </Text>
        </View>

        {/* Language Selection Card */}
        <View style={[styles.selectionCard, { backgroundColor: cardBg }]}>
          <Text style={[styles.cardTitle, { color: textColor }]}>
            Choose your preferred language
          </Text>
          
          <LanguageSelector
            selectedLanguage={selectedLanguage}
            onLanguageSelect={setSelectedLanguage}
            isDarkMode={isDarkMode}
          />

          {selectedLanguage.code ? (
            <View style={styles.selectedInfo}>
              <Text style={[styles.selectedText, { color: textColor }]}>
                Selected: <Text style={styles.selectedLanguageName}>{selectedLanguage.name}</Text>
              </Text>
              <Text style={[styles.selectedNativeName, { color: textColor }]}>
                {selectedLanguage.nativeName}
              </Text>
            </View>
          ) : null}
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton, { backgroundColor: secondaryButtonBg }]}
            onPress={onBack}
          >
            <Text style={[styles.buttonText, { color: secondaryButtonText }]}>
              Back
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              styles.primaryButton,
              { backgroundColor: buttonBg },
              !selectedLanguage.code && styles.disabledButton,
            ]}
            onPress={handleNext}
            disabled={!selectedLanguage.code}
          >
            <Text style={[styles.buttonText, styles.primaryButtonText]}>
              Continue
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  selectionCard: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 40,
    minHeight: 200,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  selectedInfo: {
    marginTop: 20,
    padding: 16,
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    borderRadius: 12,
  },
  selectedText: {
    fontSize: 16,
    textAlign: 'center',
  },
  selectedLanguage: {
    fontWeight: 'bold',
    color: '#4a90e2',
  },
  selectedLanguageName: {
    fontWeight: 'bold',
    color: '#4a90e2',
  },
  selectedNativeName: {
    fontSize: 14,
    opacity: 0.8,
    marginTop: 4,
    textAlign: 'center',
  },
  placeholderSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    minHeight: 60,
  },
  placeholderText: {
    fontSize: 16,
    opacity: 0.7,
  },
  placeholderTextDark: {
    color: '#cccccc',
  },
  placeholderTextLight: {
    color: '#666666',
  },
  dropdownArrow: {
    fontSize: 12,
    marginLeft: 10,
  },
  dropdownArrowDark: {
    color: '#cccccc',
  },
  dropdownArrowLight: {
    color: '#666666',
  },
  placeholderBgDark: {
    backgroundColor: '#333333',
  },
  placeholderBgLight: {
    backgroundColor: '#f0f0f0',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  primaryButtonText: {
    color: '#ffffff',
  },
});

export default LanguageSelectionPage;