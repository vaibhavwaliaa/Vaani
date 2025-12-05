import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import FloatingCaptionModule from '../modules/FloatingCaptionModule';
import { colors } from '../styles/colors';

interface SettingsPageProps {
  onBack?: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onBack }) => {
  const [isServiceRunning, setIsServiceRunning] = useState(false);
  const [hasOverlayPermission, setHasOverlayPermission] = useState(false);

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    try {
      const hasPermission = await FloatingCaptionModule.checkOverlayPermission();
      setHasOverlayPermission(hasPermission);
    } catch (error) {
      console.error('Error checking permission:', error);
    }
  };

  const requestPermission = () => {
    Alert.alert(
      'Overlay Permission Required',
      'This app needs permission to display captions over other apps. You will be redirected to settings.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Open Settings',
          onPress: () => {
            FloatingCaptionModule.requestOverlayPermission();
            // Recheck permission after a delay
            setTimeout(checkPermission, 2000);
          },
        },
      ]
    );
  };

  const toggleFloatingService = async () => {
    try {
      if (!hasOverlayPermission) {
        requestPermission();
        return;
      }

      if (isServiceRunning) {
        await FloatingCaptionModule.stopFloatingService();
        setIsServiceRunning(false);
        Alert.alert('Success', 'Floating caption service stopped');
      } else {
        await FloatingCaptionModule.startFloatingService();
        setIsServiceRunning(true);
        Alert.alert(
          'Success',
          'Floating caption button is now visible. Tap it to start captions.\n\nYou can minimize the app and the button will stay on screen.'
        );
      }
    } catch (error) {
      Alert.alert('Error', (error as Error).message || 'Failed to toggle service');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {onBack && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.7}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Configure floating captions</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Floating Captions</Text>
          <Text style={styles.description}>
            Enable system-wide captions that work even when the app is minimized
          </Text>

          <View style={styles.permissionRow}>
            <Text style={styles.label}>Overlay Permission</Text>
            <View style={styles.statusBadge}>
              <Text
                style={[
                  styles.statusText,
                  hasOverlayPermission ? styles.statusGranted : styles.statusDenied,
                ]}>
                {hasOverlayPermission ? '✓ Granted' : '✗ Required'}
              </Text>
            </View>
          </View>

          {!hasOverlayPermission && (
            <TouchableOpacity
              style={styles.permissionButton}
              onPress={requestPermission}>
              <Text style={styles.permissionButtonText}>Grant Permission</Text>
            </TouchableOpacity>
          )}

          <View style={styles.switchRow}>
            <View style={styles.switchLabel}>
              <Text style={styles.label}>Enable Floating Button</Text>
              <Text style={styles.hint}>
                Shows a draggable button for quick access to captions
              </Text>
            </View>
            <Switch
              value={isServiceRunning}
              onValueChange={toggleFloatingService}
              trackColor={{
                false: colors.light.border,
                true: colors.primary.main,
              }}
              thumbColor={isServiceRunning ? colors.primary.light : '#f4f3f4'}
            />
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>ℹ️ How it works</Text>
          <Text style={styles.infoText}>
            1. Enable the floating button above{'\n'}
            2. A circular button will appear on your screen{'\n'}
            3. Drag it anywhere you like{'\n'}
            4. Tap it to start/stop captions{'\n'}
            5. Captions work even when app is minimized
          </Text>
        </View>

        <View style={styles.featureSection}>
          <Text style={styles.featureTitle}>✨ Features</Text>
          <Text style={styles.featureText}>
            • Real-time speech-to-text captions{'\n'}
            • Works with system audio{'\n'}
            • Draggable floating button{'\n'}
            • Simplified text for easy reading{'\n'}
            • Multi-language support
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  header: {
    padding: 24,
    paddingTop: 40,
    backgroundColor: colors.primary.main,
  },
  backButton: {
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.primary.light,
  },
  card: {
    margin: 20,
    backgroundColor: colors.light.surface,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.light.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: colors.light.subtext,
    marginBottom: 20,
    lineHeight: 20,
  },
  permissionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.light.border,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: colors.light.border,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statusGranted: {
    color: colors.success.main,
  },
  statusDenied: {
    color: colors.error.main,
  },
  permissionButton: {
    backgroundColor: colors.primary.main,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  switchLabel: {
    flex: 1,
    marginRight: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.light.text,
    marginBottom: 4,
  },
  hint: {
    fontSize: 14,
    color: colors.light.subtext,
    lineHeight: 18,
  },
  infoSection: {
    backgroundColor: colors.primary.light,
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary.dark,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    color: colors.primary.dark,
    lineHeight: 22,
  },
  featureSection: {
    backgroundColor: colors.secondary.light,
    padding: 20,
    borderRadius: 12,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.secondary.dark,
    marginBottom: 16,
  },
  featureText: {
    fontSize: 14,
    color: colors.secondary.dark,
    lineHeight: 22,
  },
});
