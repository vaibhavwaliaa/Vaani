import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';

const { width } = Dimensions.get('window');

export interface Language {
  code: string;
  name: string;
  nativeName: string;
}

const INDIAN_LANGUAGES: Language[] = [
  { code: 'hi-IN', name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'en-IN', name: 'English (India)', nativeName: 'English' },
  { code: 'bn-IN', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'te-IN', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'mr-IN', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'ta-IN', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'gu-IN', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'ur-IN', name: 'Urdu', nativeName: 'اردو' },
  { code: 'kn-IN', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml-IN', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'or-IN', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
  { code: 'pa-IN', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'as-IN', name: 'Assamese', nativeName: 'অসমীয়া' },
  { code: 'ne-IN', name: 'Nepali', nativeName: 'नेपाली' },
  { code: 'sa-IN', name: 'Sanskrit', nativeName: 'संस्कृत' },
];

interface LanguageSelectorProps {
  selectedLanguage: Language;
  onLanguageSelect: (language: Language) => void;
  isDarkMode: boolean;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onLanguageSelect,
  isDarkMode,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleLanguageSelect = (language: Language) => {
    onLanguageSelect(language);
    setIsVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.selector,
          {
            backgroundColor: isDarkMode ? '#2a2a2a' : '#f5f5f5',
            borderColor: isDarkMode ? '#4a4a4a' : '#ddd',
          },
        ]}
        onPress={() => setIsVisible(true)}
      >
        <View style={styles.selectedLanguage}>
          <Text
            style={[
              styles.selectedLanguageName,
              { color: isDarkMode ? '#ffffff' : '#000000' },
              !selectedLanguage.code && styles.placeholderStyle,
            ]}
          >
            {selectedLanguage.code ? selectedLanguage.name : 'Tap to select a language'}
          </Text>
          {selectedLanguage.code && (
            <Text
              style={[
                styles.selectedNativeName,
                { color: isDarkMode ? '#cccccc' : '#666666' },
              ]}
            >
              {selectedLanguage.nativeName}
            </Text>
          )}
        </View>
        <Text
          style={[
            styles.dropdownArrow,
            { color: isDarkMode ? '#ffffff' : '#000000' },
          ]}
        >
          ▼
        </Text>
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1}
          onPress={() => setIsVisible(false)}
        >
          <TouchableOpacity 
            activeOpacity={1}
            style={[
              styles.modalContent,
              {
                backgroundColor: isDarkMode ? '#2a2a2a' : '#ffffff',
              },
            ]}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHeader}>
              <Text
                style={[
                  styles.modalTitle,
                  { color: isDarkMode ? '#ffffff' : '#000000' },
                ]}
              >
                Select Language
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsVisible(false)}
              >
                <Text
                  style={[
                    styles.closeButtonText,
                    { color: isDarkMode ? '#ffffff' : '#000000' },
                  ]}
                >
                  ✕
                </Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView 
              style={styles.languageList}
              contentContainerStyle={styles.languageListContent}
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
            >
              {INDIAN_LANGUAGES.map((language) => (
                <TouchableOpacity
                  key={language.code}
                  style={[
                    styles.languageItem,
                    {
                      backgroundColor: isDarkMode ? '#3a3a3a' : '#ffffff',
                      borderBottomColor: isDarkMode ? '#4a4a4a' : '#e0e0e0',
                    },
                  ]}
                  onPress={() => handleLanguageSelect(language)}
                >
                  <View style={styles.languageInfo}>
                    <Text
                      style={[
                        styles.languageName,
                        { color: isDarkMode ? '#ffffff' : '#000000' },
                      ]}
                    >
                      {language.name}
                    </Text>
                    <Text
                      style={[
                        styles.nativeName,
                        { color: isDarkMode ? '#cccccc' : '#666666' },
                      ]}
                    >
                      {language.nativeName}
                    </Text>
                  </View>
                  {selectedLanguage.code === language.code && selectedLanguage.code !== '' && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    minHeight: 60,
  },
  selectedLanguage: {
    flex: 1,
  },
  selectedLanguageName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  selectedNativeName: {
    fontSize: 14,
    opacity: 0.8,
  },
  placeholderStyle: {
    opacity: 0.5,
    fontStyle: 'italic',
  },
  dropdownArrow: {
    fontSize: 12,
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.9,
    height: '70%',
    borderRadius: 16,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  languageList: {
    maxHeight: 500,
  },
  languageListContent: {
    paddingBottom: 10,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  nativeName: {
    fontSize: 14,
    opacity: 0.8,
  },
  checkmark: {
    fontSize: 18,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
});

export default LanguageSelector;