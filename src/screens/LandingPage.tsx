import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Typewriter from '../components/Typewriter';

const { width } = Dimensions.get('window');

interface LandingPageProps {
  onNext: () => void;
  onSettings?: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNext, onSettings }) => {
  const [showButton, setShowButton] = useState(false);
  const [buttonOpacity] = useState(new Animated.Value(0));
  const isDarkMode = useColorScheme() === 'dark';

  const handleTypewriterComplete = () => {
    setShowButton(true);
    Animated.timing(buttonOpacity, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  };

  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#000000' : '#ffffff',
  };

  const textColor = isDarkMode ? '#ffffff' : '#000000';
  const accentColor = '#007AFF';

  return (
    <SafeAreaView style={[styles.container, backgroundStyle]}>
      <View style={styles.content}>
        {/* Settings Button */}
        {onSettings && (
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={onSettings}
            activeOpacity={0.7}
          >
            <Typewriter
              text="⚙️ Settings"
              speed={50}
              style={[styles.settingsText, { color: accentColor }]}
            />
          </TouchableOpacity>
        )}

        {/* Main Title Area */}
        <View style={styles.titleContainer}>
          <Typewriter
            text="Vaani"
            speed={150}
            style={[styles.mainTitle, { color: textColor }]}
            onComplete={handleTypewriterComplete}
          />
        </View>

        {/* Subtitle */}
        <View style={styles.subtitleContainer}>
          <Typewriter
            text="Transform your voice into text effortlessly"
            speed={80}
            style={[styles.subtitle, { color: textColor }]}
          />
        </View>

        {/* Next Button */}
        {showButton && (
          <Animated.View 
            style={[
              styles.buttonContainer,
              { opacity: buttonOpacity }
            ]}
          >
            <TouchableOpacity
              style={[styles.nextButton, { backgroundColor: accentColor }]}
              onPress={onNext}
              activeOpacity={0.8}
            >
              <Typewriter
                text="Get Started"
                speed={100}
                style={styles.buttonText}
              />
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Decorative Elements */}
        <View style={styles.decorativeContainer}>
          <View style={[styles.circle1, styles.circle1Opacity, { backgroundColor: accentColor }]} />
          <View style={[styles.circle2, styles.circle2Opacity, { backgroundColor: accentColor }]} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  settingsButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 10,
    zIndex: 10,
  },
  settingsText: {
    fontSize: 16,
    fontWeight: '600',
  },
  titleContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 2,
  },
  subtitleContainer: {
    marginBottom: 60,
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 26,
    opacity: 0.7,
  },
  buttonContainer: {
    width: '80%',
    alignItems: 'center',
  },
  nextButton: {
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  decorativeContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  circle1: {
    position: 'absolute',
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: (width * 0.8) / 2,
    top: -width * 0.4,
    right: -width * 0.4,
  },
  circle2: {
    position: 'absolute',
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: (width * 0.6) / 2,
    bottom: -width * 0.3,
    left: -width * 0.3,
  },
  circle1Opacity: {
    opacity: 0.1,
  },
  circle2Opacity: {
    opacity: 0.05,
  },
});

export default LandingPage;