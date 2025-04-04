import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar, 
  Animated, 
  Easing 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useGameContext } from '../context/GameContext';
import formatMoney from '../utils/formatMoney';

const OfflineEarningsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { gameState, collectOfflineEarnings } = useGameContext();
  const { offlineEarnings } = gameState;
  
  // Animasi
  const animatedValue = new Animated.Value(0);
  const animatedScale = new Animated.Value(0.8);
  
  useEffect(() => {
    // Jalankan animasi saat layar dibuka
    Animated.parallel([
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true
      }),
      Animated.spring(animatedScale, {
        toValue: 1,
        friction: 8,
        useNativeDriver: true
      })
    ]).start();
  }, []);
  
  // Fungsi untuk mengumpulkan pendapatan offline
  const handleCollect = () => {
    collectOfflineEarnings();
    
    // Kembali ke layar utama
    navigation.navigate('Business' as any);
  };
  
  // Fungsi untuk mengumpulkan pendapatan offline dengan bonus
  const handleCollectWithBonus = () => {
    collectOfflineEarnings(true);
    
    // Kembali ke layar utama
    navigation.navigate('Business' as any);
  };
  
  // Nilai untuk animasi opacity
  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1]
  });
  
  // Nilai untuk animasi translateY
  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0]
  });
  
  // Nilai untuk animasi coin scale
  const coinScale = animatedScale;
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f8f8" />
      
      <Animated.View 
        style={[
          styles.contentContainer, 
          { opacity, transform: [{ translateY }] }
        ]}
      >
        <Text style={styles.title}>Selamat Datang Kembali!</Text>
        
        <Text style={styles.subtitle}>
          Bisnis Anda tetap bekerja selama Anda pergi
        </Text>
        
        <Animated.View 
          style={[
            styles.coinContainer, 
            { transform: [{ scale: coinScale }] }
          ]}
        >
          <MaterialCommunityIcons name="cash-multiple" size={80} color="#4CAF50" />
        </Animated.View>
        
        <Text style={styles.earningsLabel}>Pendapatan Offline:</Text>
        <Text style={styles.earningsValue}>{formatMoney(offlineEarnings)}</Text>
        
        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={styles.collectButton}
            onPress={handleCollect}
          >
            <MaterialCommunityIcons name="cash" size={20} color="white" />
            <Text style={styles.collectButtonText}>Kumpulkan</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.collectDoubleButton}
            onPress={handleCollectWithBonus}
          >
            <MaterialCommunityIcons name="cash-multiple" size={20} color="white" />
            <Text style={styles.collectButtonText}>2x (Tonton Iklan)</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  coinContainer: {
    marginBottom: 24,
    backgroundColor: '#E8F5E9',
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  earningsLabel: {
    fontSize: 16,
    color: '#666',
  },
  earningsValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 24,
  },
  buttonsContainer: {
    flexDirection: 'column',
    width: '100%',
    gap: 12,
  },
  collectButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  collectDoubleButton: {
    backgroundColor: '#FF9800',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  collectButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
});

export default OfflineEarningsScreen; 