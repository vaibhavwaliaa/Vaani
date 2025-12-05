import React, { useState, useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';

interface TypewriterProps {
  text: string;
  speed?: number;
  style?: any;
  onComplete?: () => void;
}

const Typewriter: React.FC<TypewriterProps> = ({
  text,
  speed = 100,
  style,
  onComplete
}) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, speed, onComplete]);

  useEffect(() => {
    // Reset when text changes
    setDisplayText('');
    setCurrentIndex(0);
  }, [text]);

  return (
    <Text style={[styles.typewriter, style]}>
      {displayText}
      {currentIndex < text.length && <Text style={styles.cursor}>|</Text>}
    </Text>
  );
};

const styles = StyleSheet.create({
  typewriter: {
    fontFamily: 'monospace',
  },
  cursor: {
    opacity: 1,
    color: '#007AFF',
  },
});

export default Typewriter;