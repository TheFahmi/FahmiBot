import React, { useEffect, useState } from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ViewStyle, 
  TextStyle, 
  ActivityIndicator,
  Animated,
  View,
  GestureResponderEvent,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface ClickButtonProps {
  onPress: (event?: GestureResponderEvent) => void;
  title: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  loading?: boolean;
  disabled?: boolean;
  colors?: [string, string];
}

const ClickButton: React.FC<ClickButtonProps> = ({
  onPress,
  title,
  style,
  textStyle,
  loading = false,
  disabled = false,
  colors = ['#4CAF50', '#2E7D32']
}) => {
  const [pulseAnim] = useState(new Animated.Value(1));
  const [glowAnim] = useState(new Animated.Value(0));
  
  // Efek pulsating untuk tombol
  useEffect(() => {
    if (!disabled) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
      
      // Efek glowing
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.3,
            duration: 1500,
            useNativeDriver: false,
          }),
        ])
      ).start();
    } else {
      // Hentikan animasi jika tombol dinonaktifkan
      pulseAnim.setValue(1);
      glowAnim.setValue(0);
    }
  }, [disabled]);
  
  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5],
  });
  
  const glowSize = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 130],
  });
  
  return (
    <View style={[styles.buttonContainer, style]}>
      {!disabled && (
        <Animated.View 
          style={[
            styles.glow, 
            {
              opacity: glowOpacity,
              width: glowSize,
              height: glowSize,
              borderRadius: glowSize,
              backgroundColor: colors[0],
            }
          ]} 
        />
      )}
      
      <Animated.View
        style={{
          transform: [{ scale: pulseAnim }],
          width: '100%',
          height: '100%',
        }}
      >
        <TouchableOpacity
          onPress={onPress}
          disabled={disabled || loading}
          activeOpacity={0.8}
          style={styles.buttonWrapper}
        >
          <LinearGradient
            colors={disabled ? ['#BDBDBD', '#9E9E9E'] as [string, string] : colors}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <View style={styles.buttonContent}>
                <MaterialCommunityIcons 
                  name="cash-multiple" 
                  size={32} 
                  color="#FFFFFF"
                  style={styles.icon}
                />
                <Text style={[styles.buttonText, textStyle]}>{title}</Text>
                
                {/* Efek bergelembung di dalam tombol */}
                <View style={[styles.bubble, styles.bubble1]} />
                <View style={[styles.bubble, styles.bubble2]} />
                <View style={[styles.bubble, styles.bubble3]} />
              </View>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    borderRadius: 75,
    opacity: 0.3,
  },
  buttonWrapper: {
    borderRadius: 75,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    width: '100%',
    height: '100%',
  },
  gradient: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 75,
    height: '100%',
    width: '100%',
  },
  buttonContent: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  icon: {
    marginBottom: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  bubble: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 50,
  },
  bubble1: {
    width: 20,
    height: 20,
    top: '20%',
    left: '20%',
  },
  bubble2: {
    width: 15,
    height: 15,
    bottom: '25%',
    right: '20%',
  },
  bubble3: {
    width: 10,
    height: 10,
    bottom: '15%',
    left: '35%',
  },
});

export default ClickButton; 