import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import formatMoney from '../../utils/formatMoney';
import { useGameContext } from '../../context/GameContext';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

// Define tab type
type ShopTab = 'Boosters' | 'Characters' | 'Themes';

export default function ShopScreen() {
  const { gameState, buyBooster, buyCharacter, buyTheme, setActiveCharacter, setActiveTheme } = useGameContext();
  const [activeTab, setActiveTab] = useState<ShopTab>('Boosters');
  const cashIcon: IconName = "cash";

  // Render different content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'Boosters':
        return (
          <>
            {gameState.boosters.map(booster => (
              <View key={booster.id} style={styles.shopItem}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemName}>{booster.name}</Text>
                  {booster.owned && (
                    <View style={styles.ownedBadge}>
                      <Text style={styles.ownedText}>Dimiliki</Text>
                    </View>
                  )}
                </View>
                
                <Text style={styles.itemDescription}>{booster.description}</Text>
                
                <View style={styles.statsContainer}>
                  <Text style={styles.statText}>
                    Multiplier: {booster.multiplier}x
                  </Text>
                  <Text style={styles.statText}>
                    Durasi: {Math.floor(booster.duration / 1000)} detik
                  </Text>
                  <Text style={styles.statText}>
                    Cooldown: {Math.floor(booster.cooldown / 1000)} detik
                  </Text>
                </View>
                
                <TouchableOpacity 
                  style={[
                    styles.buyButton, 
                    (booster.owned || gameState.money < booster.cost) && styles.disabledButton
                  ]} 
                  onPress={() => buyBooster(booster.id)}
                  disabled={booster.owned || gameState.money < booster.cost}
                >
                  <Text style={styles.buttonText}>
                    {booster.owned ? 'Dimiliki' : `Beli (${formatMoney(booster.cost)})`}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </>
        );
        
      case 'Characters':
        return (
          <>
            {gameState.characters.filter(char => char.unlocked).map(character => (
              <View key={character.id} style={styles.shopItem}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemName}>{character.name}</Text>
                  {character.id === gameState.activeCharacterId && (
                    <View style={[styles.ownedBadge, styles.activeBadge]}>
                      <Text style={styles.ownedText}>Aktif</Text>
                    </View>
                  )}
                </View>
                
                <Text style={styles.itemDescription}>{character.description}</Text>
                
                <View style={styles.statsContainer}>
                  <Text style={styles.statText}>
                    Click Multiplier: {character.clickMultiplier}x
                  </Text>
                  <Text style={styles.statText}>
                    Auto-Clicker Multiplier: {character.autoClickerMultiplier}x
                  </Text>
                </View>
                
                {character.owned ? (
                  <TouchableOpacity 
                    style={[
                      styles.useButton,
                      character.id === gameState.activeCharacterId && styles.activeButton
                    ]} 
                    onPress={() => setActiveCharacter(character.id)}
                    disabled={character.id === gameState.activeCharacterId}
                  >
                    <Text style={styles.buttonText}>
                      {character.id === gameState.activeCharacterId ? 'Digunakan' : 'Gunakan'}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity 
                    style={[
                      styles.buyButton, 
                      gameState.money < character.cost && styles.disabledButton
                    ]} 
                    onPress={() => buyCharacter(character.id)}
                    disabled={gameState.money < character.cost}
                  >
                    <Text style={styles.buttonText}>
                      Beli ({formatMoney(character.cost)})
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </>
        );
        
      case 'Themes':
        return (
          <>
            {gameState.themes.filter(theme => theme.unlocked).map(theme => (
              <View key={theme.id} style={styles.shopItem}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemName}>{theme.name}</Text>
                  {theme.id === gameState.activeThemeId && (
                    <View style={[styles.ownedBadge, styles.activeBadge]}>
                      <Text style={styles.ownedText}>Aktif</Text>
                    </View>
                  )}
                </View>
                
                <Text style={styles.itemDescription}>{theme.description}</Text>
                
                <View style={styles.colorPreview}>
                  <View style={[styles.colorSample, { backgroundColor: theme.primaryColor }]} />
                  <View style={[styles.colorSample, { backgroundColor: theme.secondaryColor }]} />
                  <View style={[styles.colorSample, { backgroundColor: theme.accentColor }]} />
                </View>
                
                {theme.owned ? (
                  <TouchableOpacity 
                    style={[
                      styles.useButton,
                      theme.id === gameState.activeThemeId && styles.activeButton
                    ]} 
                    onPress={() => setActiveTheme(theme.id)}
                    disabled={theme.id === gameState.activeThemeId}
                  >
                    <Text style={styles.buttonText}>
                      {theme.id === gameState.activeThemeId ? 'Digunakan' : 'Gunakan'}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity 
                    style={[
                      styles.buyButton, 
                      gameState.money < theme.cost && styles.disabledButton
                    ]} 
                    onPress={() => buyTheme(theme.id)}
                    disabled={gameState.money < theme.cost}
                  >
                    <Text style={styles.buttonText}>
                      Beli ({formatMoney(theme.cost)})
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </>
        );
    }
  };

  return (
    <View style={styles.container}>
      {/* Header menampilkan uang pemain */}
      <View style={styles.header}>
        <View style={styles.moneyContainer}>
          <MaterialCommunityIcons name={cashIcon} size={24} color="#4CAF50" />
          <Text style={styles.moneyText}>{formatMoney(gameState.money)}</Text>
        </View>
      </View>

      {/* Tab navigation */}
      <View style={styles.tabContainer}>
        {(['Boosters', 'Characters', 'Themes'] as ShopTab[]).map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Shop content */}
      <ScrollView style={styles.shopList}>
        {renderContent()}
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabButton: {
    borderBottomColor: '#2196F3',
  },
  tabText: {
    color: '#757575',
    fontSize: 14,
    fontWeight: 'bold',
  },
  activeTabText: {
    color: '#2196F3',
  },
  shopList: {
    flex: 1,
    padding: 8,
  },
  shopItem: {
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
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  ownedBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeBadge: {
    backgroundColor: '#9C27B0',
  },
  ownedText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  itemDescription: {
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
  colorPreview: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  colorSample: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  buyButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  useButton: {
    backgroundColor: '#FF9800',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#9C27B0',
  },
  disabledButton: {
    backgroundColor: '#BDBDBD',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
}); 