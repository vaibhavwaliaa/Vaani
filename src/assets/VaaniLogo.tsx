import React from 'react';
import { Image, StyleSheet, ImageStyle } from 'react-native';

interface VaaniLogoProps {
  size?: number;
  style?: ImageStyle;
}

const VaaniLogo: React.FC<VaaniLogoProps> = ({ 
  size = 60,
  style
}) => {
  return (
    <Image
      source={require('./images/logo.png')} // Your PNG file should be named 'logo.png'
      style={[
        styles.logo,
        {
          width: size,
          height: size,
        },
        style
      ]}
      resizeMode="contain"
    />
  );
};

const styles = StyleSheet.create({
  logo: {
    borderRadius: 8,
  },
});

export default VaaniLogo;