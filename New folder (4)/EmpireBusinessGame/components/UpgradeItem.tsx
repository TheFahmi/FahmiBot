import React, { useState } from 'react';
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
  // Tambahkan state untuk menampilkan tulisan klik
  const [showClickText, setShowClickText] = useState(false);
  
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
          <Text style={styles.levelText}>Lvl {upgrade.level}</Text>
        </View>
      );
    }
    return null;
  };
  
  // Handle klik pada upgrade item
  const handlePress = () => {
    setShowClickText(true);
    
    // Tampilkan teks klik selama 500ms
    setTimeout(() => {
      setShowClickText(false);
    }, 500);
    
    // Panggil fungsi onPress dari props
    onPress();
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
            {showClickText && upgrade.level > 0 && (
              <View style={styles.clickTextContainer}>
                <Text style={styles.clickText}>+{upgrade.moneyPerClickBonus}</Text>
              </View>
            )}
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
          
          <View style={styles.statsRow}>
            <View style={styles.bonusContainer}>
              <MaterialCommunityIcons name="cursor-default-click" size={16} color="#FFFFFF" />
              <Text style={styles.bonusText}>
                +{upgrade.moneyPerClickBonus} per klik
              </Text>
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
  bonusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  bonusText: {
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
    fontSize: 14,
  },
  clickTextContainer: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 152, 0, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    top: -15,
    right: -15,
  },
  clickText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default UpgradeItem; 