/**
 * Design System Colors for SIH 2025
 * Accessibility-focused color palette for Deaf and Hard-of-Hearing users
 */

export const colors = {
  // Primary brand colors
  primary: {
    main: '#2563EB', // Deep blue - trust and accessibility
    light: '#EBF2FE',
    dark: '#1E40AF',
    contrast: '#FFFFFF',
  },
  
  // Secondary colors
  secondary: {
    main: '#10B981', // Green - success and positive feedback
    light: '#D1FAE5',
    dark: '#059669',
    contrast: '#FFFFFF',
  },
  
  // Accent colors
  accent: {
    main: '#F59E0B', // Amber - attention and highlights
    light: '#FEF3C7',
    dark: '#D97706',
    contrast: '#000000',
  },
  
  // Status colors
  success: {
    main: '#10B981',
    light: '#D1FAE5',
    dark: '#059669',
  },
  warning: {
    main: '#F59E0B',
    light: '#FEF3C7',
    dark: '#D97706',
  },
  error: {
    main: '#EF4444',
    light: '#FEE2E2',
    dark: '#DC2626',
  },
  info: {
    main: '#3B82F6',
    light: '#DBEAFE',
    dark: '#2563EB',
  },
  
  // UI colors - Light mode
  light: {
    background: '#F8FAFC',
    surface: '#FFFFFF',
    card: '#FFFFFF',
    border: '#E2E8F0',
    text: '#0F172A',
    subtext: '#64748B',
    textTertiary: '#94A3B8',
    divider: '#E2E8F0',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  
  // UI colors - Dark mode
  dark: {
    background: '#0F172A',
    surface: '#1E293B',
    card: '#1E293B',
    border: '#334155',
    text: '#F1F5F9',
    subtext: '#CBD5E1',
    textTertiary: '#94A3B8',
    divider: '#334155',
    overlay: 'rgba(0, 0, 0, 0.7)',
  },
  
  // Gradient colors
  gradients: {
    primary: ['#2563EB', '#1E40AF'],
    secondary: ['#10B981', '#059669'],
    accent: ['#F59E0B', '#D97706'],
    hero: ['#2563EB', '#7C3AED'],
  },
  
  // Semantic colors for accessibility
  semantic: {
    listening: '#EF4444', // Red - recording/active state
    ready: '#10B981', // Green - ready state
    processing: '#F59E0B', // Amber - processing state
  },
  
  // High contrast mode
  highContrast: {
    background: '#000000',
    text: '#FFFFFF',
    border: '#FFFFFF',
    primary: '#00D9FF',
  },
  
  // Common colors
  white: '#FFFFFF',
  black: '#000000',
};

export default colors;
