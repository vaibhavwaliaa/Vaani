import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
  PermissionsAndroid,
  Platform,
  Alert,
  Switch,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Voice from '@react-native-voice/voice';
import { Language } from '../components/LanguageSelector';
import SuperSimplifier from '../services/SuperSimplifier';
import { colors } from '../styles/colors';
import { typography, spacing, borderRadius, shadows } from '../styles/theme';
import VaaniLogo from '../assets/VaaniLogo';

const { width } = Dimensions.get('window');

interface SpeechToTextPageProps {
  selectedLanguage?: Language;
  onBack: () => void;
}

const SpeechToTextPage: React.FC<SpeechToTextPageProps> = ({
  selectedLanguage,
  onBack,
}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const [recognizedText, setRecognizedText] = useState('');
  const [simplifiedText, setSimplifiedText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [status, setStatus] = useState('Ready to listen');
  const [simplifyEnabled, setSimplifyEnabled] = useState(true);
  const [showOriginal, setShowOriginal] = useState(false);
  
  // Animations
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;

  // Pulse animation for microphone when listening
  useEffect(() => {
    if (isListening) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
      
      Animated.loop(
        Animated.timing(waveAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        })
      ).start();
    } else {
      pulseAnim.setValue(1);
      waveAnim.setValue(0);
    }
  }, [isListening, pulseAnim, waveAnim]);

  // Language code mapping
  const getLanguageCode = () => {
    const languageMap: { [key: string]: string } = {
      'Hindi': 'hi-IN',
      'English': 'en-US',
      'Bengali': 'bn-IN',
      'Telugu': 'te-IN',
      'Marathi': 'mr-IN',
      'Tamil': 'ta-IN',
      'Gujarati': 'gu-IN',
      'Urdu': 'ur-PK',
      'Kannada': 'kn-IN',
      'Malayalam': 'ml-IN',
      'Odia': 'or-IN',
      'Punjabi': 'pa-IN',
      'Assamese': 'as-IN',
      'Nepali': 'ne-NP',
      'Sanskrit': 'sa-IN'
    };
    return languageMap[selectedLanguage?.name || 'English'] || 'en-US';
  };

  useEffect(() => {
    if (!Voice) {
      Alert.alert('Error', 'Speech recognition module is not available.');
      return;
    }

    Voice.onSpeechStart = () => {
      setStatus('Listening... Speak now!');
    };

    Voice.onSpeechEnd = () => {
      setIsListening(false);
      setStatus('Recognition complete');
    };

    Voice.onSpeechResults = (event: any) => {
      if (event.value && event.value.length > 0) {
        const newText = event.value[0];
        console.log('Speech Result:', newText);
        
        setRecognizedText(prevText => {
          const fullText = prevText + (prevText ? ' ' : '') + newText;
          console.log('Full Text:', fullText);
          
          // Process text immediately
          if (simplifyEnabled) {
            try {
              const simplified = SuperSimplifier.simplify(fullText, {
                maxWordsPerSentence: 10,
                removeComplexWords: true,
                addEmojis: false,
                expandAbbreviations: true,
                language: selectedLanguage?.name || 'English',
              });
              console.log('Simplified Text:', simplified);
              setSimplifiedText(simplified);
            } catch (error) {
              console.error('SuperSimplifier Error:', error);
              setSimplifiedText(fullText); // Fallback to original
            }
          } else {
            setSimplifiedText(fullText);
          }
          
          return fullText;
        });
        setStatus('Speech recognized!');
      }
    };

    Voice.onSpeechPartialResults = (event: any) => {
      if (event.value && event.value.length > 0) {
        setStatus(`Hearing: "${event.value[0]}"`);
      }
    };

    Voice.onSpeechError = (event: any) => {
      setIsListening(false);
      if (event.error?.message === 'No speech input' || event.error?.code === '7') {
        setStatus('No speech detected');
      } else {
        setStatus('Error occurred');
      }
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners).catch(() => {});
    };
  }, [simplifyEnabled, selectedLanguage?.name]);

  // Handle simplification toggle
  useEffect(() => {
    if (recognizedText) {
      console.log('Simplification Toggle Changed:', { simplifyEnabled, recognizedText });
      
      if (simplifyEnabled) {
        try {
          const simplified = SuperSimplifier.simplify(recognizedText, {
            maxWordsPerSentence: 10,
            removeComplexWords: true,
            addEmojis: false,
            expandAbbreviations: true,
            language: selectedLanguage?.name || 'English',
          });
          console.log('Re-simplified Text:', simplified);
          setSimplifiedText(simplified);
        } catch (error) {
          console.error('Re-simplification Error:', error);
          setSimplifiedText(recognizedText);
        }
      } else {
        console.log('Using Original Text');
        setSimplifiedText(recognizedText);
      }
    }
  }, [simplifyEnabled, recognizedText, selectedLanguage?.name]);

  const requestMicrophonePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission',
            message: 'This app needs access to your microphone.',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        return false;
      }
    }
    return true;
  };

  const startListening = async () => {
    try {
      if (!Voice) {
        Alert.alert('Error', 'Speech recognition is not available.');
        return;
      }

      const hasPermission = await requestMicrophonePermission();
      if (!hasPermission) {
        Alert.alert('Permission Required', 'Microphone permission is required.');
        return;
      }

      setStatus('Starting...');
      setIsListening(true);
      const languageCode = getLanguageCode();
      await Voice.start(languageCode);
    } catch (error: any) {
      setIsListening(false);
      setStatus('Failed to start');
      Alert.alert('Error', `Failed to start: ${error.message || 'Unknown error'}`);
    }
  };

  const stopListening = async () => {
    try {
      setStatus('Stopping...');
      await Voice.stop();
      setIsListening(false);
    } catch (error) {
      setIsListening(false);
      setStatus('Ready to listen');
    }
  };

  const clearText = () => {
    setRecognizedText('');
    setSimplifiedText('');
    setStatus('Ready to listen');
  };

  const theme = isDarkMode ? colors.dark : colors.light;

  const getStatusColor = () => {
    if (isListening) return colors.semantic.listening;
    if (status.includes('complete') || status.includes('recognized')) return colors.semantic.ready;
    if (status.includes('Starting') || status.includes('Hearing')) return colors.semantic.processing;
    if (status.includes('Failed') || status.includes('Error')) return colors.error.main;
    if (status.includes('No speech')) return colors.warning.main;
    return colors.semantic.ready;
  };

  const waveOpacity = waveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0],
  });

  const waveScale = waveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 2.5],
  });

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      {/* Gradient Header */}
      <View style={[styles.gradientHeader, { 
        backgroundColor: isDarkMode 
          ? 'rgba(37, 99, 235, 0.1)' 
          : 'rgba(37, 99, 235, 0.05)' 
      }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={onBack}
            activeOpacity={0.7}
          >
            <Text style={[styles.backIcon, { color: colors.primary.main }]}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={[styles.headerTitle, { color: theme.text }]}>
              Vaani
            </Text>
            <Text style={[styles.headerSubtitle, { color: theme.subtext }]}>
              {selectedLanguage ? selectedLanguage.name : 'English'}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
            <View style={styles.statusDot} />
          </View>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Language Card */}
        {selectedLanguage && (
          <View style={[styles.languageCard, { backgroundColor: theme.surface }, shadows.md]}>
            <View style={styles.languageCardContent}>
              <View style={[styles.languageEmojiCircle, { backgroundColor: colors.primary.light }]}>
                <VaaniLogo size={32} />
              </View>
              <View style={styles.languageInfo}>
                <Text style={[styles.languageCardName, { color: theme.text }]}>
                  {selectedLanguage.name}
                </Text>
                <Text style={[styles.languageCardNative, { color: theme.subtext }]}>
                  {selectedLanguage.nativeName}
                </Text>
              </View>
              <View style={styles.languageStatus}>
                <View style={[styles.activeIndicator, { backgroundColor: colors.success.main }]} />
                <Text style={[styles.activeText, { color: colors.success.main }]}>Active</Text>
              </View>
            </View>
          </View>
        )}

        {/* Microphone Hero Section */}
        <View style={[styles.micSection, { backgroundColor: theme.surface }, shadows.lg]}>
          <View style={styles.micContainer}>
            {/* Wave animations */}
            {isListening && (
              <>
                <Animated.View
                  style={[
                    styles.waveCircle,
                    {
                      opacity: waveOpacity,
                      transform: [{ scale: waveScale }],
                      borderColor: colors.semantic.listening,
                    },
                  ]}
                />
                <Animated.View
                  style={[
                    styles.waveCircle,
                    styles.waveCircle2,
                    {
                      opacity: waveOpacity,
                      transform: [{ scale: waveScale }],
                      borderColor: colors.semantic.listening,
                    },
                  ]}
                />
              </>
            )}
            
            {/* Microphone Button */}
            <TouchableOpacity
              style={[
                styles.micButton,
                { 
                  backgroundColor: isListening 
                    ? colors.semantic.listening 
                    : colors.primary.main 
                },
                shadows.xl,
              ]}
              onPress={isListening ? stopListening : startListening}
              activeOpacity={0.85}
            >
              <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <View style={styles.micIconContainer}>
                  {isListening ? (
                    <View style={[styles.stopIcon, { backgroundColor: colors.white }]} />
                  ) : (
                    <View style={styles.micIcon} />
                  )}
                </View>
              </Animated.View>
              {/* Subtle gradient overlay */}
              <View style={styles.micButtonOverlay} />
            </TouchableOpacity>
          </View>

          {/* Status */}
          <View style={styles.statusContainer}>
            <Text style={[styles.statusLabel, { color: theme.subtext }]}>Status</Text>
            <Text style={[styles.statusText, { color: getStatusColor() }]}>
              {status}
            </Text>
          </View>

          <Text style={[styles.actionHint, { color: theme.subtext }]}>
            {isListening ? 'Tap to stop recording' : 'Tap microphone to start'}
          </Text>
        </View>

        {/* Controls Card */}
        <View style={[styles.controlsCard, { backgroundColor: theme.surface }, shadows.md]}>
          <Text style={[styles.controlsTitle, { color: theme.text }]}>
            Accessibility Settings
          </Text>
          
          {/* Easy Reading Toggle */}
          <View style={styles.controlItem}>
            <View style={styles.controlLeft}>
              <View style={[styles.iconCircle, { backgroundColor: colors.secondary.light }]}>
                <View style={[styles.iconDot, { backgroundColor: colors.secondary.main }]} />
              </View>
              <View style={styles.controlTextContainer}>
                <Text style={[styles.controlLabel, { color: theme.text }]}>
                  Easy Reading Mode
                </Text>
                <Text style={[styles.controlSubtext, { color: theme.subtext }]}>
                  Simplified for Deaf & low-literacy users
                </Text>
              </View>
            </View>
            <Switch
              value={simplifyEnabled}
              onValueChange={setSimplifyEnabled}
              trackColor={{ false: theme.border, true: colors.secondary.main }}
              thumbColor={colors.white}
              ios_backgroundColor={theme.border}
            />
          </View>

          {/* Show Original Toggle */}
          {recognizedText.length > 0 && (
            <View style={[styles.controlItem, styles.controlItemBorder, { borderTopColor: theme.border }]}>
              <View style={styles.controlLeft}>
                <View style={[styles.iconCircle, { backgroundColor: colors.accent.light }]}>
                  <View style={[styles.iconDot, { backgroundColor: colors.accent.main }]} />
                </View>
                <View style={styles.controlTextContainer}>
                  <Text style={[styles.controlLabel, { color: theme.text }]}>
                    Compare Versions
                  </Text>
                  <Text style={[styles.controlSubtext, { color: theme.subtext }]}>
                    Show original & simplified text
                  </Text>
                </View>
              </View>
              <Switch
                value={showOriginal}
                onValueChange={setShowOriginal}
                trackColor={{ false: theme.border, true: colors.accent.main }}
                thumbColor={colors.white}
                ios_backgroundColor={theme.border}
              />
            </View>
          )}
        </View>

        {/* Captions Card */}
        <View style={[styles.captionsCard, { backgroundColor: theme.surface }, shadows.lg]}>
          <View style={styles.captionsHeader}>
            <View style={styles.captionsTitleContainer}>
              <Text style={[styles.captionsTitle, { color: theme.text }]}>
                Speech to Text
              </Text>
              {recognizedText.length > 0 && (
                <View style={[styles.wordCount, { backgroundColor: colors.primary.light }]}>
                  <Text style={[styles.wordCountText, { color: colors.primary.main }]}>
                    {recognizedText.split(' ').length} words
                  </Text>
                </View>
              )}
            </View>
            {recognizedText.length > 0 && (
              <TouchableOpacity
                style={[styles.clearButtonNew, { backgroundColor: colors.error.light }]}
                onPress={clearText}
                activeOpacity={0.7}
              >
                <Text style={[styles.clearButtonTextNew, { color: colors.error.main }]}>
                  Clear
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Caption Text */}
          <ScrollView 
            style={styles.captionsScroll}
            contentContainerStyle={styles.captionsScrollContent}
          >
            {/* Caption Text */}
            {!recognizedText ? (
              <View style={styles.emptyState}>
                <View style={styles.emptyIconContainer}>
                  <View style={[styles.microphoneIcon, { borderColor: colors.primary.main }]} />
                </View>
                <Text style={[styles.emptyTitle, { color: theme.text }]}>
                  Ready to Listen
                </Text>
                <Text style={[styles.emptySubtitle, { color: theme.subtext }]}>
                  Tap the microphone and start speaking{'\n'}
                  Your speech will appear here with{'\n'}
                  simplified captions for easy reading
                </Text>
                <View style={styles.featuresList}>
                  <View style={styles.featureItem}>
                    <View style={[styles.featureIconContainer, { backgroundColor: colors.primary.light }]}>
                      <View style={[styles.featureDot, { backgroundColor: colors.primary.main }]} />
                    </View>
                    <Text style={[styles.featureText, { color: theme.subtext }]}>
                      Simple words & short sentences
                    </Text>
                  </View>
                  <View style={styles.featureItem}>
                    <View style={[styles.featureIconContainer, { backgroundColor: colors.secondary.light }]}>
                      <View style={[styles.featureDot, { backgroundColor: colors.secondary.main }]} />
                    </View>
                    <Text style={[styles.featureText, { color: theme.subtext }]}>
                      Clear and accessible text
                    </Text>
                  </View>
                  <View style={styles.featureItem}>
                    <View style={[styles.featureIconContainer, { backgroundColor: colors.accent.light }]}>
                      <View style={[styles.featureDot, { backgroundColor: colors.accent.main }]} />
                    </View>
                    <Text style={[styles.featureText, { color: theme.subtext }]}>
                      15 Indian languages supported
                    </Text>
                  </View>
                </View>
              </View>
            ) : (
              <View>
                {!showOriginal ? (
                  <Text style={[styles.captionText, { color: theme.text }]} selectable>
                    {simplifiedText}
                  </Text>
                ) : (
                  <View>
                    <View style={styles.compareSection}>
                      <Text style={[styles.compareLabel, { color: theme.subtext }]}>
                        Original Text
                      </Text>
                      <Text style={[styles.captionText, styles.originalTextStyle, { color: theme.text }]} selectable>
                        {recognizedText}
                      </Text>
                    </View>
                    <View style={[styles.compareDivider, { backgroundColor: theme.border }]} />
                    <View style={styles.compareSection}>
                      <Text style={[styles.compareLabel, { color: colors.secondary.main }]}>
                        Simplified Text
                      </Text>
                      <Text style={[styles.captionText, { color: theme.text }]} selectable>
                        {simplifiedText}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            )}
          </ScrollView>
        </View>

     
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  gradientHeader: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.semibold as any,
  },
  headerTextContainer: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  headerTitle: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold as any,
    marginBottom: spacing.xs / 2,
  },
  headerSubtitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium as any,
  },
  statusBadge: {
    width: 12,
    height: 12,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: borderRadius.full,
    backgroundColor: colors.white,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  languageCard: {
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  languageCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageEmojiCircle: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  languageEmojiText: {
    fontSize: typography.fontSize['2xl'],
  },
  languageInfo: {
    flex: 1,
  },
  languageCardName: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold as any,
    marginBottom: spacing.xs / 2,
  },
  languageCardNative: {
    fontSize: typography.fontSize.base,
  },
  micSection: {
    borderRadius: borderRadius['2xl'],
    padding: spacing.xl,
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  micContainer: {
    width: 180,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  waveCircle: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 2,
  },
  waveCircle2: {
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  micButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  micButtonOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 60,
  },
  micIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.white,
  },
  micIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  stopIcon: {
    width: 24,
    height: 24,
    borderRadius: 4,
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  statusLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium as any,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  statusText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold as any,
  },
  actionHint: {
    fontSize: typography.fontSize.sm,
  },
  controlsCard: {
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  controlsTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold as any,
    marginBottom: spacing.md,
  },
  controlItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  controlItemBorder: {
    borderTopWidth: 1,
    marginTop: spacing.sm,
    paddingTop: spacing.md,
  },
  controlLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  iconDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  controlTextContainer: {
    flex: 1,
  },
  controlLabel: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold as any,
    marginBottom: spacing.xs / 2,
  },
  controlSubtext: {
    fontSize: typography.fontSize.sm,
  },
  captionsCard: {
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
    minHeight: 300,
  },
  captionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  captionsTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  captionsTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold as any,
    marginRight: spacing.sm,
  },
  wordCount: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: borderRadius.md,
  },
  wordCountText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold as any,
  },
  clearButtonNew: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  clearButtonTextNew: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold as any,
  },
  captionsScroll: {
    flex: 1,
  },
  captionsScrollContent: {
    flexGrow: 1,
  },
  captionText: {
    fontSize: typography.fontSize.lg,
    lineHeight: typography.fontSize.lg * typography.lineHeight.relaxed,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing['2xl'],
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    backgroundColor: colors.primary.light,
  },
  microphoneIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 3,
  },
  emptyTitle: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold as any,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: typography.fontSize.base,
    textAlign: 'center',
    lineHeight: typography.fontSize.base * typography.lineHeight.relaxed,
    marginBottom: spacing.xl,
  },
  featuresList: {
    width: '100%',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  featureIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  featureDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  featureText: {
    flex: 1,
    fontSize: typography.fontSize.base,
  },
  compareSection: {
    marginBottom: spacing.lg,
  },
  compareLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold as any,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  originalTextStyle: {
    opacity: 0.7,
  },
  compareDivider: {
    height: 1,
    marginVertical: spacing.lg,
  },
  footerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.xl,
  },
  footerIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: spacing.sm,
  },
  footerText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold as any,
  },
  // New styles for improved UI
  languageStatus: {
    alignItems: 'center',
  },
  activeIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: spacing.xs / 2,
  },
  activeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium as any,
    textTransform: 'uppercase',
  },
});

export default SpeechToTextPage;
