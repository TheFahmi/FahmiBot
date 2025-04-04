import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import formatMoney from '../utils/formatMoney';
import { LinearGradient } from 'expo-linear-gradient';
import { BusinessInterface } from '../contexts/GameContext';

// Tipe untuk nama ikon
type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

// Fungsi untuk menghitung harga bisnis
const calculateBusinessPrice = (basePrice: number, level: number): number => {
  // Menggunakan kenaikan persentase tetap bukannya eksponen
  const incrementFactor = 35; // 35% kenaikan per level
  let finalPrice = basePrice;
  
  for (let i = 0; i < level; i++) {
    finalPrice += Math.floor(finalPrice * incrementFactor / 100);
  }
  
  return Math.floor(finalPrice);
};

// Fungsi untuk menghitung pendapatan bisnis
const calculateBusinessIncome = (
  baseIncomePerSecond: number,
  level: number
): number => {
  // Menggunakan kenaikan persentase tetap bukannya eksponen
  const incrementFactor = 15; // 15% kenaikan per level
  let finalIncome = baseIncomePerSecond;
  
  for (let i = 0; i < level; i++) {
    finalIncome += Math.floor(finalIncome * incrementFactor / 100);
  }
  
  return Math.floor(finalIncome);
};

interface BusinessItemProps {
  business: BusinessInterface;
  onPress: () => void;
  disabled?: boolean;
  owned?: boolean;
}

const getIconName = (iconString?: string): IconName => {
  // Pastikan ikon yang disediakan ada dalam daftar ikon Material Community
  switch (iconString) {
    case 'cup': return 'cup';
    case 'food': return 'food';
    case 'shoe-formal': return 'shoe-formal';
    case 'face-woman': return 'face-woman';
    case 'cart': return 'cart';
    case 'store': return 'store';
    case 'store-outline': return 'store-outline';
    default: return 'store-outline';
  }
};

const BusinessItem: React.FC<BusinessItemProps> = ({
  business,
  onPress,
  disabled = false,
  owned = business.owned, // Gunakan property 'owned' dari business
}) => {
  // Tambahkan state untuk menampilkan tulisan klik
  const [showIncomeText, setShowIncomeText] = useState(false);
  
  // Icon default dari Material Community Icons
  const moneyIcon: IconName = "cash";
  const infoIcon: IconName = "information-outline";
  
  // Hitung harga saat ini
  const currentPrice = business.owned
    ? calculateBusinessPrice(business.basePrice, business.level)
    : business.basePrice;
  
  // Tentukan warna latar belakang berdasarkan status item
  const getGradientColors = (): [string, string] => {
    if (owned) {
      return ['#81C784', '#4CAF50'] as [string, string]; // Gradient hijau untuk yang sudah dimiliki
    } else if (disabled) {
      return ['#CFD8DC', '#B0BEC5'] as [string, string]; // Gradient abu-abu untuk yang nonaktif
    } else {
      return ['#FF9800', '#F57C00'] as [string, string]; // Gradient oranye untuk yang tersedia
    }
  };
  
  // Handle klik pada bisnis item
  const handlePress = () => {
    if (owned) {
      setShowIncomeText(true);
      
      // Tampilkan teks income selama 500ms
      setTimeout(() => {
        setShowIncomeText(false);
      }, 500);
    }
    
    // Panggil fungsi onPress dari props
    onPress();
  };
  
  // Hitung income yang akan didapat jika dibeli atau ditingkatkan
  const getIncomeText = () => {
    if (owned) {
      const currentIncome = calculateBusinessIncome(business.baseIncomePerSecond, business.level);
      const nextLevelIncome = calculateBusinessIncome(business.baseIncomePerSecond, business.level + 1);
      return `+${formatMoney(nextLevelIncome)}/detik`;
    } else {
      return `+${formatMoney(business.baseIncomePerSecond)}/detik`;
    }
  };
  
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={getGradientColors()}
        style={[
          styles.gradientContainer,
          owned && styles.owned,
          disabled && styles.disabled
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.iconContainer}>
          <View style={styles.iconBackground}>
            <MaterialCommunityIcons
              name={getIconName(business.icon)}
              size={32}
              color="white"
            />
            {showIncomeText && owned && (
              <View style={styles.incomePopupContainer}>
                <Text style={styles.incomePopupText}>+{formatMoney(calculateBusinessIncome(business.baseIncomePerSecond, business.level))}</Text>
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.contentContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>
              {business.name}
            </Text>
            {owned && (
              <View style={styles.levelBadge}>
                <Text style={styles.levelText}>Lvl {business.level}</Text>
              </View>
            )}
          </View>
          
          <Text style={styles.description}>{business.description}</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.incomeContainer}>
              <MaterialCommunityIcons name={moneyIcon} size={16} color="#FFFFFF" />
              <Text style={styles.incomeText}>{getIncomeText()}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.priceBadge}>
          <Text style={styles.priceText}>{formatMoney(currentPrice)}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    marginHorizontal: 4,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    height: 110,
  },
  gradientContainer: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 16,
    height: '100%',
  },
  disabled: {
    opacity: 0.8,
  },
  owned: {
    borderWidth: 0,
  },
  iconContainer: {
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBackground: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  levelBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  levelText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  description: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  incomeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  incomeText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
    marginLeft: 4,
  },
  priceBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'center',
  },
  priceText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  lockBadge: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  lockedText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    fontWeight: 'bold',
  },
  incomePopupContainer: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 152, 0, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    top: -15,
    right: -15,
  },
  incomePopupText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default BusinessItem; 