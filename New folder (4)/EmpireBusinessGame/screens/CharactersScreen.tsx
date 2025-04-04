import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  Alert,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useGameContext } from '../context/GameContext';
import formatMoney from '../utils/formatMoney';
import { Character } from '../constants/Characters';

interface CharacterItemProps {
  id: string;
  name: string;
  description: string;
  perk: {
    type: 'click_bonus' | 'auto_bonus' | 'mission_bonus' | 'booster_duration';
    value: number;
    description: string;
  };
  price: number;
  icon: string;
  color: string;
  unlocked: boolean;
  isActive: boolean;
  onBuy: () => void;
  onSelect: () => void;
}

const CharacterItem: React.FC<CharacterItemProps> = ({
  id,
  name,
  description,
  perk,
  price,
  icon,
  color,
  unlocked,
  isActive,
  onBuy,
  onSelect
}) => {
  const { gameState } = useGameContext();
  const canAfford = gameState.money >= price;
  
  return (
    <View style={[
      styles.characterItem, 
      isActive && styles.activeCharacterItem
    ]}>
      <View style={styles.characterHeader}>
        <View style={styles.characterInfo}>
          <Text style={styles.characterName}>{name}</Text>
          
          <View style={styles.bonusContainer}>
            <MaterialCommunityIcons 
              name={getPerkIcon(perk.type)} 
              size={14} 
              color="#FFB74D" 
            />
            <Text style={styles.bonusText}>
              {perk.description}
            </Text>
          </View>
          
          <Text style={styles.characterDescription}>{description}</Text>
        </View>
        
        <View style={styles.characterIconContainer}>
          <MaterialCommunityIcons 
            name={icon as any} 
            size={50} 
            color={isActive ? '#4CAF50' : color} 
          />
          {isActive && (
            <View style={styles.activeIndicator}>
              <MaterialCommunityIcons name="check-circle" size={18} color="#4CAF50" />
            </View>
          )}
        </View>
      </View>
      
      {unlocked ? (
        <TouchableOpacity 
          style={[
            styles.selectButton,
            isActive && styles.activeButton
          ]}
          onPress={onSelect}
          disabled={isActive}
        >
          <Text style={styles.selectButtonText}>
            {isActive ? 'Aktif' : 'Pilih Karakter'}
          </Text>
        </TouchableOpacity>
      ) : (
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
            Beli {formatMoney(price)}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// Mendapatkan ikon berdasarkan jenis perk
const getPerkIcon = (perkType: string): any => {
  switch (perkType) {
    case 'click_bonus':
      return 'gesture-tap';
    case 'auto_bonus':
      return 'timer-outline';
    case 'mission_bonus':
      return 'medal';
    case 'booster_duration':
      return 'rocket-launch';
    default:
      return 'star';
  }
};

const CharactersScreen: React.FC = () => {
  const { gameState, buyCharacter, setActiveCharacter } = useGameContext();
  
  // Handler untuk membeli karakter
  const handleBuyCharacter = (characterId: string) => {
    if (!buyCharacter) {
      Alert.alert('Error', 'Fungsi untuk membeli karakter tidak tersedia.');
      return;
    }
    
    buyCharacter(characterId);
  };
  
  // Handler untuk memilih karakter
  const handleSelectCharacter = (characterId: string) => {
    if (!setActiveCharacter) {
      Alert.alert('Error', 'Fungsi untuk memilih karakter tidak tersedia.');
      return;
    }
    
    setActiveCharacter(characterId);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Karakter</Text>
        <View style={styles.moneyContainer}>
          <MaterialCommunityIcons name="cash" size={18} color="#4CAF50" />
          <Text style={styles.moneyText}>{formatMoney(gameState.money)}</Text>
        </View>
      </View>
      
      <View style={styles.infoContainer}>
        <MaterialCommunityIcons name="information" size={20} color="#64B5F6" />
        <Text style={styles.infoText}>
          Karakter memberikan bonus spesial untuk meningkatkan pendapatan Anda. Pilih karakter yang sesuai dengan gaya bermain Anda!
        </Text>
      </View>
      
      <FlatList
        data={gameState.characters}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CharacterItem
            id={item.id}
            name={item.name}
            description={item.description}
            perk={item.perk}
            price={item.price}
            icon={item.icon}
            color={item.color}
            unlocked={item.unlocked}
            isActive={item.id === gameState.activeCharacterId}
            onBuy={() => handleBuyCharacter(item.id)}
            onSelect={() => handleSelectCharacter(item.id)}
          />
        )}
        contentContainerStyle={styles.charactersList}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  moneyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  moneyText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  infoContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(100, 181, 246, 0.1)',
    padding: 12,
    margin: 16,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#64B5F6',
  },
  infoText: {
    flex: 1,
    color: '#BBBBBB',
    fontSize: 14,
    marginLeft: 8,
  },
  charactersList: {
    padding: 16,
    paddingTop: 0,
  },
  characterItem: {
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  activeCharacterItem: {
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  characterHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  characterInfo: {
    flex: 1,
  },
  characterName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  bonusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  bonusText: {
    fontSize: 12,
    color: '#FFB74D',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  characterDescription: {
    fontSize: 14,
    color: '#BBBBBB',
  },
  characterIconContainer: {
    marginLeft: 12,
    position: 'relative',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#121212',
    borderRadius: 10,
  },
  buyButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: '#424242',
  },
  selectButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#4CAF50',
  },
  buyButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  selectButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default CharactersScreen; 