import React from 'react';
import { View, Text, StyleSheet, ImageBackground, Image, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import formatMoney from '../utils/formatMoney';

// Definisikan level-level kartu
export type CardLevel = 'basic' | 'silver' | 'gold' | 'platinum' | 'diamond';

interface MoneyCardProps {
  money: number;
  moneyPerClick: number;
  totalMoney: number;
  level?: CardLevel;
}

// Konfigurasi untuk setiap level kartu
const cardConfigs = {
  basic: {
    colors: ['#455A64', '#263238'] as [string, string],
    icon: 'wallet-outline',
    title: 'BASIC',
    accent: '#78909C',
    chipColor: 'rgba(255, 255, 255, 0.3)',
    balanceColor: '#90A4AE',
    pattern: 'dots',
  },
  silver: {
    colors: ['#9E9E9E', '#424242'] as [string, string],
    icon: 'wallet',
    title: 'SILVER',
    accent: '#E0E0E0',
    chipColor: 'rgba(255, 255, 255, 0.5)',
    balanceColor: '#BDBDBD',
    pattern: 'lines',
  },
  gold: {
    colors: ['#FFC107', '#FF8F00'] as [string, string],
    icon: 'gold',
    title: 'GOLD',
    accent: '#FFD54F',
    chipColor: '#FFC107',
    balanceColor: '#FFD54F',
    pattern: 'waves',
  },
  platinum: {
    colors: ['#2196F3', '#0D47A1'] as [string, string],
    icon: 'diamond-stone',
    title: 'PLATINUM',
    accent: '#64B5F6',
    chipColor: '#2196F3',
    balanceColor: '#64B5F6',
    pattern: 'circles',
  },
  diamond: {
    colors: ['#673AB7', '#311B92'] as [string, string],
    icon: 'diamond',
    title: 'DIAMOND',
    accent: '#9575CD',
    chipColor: '#673AB7',
    balanceColor: '#B39DDB',
    pattern: 'diamonds',
  },
};

// Tentukan level kartu berdasarkan total uang
const determineCardLevel = (totalMoney: number): CardLevel => {
  if (totalMoney >= 1000000000000000) return 'diamond';
  if (totalMoney >= 100000000000) return 'platinum';
  if (totalMoney >= 100000000) return 'gold';
  if (totalMoney >= 100000) return 'silver';
  return 'basic';
};  

const MoneyCard: React.FC<MoneyCardProps> = ({
  money,
  moneyPerClick,
  totalMoney,
  level: providedLevel,
}) => {
  // Gunakan level yang disediakan atau tentukan berdasarkan totalMoney
  const level = providedLevel || determineCardLevel(totalMoney);
  const config = cardConfigs[level];
  
  // Render pola berdasarkan level
  const renderPattern = () => {
    switch (config.pattern) {
      case 'lines':
        return (
          <View style={styles.patternContainer}>
            {Array.from({ length: 8 }).map((_, index) => (
              <View 
                key={index} 
                style={[
                  styles.line, 
                  { 
                    top: index * 25,
                    opacity: 0.1,
                    backgroundColor: config.accent,
                  }
                ]} 
              />
            ))}
          </View>
        );
      case 'waves':
        return (
          <View style={styles.patternContainer}>
            {Array.from({ length: 4 }).map((_, index) => (
              <View 
                key={index} 
                style={[
                  styles.wave, 
                  { 
                    top: 20 + (index * 50), 
                    opacity: 0.15 - (index * 0.02),
                    backgroundColor: config.accent,
                  }
                ]} 
              />
            ))}
          </View>
        );
      case 'circles':
        return (
          <View style={styles.patternContainer}>
            <View style={[styles.circle, { top: 20, right: 20, opacity: 0.1, backgroundColor: config.accent }]} />
            <View style={[styles.circle, { top: 100, left: 10, opacity: 0.1, backgroundColor: config.accent }]} />
            <View style={[styles.smallCircle, { bottom: 50, right: 50, opacity: 0.15, backgroundColor: config.accent }]} />
            <View style={[styles.smallCircle, { top: 80, left: 100, opacity: 0.15, backgroundColor: config.accent }]} />
          </View>
        );
      case 'diamonds':
        return (
          <View style={styles.patternContainer}>
            <View style={[styles.diamond, { top: 30, right: 50, opacity: 0.1, borderColor: config.accent }]} />
            <View style={[styles.diamond, { bottom: 40, left: 70, opacity: 0.1, borderColor: config.accent }]} />
            <View style={[styles.smallDiamond, { top: 80, right: 100, opacity: 0.15, borderColor: config.accent }]} />
            <View style={[styles.smallDiamond, { bottom: 80, left: 30, opacity: 0.1, borderColor: config.accent }]} />
          </View>
        );
      default: // dots
        return (
          <View style={styles.patternContainer}>
            {Array.from({ length: 20 }).map((_, index) => (
              <View 
                key={index} 
                style={[
                  styles.dot, 
                  { 
                    top: Math.random() * 200,
                    left: Math.random() * 300,
                    opacity: 0.1,
                    backgroundColor: config.accent,
                  }
                ]} 
              />
            ))}
          </View>
        );
    }
  };
  
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={config.colors}
        style={styles.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {renderPattern()}
        
        <View style={styles.topSection}>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>{config.title}</Text>
          </View>
          
          <View style={styles.chipSection}>
            <MaterialCommunityIcons 
              name={config.icon as any} 
              size={18} 
              color="white" 
              style={styles.chipIcon} 
            />
            <View style={[styles.chip, { backgroundColor: config.chipColor }]} />
          </View>
        </View>
        
        <View style={styles.balanceContainer}>
          <LinearGradient
            colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.1)']}
            style={styles.balanceBackground}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.balanceLabel}>SALDO SAAT INI</Text>
            <Text style={[styles.balanceValue, { color: config.balanceColor }]}>{formatMoney(money)}</Text>
          </LinearGradient>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statsItem}>
            <MaterialCommunityIcons name="cursor-pointer" size={14} color="white" />
            <Text style={styles.statsLabel}>PER KLIK</Text>
            <Text style={styles.statsValue}>+{formatMoney(moneyPerClick)}</Text>
          </View>
          
          <View style={styles.statsItem}>
            <MaterialCommunityIcons name="chart-line" size={14} color="white" />
            <Text style={styles.statsLabel}>TOTAL</Text>
            <Text style={styles.statsValue}>{formatMoney(totalMoney)}</Text>
          </View>
        </View>
        
        <View style={styles.cardInfo}>
          <View>
            <Text style={styles.cardNumberLabel}>ACCOUNT ID</Text>
            <Text style={styles.cardNumber}>EB-7812</Text>
          </View>
          
          <View style={styles.cardBadge}>
            <MaterialCommunityIcons name="bank" size={12} color="white" />
            <Text style={styles.bankName}>EMPIRE BUSINESS</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  card: {
    borderRadius: 16,
    minHeight: 200,
    overflow: 'hidden',
    padding: 0,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  patternContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  line: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
  },
  wave: {
    position: 'absolute',
    height: 15,
    left: 0,
    right: 0,
    borderRadius: 20,
  },
  dot: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  circle: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  smallCircle: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  diamond: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderWidth: 2,
    transform: [{ rotate: '45deg' }],
  },
  smallDiamond: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderWidth: 2,
    transform: [{ rotate: '45deg' }],
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
  },
  levelBadge: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 4,
  },
  levelText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 10,
  },
  chipSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chipIcon: {
    marginRight: 5,
  },
  chip: {
    width: 24,
    height: 18,
    borderRadius: 3,
  },
  balanceContainer: {
    paddingHorizontal: 16,
    paddingBottom: 15,
  },
  balanceBackground: {
    borderRadius: 8,
    padding: 10,
  },
  balanceLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
    marginBottom: 4,
  },
  balanceValue: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: 10,
  },
  statsItem: {
    alignItems: 'center',
  },
  statsLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
    marginVertical: 3,
  },
  statsValue: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: 16,
  },
  cardNumberLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 8,
  },
  cardNumber: {
    color: 'white',
    fontSize: 12,
    letterSpacing: 1,
  },
  cardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  bankName: {
    color: 'white',
    fontSize: 8,
    fontWeight: 'bold',
    marginLeft: 4,
  },
});

export default MoneyCard; 