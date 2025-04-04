import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import formatMoney from '../../utils/formatMoney';
import { useGameContext } from '../../context/GameContext';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

export default function BusinessScreen() {
  const router = useRouter();
  const { gameState, buyUpgrade, clickMoney } = useGameContext();
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

      {/* Daftar Upgrade */}
      <ScrollView style={styles.businessList}>
        {gameState.upgrades.filter(upgrade => upgrade.unlocked).map(upgrade => (
          <View key={upgrade.id} style={styles.upgradeItem}>
            <Text style={styles.upgradeName}>{upgrade.name}</Text>
            <Text style={styles.upgradeDescription}>{upgrade.description}</Text>
            <TouchableOpacity 
              style={[styles.upgradeButton, gameState.money < upgrade.cost && styles.disabledButton]} 
              onPress={() => buyUpgrade(upgrade.id)}
              disabled={gameState.money < upgrade.cost}
            >
              <Text style={styles.buttonText}>
                Upgrade ({formatMoney(upgrade.cost)})
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
  businessList: {
    flex: 1,
  },
  upgradeItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    margin: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  upgradeName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  upgradeDescription: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 12,
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