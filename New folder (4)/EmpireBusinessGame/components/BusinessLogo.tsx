import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Rect, Circle } from 'react-native-svg';

interface BusinessLogoProps {
  width?: number;
  height?: number;
  style?: any;
}

const BusinessLogo: React.FC<BusinessLogoProps> = ({ width = 200, height = 200, style }) => {
  return (
    <View style={[styles.container, { width, height, borderRadius: width / 5 }, style]}>
      <Svg width="100%" height="100%" viewBox="0 0 512 512">
        {/* Background */}
        <Rect width="512" height="512" rx="100" fill="#1F2937" />
        <Rect x="20" y="20" width="472" height="472" rx="80" fill="#4CAF50" fillOpacity="0.8" />
        
        {/* Building Base */}
        <Rect x="120" y="230" width="272" height="200" rx="20" fill="#E8F5E9" />
        
        {/* Building Top */}
        <Path d="M140 230L256 150L372 230" stroke="#FFC107" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" />
        
        {/* Windows */}
        <Rect x="156" y="260" width="40" height="40" rx="5" fill="#1F2937" />
        <Rect x="236" y="260" width="40" height="40" rx="5" fill="#1F2937" />
        <Rect x="316" y="260" width="40" height="40" rx="5" fill="#1F2937" />
        <Rect x="156" y="330" width="40" height="40" rx="5" fill="#1F2937" />
        <Rect x="236" y="330" width="40" height="40" rx="5" fill="#1F2937" />
        <Rect x="316" y="330" width="40" height="40" rx="5" fill="#1F2937" />
        
        {/* Door */}
        <Rect x="226" y="390" width="60" height="40" rx="5" fill="#795548" />
        
        {/* Money Symbol */}
        <Circle cx="256" cy="180" r="55" fill="#FFC107" />
        <Path d="M256 146V214" stroke="#1F2937" strokeWidth="14" strokeLinecap="round" />
        <Path d="M236 156H266C276 156 286 163 286 178C286 193 276 200 266 200H236" stroke="#1F2937" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
        
        {/* Crown */}
        <Path d="M206 120L256 95L306 120L286 145H226L206 120Z" fill="#FFC107" stroke="#1F2937" strokeWidth="6" />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});

export default BusinessLogo; 