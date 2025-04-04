import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import formatMoney from '../../utils/formatMoney';
import { useGameContext } from '../../context/GameContext';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

export default function UpgradeScreen() {
  const { gameState, buyAutoClicker } = useGameContext();
  const cashIcon: IconName = "cash";

  return (
    <View style={styles.container}>
      {/* Header menampilkan uang pemain */}
      <View style={styles.header}>
        <View style={styles.moneyContainer}>
          <MaterialCommunityIcons name={cashIcon} size={24} color="#4CAF50" />
          <Text style={styles.moneyText}>{formatMoney(gameState.money)}</Text>
        </View>
      </View>

      {/* Daftar Auto Clickers */}
      <ScrollView style={styles.upgradeList}>
        <Text style={styles.sectionTitle}>Auto Clickers</Text>
        
        {gameState.autoClickers.map(clicker => (
          <View key={clicker.id} style={styles.upgradeItem}>
            <View style={styles.upgradeHeader}>
              <Text style={styles.upgradeName}>{clicker.name}</Text>
              {clicker.owned && (
                <View style={styles.levelBadge}>
                  <Text style={styles.levelText}>Level {clicker.level}</Text>
                </View>
              )}
            </View>
            
            <Text style={styles.upgradeDescription}>{clicker.description}</Text>
            
            <View style={styles.statsContainer}>
              <Text style={styles.statText}>
                Kliks/detik: {clicker.clicksPerSecond * (clicker.level > 0 ? clicker.level : 1)}
              </Text>
            </View>
            
            <TouchableOpacity 
              style={[
                styles.upgradeButton, 
                (clicker.owned ? 
                  (gameState.money < clicker.upgradeCost || clicker.level >= clicker.maxLevel) && styles.disabledButton 
                  : 
                  gameState.money < clicker.cost && styles.disabledButton
                )
              ]} 
              onPress={() => buyAutoClicker(clicker.id)}
              disabled={clicker.owned ? 
                (gameState.money < clicker.upgradeCost || clicker.level >= clicker.maxLevel) 
                : 
                gameState.money < clicker.cost}
            >
              <Text style={styles.buttonText}>
                {clicker.owned ? 
                  (clicker.level >= clicker.maxLevel ? 
                    'Level Maksimum' 
                    : 
                    `Upgrade (${formatMoney(clicker.upgradeCost)})`) 
                  : 
                  `Beli (${formatMoney(clicker.cost)})`}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
  },
  moneyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moneyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginLeft: 4,
  },
  upgradeList: {
    flex: 1,
    padding: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 12,
    marginLeft: 8,
    color: '#212121',
  },
  upgradeItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  upgradeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  upgradeName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  levelBadge: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  upgradeDescription: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 12,
  },
  statsContainer: {
    marginBottom: 12,
  },
  statText: {
    fontSize: 14,
    color: '#424242',
    marginBottom: 4,
  },
  upgradeButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#BDBDBD',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
}); 