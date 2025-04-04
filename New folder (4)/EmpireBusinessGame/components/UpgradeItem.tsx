import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import formatMoney from '../utils/formatMoney';
import { LinearGradient } from 'expo-linear-gradient';

// Tipe untuk nama ikon yang valid
type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

// Definisikan interface untuk objek upgrade yang sesuai dengan GameContext
export interface UpgradeInterface {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  level: number;
  moneyPerClickBonus: number;
  icon: string;
  effect: number;
}

// Fungsi untuk menghitung harga upgrade
const calculateUpgradePrice = (basePrice: number, level: number): number => {
  return Math.floor(basePrice * Math.pow(1.1, level));
};

interface UpgradeItemProps {
  upgrade: UpgradeInterface;
  onPress: () => void;
  disabled?: boolean;
  owned?: boolean;
}

const UpgradeItem: React.FC<UpgradeItemProps> = ({
  upgrade,
  onPress,
  disabled = false,
  owned = false,
}) => {
  // Icon default dari Material Community Icons
  const defaultIcon: IconName = "cursor-default-click";
  const cashIcon: IconName = "cash";
  const checkIcon: IconName = "check-circle";
  
  // Konversi string ikon ke tipe yang sesuai
  const getIconName = (iconString?: string): IconName => {
    // Pastikan ikon yang disediakan ada dalam daftar ikon Material Community
    switch (iconString) {
      case 'cursor-default-click': return 'cursor-default-click';
      case 'cursor-default-click-outline': return 'cursor-default-click-outline';
      case 'hand-extended': return 'hand-extended';
      case 'crown': return 'crown';
      case 'diamond': return 'diamond';
      default: return defaultIcon;
    }
  };
  
  // Hitung harga upgrade saat ini
  const currentPrice = calculateUpgradePrice(upgrade.basePrice, upgrade.level);
  
  // Tentukan warna latar belakang berdasarkan status item
  const getGradientColors = (): [string, string] => {
    if (owned) {
      return ['#81C784', '#4CAF50'] as [string, string]; // Gradient hijau untuk yang sudah dimiliki
    } else if (disabled) {
      return ['#CFD8DC', '#B0BEC5'] as [string, string]; // Gradient abu-abu untuk yang nonaktif
    } else {
      return ['#64B5F6', '#2196F3'] as [string, string]; // Gradient biru untuk yang tersedia
    }
  };
  
  const getLevelBadge = () => {
    if (upgrade.level > 0) {
      return (
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>{upgrade.level}</Text>
        </View>
      );
    }
    return null;
  };
  
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={getGradientColors()}
        style={[
          styles.gradientContainer,
          upgrade.level > 0 && styles.owned,
          disabled && styles.disabled
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.iconContainer}>
          <View style={styles.iconBackground}>
            <MaterialCommunityIcons
              name={getIconName(upgrade.icon)}
              size={32}
              color="#FFFFFF"
            />
          </View>
        </View>
        
        <View style={styles.contentContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>
              {upgrade.name}
            </Text>
            {getLevelBadge()}
          </View>
          <Text style={styles.description}>{upgrade.description}</Text>
          
          {upgrade.level > 0 ? (
            <View style={styles.statsContainer}>
              <View style={styles.multiplierBadge}>
                <Text style={styles.bonusText}>
                  +{upgrade.moneyPerClickBonus} per klik
                </Text>
              </View>
              <View style={styles.priceBadge}>
                <Text style={styles.nextPriceText}>{formatMoney(currentPrice)}</Text>
              </View>
            </View>
          ) : (
            <View style={styles.priceContainer}>
              <MaterialCommunityIcons name={cashIcon} size={16} color="#FFFFFF" />
              <Text style={styles.price}>{formatMoney(currentPrice)}</Text>
            </View>
          )}
        </View>
        
        {upgrade.level > 0 ? (
          <View style={styles.levelUpBadge}>
            <Text style={styles.levelUpText}>Lv.{upgrade.level}</Text>
          </View>
        ) : (
          disabled ? (
            <View style={styles.lockBadge}>
              <MaterialCommunityIcons name="lock" size={20} color="#90A4AE" />
            </View>
          ) : (
            <View style={styles.buyBadge}>
              <MaterialCommunityIcons name="plus-circle" size={24} color="#FFFFFF" />
            </View>
          )
        )}
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
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  multiplierBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  priceBadge: {
    backgroundColor: 'rgba(255, 152, 0, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  bonusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  nextPriceText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  levelUpBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  levelUpText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  buyBadge: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  lockBadge: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  ownedBadge: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
});

export default UpgradeItem; 