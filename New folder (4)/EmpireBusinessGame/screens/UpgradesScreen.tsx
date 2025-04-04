import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useGameContext } from '../context/GameContext';
import formatMoney from '../utils/formatMoney';

interface UpgradeItemProps {
  id: string;
  name: string;
  description: string;
  cost: number;
  multiplier: number;
  level: number;
  unlocked: boolean;
  onBuy: () => void;
}

const UpgradeItem: React.FC<UpgradeItemProps> = ({
  id,
  name,
  description,
  cost,
  multiplier,
  level,
  unlocked,
  onBuy
}) => {
  const { gameState } = useGameContext();
  const canAfford = gameState.money >= cost;
  
  if (!unlocked) return null;
  
  return (
    <View style={styles.upgradeItem}>
      <View style={styles.upgradeContent}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons 
            name="arrow-up-bold-circle" 
            size={40} 
            color="#4CAF50" 
          />
        </View>
        
        <View style={styles.upgradeInfo}>
          <Text style={styles.upgradeName}>{name}</Text>
          <Text style={styles.upgradeDescription}>{description}</Text>
          <Text style={styles.upgradeStats}>
            Level: {level} | +{multiplier} per klik
          </Text>
        </View>
      </View>
      
      <TouchableOpacity
        style={[
          styles.buyButton,
          !canAfford && styles.disabledButton
        ]}
        onPress={onBuy}
        disabled={!canAfford}
      >
        <MaterialCommunityIcons name="cash" size={16} color="white" />
        <Text style={styles.buyButtonText}>
          {formatMoney(cost)}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const UpgradesScreen: React.FC = () => {
  const { gameState, buyUpgrade } = useGameContext();
  const { upgrades, money } = gameState;
  
  // Handler untuk membeli upgrade
  const handleBuyUpgrade = (upgradeId: string) => {
    buyUpgrade(upgradeId);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      
      {/* Header dengan uang pemain */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Upgrade</Text>
        <View style={styles.moneyContainer}>
          <MaterialCommunityIcons name="currency-usd" size={24} color="#4CAF50" />
          <Text style={styles.moneyText}>{formatMoney(money)}</Text>
        </View>
      </View>
      
      {/* Informasi tentang upgrade */}
      <View style={styles.infoContainer}>
        <MaterialCommunityIcons name="information" size={20} color="#3F51B5" />
        <Text style={styles.infoText}>
          Upgrade meningkatkan jumlah uang yang Anda peroleh setiap kali klik pada bisnis.
        </Text>
      </View>
      
      {/* Daftar upgrade */}
      <FlatList
        data={upgrades}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <UpgradeItem
            id={item.id}
            name={item.name}
            description={item.description}
            cost={item.cost}
            multiplier={item.multiplier}
            level={item.level}
            unlocked={item.unlocked}
            onBuy={() => handleBuyUpgrade(item.id)}
          />
        )}
        contentContainerStyle={styles.upgradeList}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  moneyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  moneyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginLeft: 4,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8EAF6',
    padding: 12,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#3F51B5',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },
  upgradeList: {
    padding: 16,
  },
  upgradeItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  upgradeContent: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  upgradeInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  upgradeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  upgradeDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  upgradeStats: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  buyButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignSelf: 'flex-end',
  },
  disabledButton: {
    backgroundColor: '#BDBDBD',
  },
  buyButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 6,
  },
});

export default UpgradesScreen; 