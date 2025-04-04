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
  const { name, description, basePrice, level, icon, effect } = upgrade;
  const price = calculateUpgradePrice(basePrice, level);
  
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
    if (level > 0) {
      return (
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>{level}</Text>
        </View>
      );
    }
    return null;
  };
  
  return (
    <TouchableOpacity
      style={[
        styles.container,
        disabled && styles.disabledContainer,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name={getIconName(icon) as any} size={26} color="#4CAF50" />
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.description}>{description}</Text>
        
        <View style={styles.bottomRow}>
          <View style={styles.levelContainer}>
            <Text style={styles.levelLabel}>Level</Text>
            <Text style={styles.levelValue}>{level}</Text>
            <Text style={styles.priceText}>{formatMoney(price)}</Text>
          </View>
          
          <View style={styles.effectContainer}>
            <Text style={styles.effectValue}>+{effect}%</Text>
            <Text style={styles.effectLabel}>Efek</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.priceContainer}>
        <MaterialCommunityIcons 
          name={disabled ? "lock" : "chevron-right"} 
          size={24} 
          color={disabled ? "#B0BEC5" : "#4CAF50"} 
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  disabledContainer: {
    opacity: 0.7,
    borderLeftColor: '#B0BEC5',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 2,
  },
  description: {
    fontSize: 13,
    color: '#757575',
    marginBottom: 8,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  levelContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  levelLabel: {
    fontSize: 12,
    color: '#9E9E9E',
  },
  levelValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  priceText: {
    fontSize: 13,
    color: '#FF9800',
    fontWeight: 'bold',
    marginTop: 2,
  },
  effectContainer: {
    alignItems: 'flex-end',
  },
  effectValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  effectLabel: {
    fontSize: 12,
    color: '#9E9E9E',
  },
  priceContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    width: 30,
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
});

export default UpgradeItem; 