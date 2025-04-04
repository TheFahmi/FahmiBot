import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  Image, 
  Alert,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useGameContext } from '../context/GameContext';
import { Booster, BOOSTERS } from '../constants/Boosters';
import formatMoney from '../utils/formatMoney';

interface BoosterItemProps {
  booster: Booster;
  isUnlocked: boolean;
  onPress: () => void;
}

const BoosterItem: React.FC<BoosterItemProps> = ({ booster, isUnlocked, onPress }) => {
  const { gameState } = useGameContext();
  const canAfford = gameState.money >= booster.price;
  
  // Menentukan warna latar belakang berdasarkan tipe booster
  const getBgColor = () => {
    return booster.color + '20'; // Menambahkan transparansi pada warna
  };
  
  // Mendapatkan teks durasi booster
  const getDurationText = (duration: number) => {
    if (duration === 0) return 'Instan';
    if (duration < 60) return `${duration} detik`;
    return `${Math.floor(duration / 60)} menit`;
  };
  
  return (
    <TouchableOpacity 
      style={[
        styles.boosterItem, 
        { backgroundColor: getBgColor() },
        !isUnlocked && styles.boosterItemLocked,
        !canAfford && isUnlocked && styles.boosterItemUnaffordable
      ]}
      onPress={onPress}
      disabled={!isUnlocked || !canAfford}
    >
      <View style={styles.boosterIconContainer}>
        <MaterialCommunityIcons 
          name={booster.icon as any} 
          size={32} 
          color={booster.color} 
        />
      </View>
      
      <View style={styles.boosterInfo}>
        <Text style={styles.boosterName}>{booster.name}</Text>
        <Text style={styles.boosterDescription}>{booster.description}</Text>
        
        <View style={styles.boosterDetailsRow}>
          {booster.duration > 0 && (
            <View style={styles.boosterDetail}>
              <MaterialCommunityIcons name="clock-outline" size={14} color="#BBB" />
              <Text style={styles.boosterDetailText}>{getDurationText(booster.duration)}</Text>
            </View>
          )}
          
          <View style={styles.boosterDetail}>
            <MaterialCommunityIcons name="trending-up" size={14} color="#BBB" />
            <Text style={styles.boosterDetailText}>
              {booster.type === 'multiplier' && `${booster.value}x Income`}
              {booster.type === 'tap_power' && `${booster.value}x Tap`}
              {booster.type === 'auto_click' && `${booster.value} Click/sec`}
              {booster.type === 'instant_cash' && `${booster.value}s Worth`}
              {booster.type === 'speed_up' && `${booster.value}x Speed`}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.boosterPriceContainer}>
        {!isUnlocked ? (
          <MaterialCommunityIcons name="lock" size={24} color="#777" />
        ) : (
          <TouchableOpacity 
            style={[styles.buyButton, !canAfford && styles.buyButtonDisabled]}
            onPress={onPress}
            disabled={!canAfford}
          >
            <Text style={styles.buyButtonText}>Beli</Text>
            <Text style={styles.buyButtonPrice}>{formatMoney(booster.price)}</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default function BoostersScreen() {
  const { gameState, buyBooster } = useGameContext();
  const [refreshing, setRefreshing] = useState(false);
  
  // Mengecek apakah booster sudah terbuka
  const isBoosterUnlocked = (booster: Booster): boolean => {
    if (!booster.unlockRequirement) return true;
    
    if (booster.unlockRequirement.money && gameState.money < booster.unlockRequirement.money) {
      return false;
    }
    
    if (booster.unlockRequirement.businessLevel) {
      const { id, level } = booster.unlockRequirement.businessLevel;
      // Sederhanakan saja untuk menghindari error dengan business yang belum diimplementasi
      // Untuk sementara, gunakan level upgrade sebagai pengganti
      const business = gameState.upgrades.find(u => u.id === id);
      if (!business || business.level < level) {
        return false;
      }
    }
    
    return true;
  };
  
  // Meng-handle pembelian booster
  const handleBuyBooster = (booster: Booster) => {
    if (gameState.money < booster.price) {
      Alert.alert('Uang Tidak Cukup', 'Anda tidak memiliki cukup uang untuk membeli booster ini.');
      return;
    }
    
    buyBooster(booster.id);
    
    if (booster.type === 'instant_cash') {
      Alert.alert(
        'Booster Digunakan',
        `Anda mendapatkan ${formatMoney(gameState.moneyPerSecond * booster.value)} dari booster Instant Cash!`
      );
    } else {
      Alert.alert(
        'Booster Aktif',
        `${booster.name} sekarang aktif selama ${booster.duration < 60 ? 
          `${booster.duration} detik` : `${Math.floor(booster.duration / 60)} menit`}!`
      );
    }
  };
  
  // Menampilkan daftar booster aktif
  const renderActiveBoosters = () => {
    const activeBoosters = gameState.activeBoosters.filter((b) => b.expiresAt > Date.now());
    
    if (activeBoosters.length === 0) {
      return null;
    }
    
    return (
      <View style={styles.activeBoosters}>
        <Text style={styles.sectionTitle}>Booster Aktif</Text>
        
        {activeBoosters.map((booster) => {
          const timeLeft = Math.max(0, Math.floor((booster.expiresAt - Date.now()) / 1000));
          const minutes = Math.floor(timeLeft / 60);
          const seconds = timeLeft % 60;
          
          return (
            <View key={`${booster.id}-${booster.startedAt}`} style={styles.activeBoosterItem}>
              <MaterialCommunityIcons name={booster.icon as any} size={24} color={booster.color} />
              
              <View style={styles.activeBoosterInfo}>
                <Text style={styles.activeBoosterName}>{booster.name}</Text>
                <Text style={styles.activeBoosterEffect}>
                  {booster.type === 'multiplier' && `${booster.value}x pendapatan`}
                  {booster.type === 'tap_power' && `${booster.value}x kekuatan tap`}
                  {booster.type === 'auto_click' && `${booster.value} klik/detik`}
                  {booster.type === 'speed_up' && `${booster.value}x kecepatan`}
                </Text>
              </View>
              
              <Text style={[styles.activeBoosterTime, { color: booster.color }]}>
                {`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`}
              </Text>
            </View>
          );
        })}
      </View>
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Boosters</Text>
        <View style={styles.moneyContainer}>
          <MaterialCommunityIcons name="cash" size={18} color="#4CAF50" />
          <Text style={styles.moneyText}>{formatMoney(gameState.money)}</Text>
        </View>
      </View>
      
      {renderActiveBoosters()}
      
      <FlatList
        data={BOOSTERS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BoosterItem
            booster={item}
            isUnlocked={isBoosterUnlocked(item)}
            onPress={() => handleBuyBooster(item)}
          />
        )}
        contentContainerStyle={styles.boostersList}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={() => {
          setRefreshing(true);
          setTimeout(() => setRefreshing(false), 1000);
        }}
      />
    </SafeAreaView>
  );
}

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
  boostersList: {
    padding: 16,
  },
  boosterItem: {
    flexDirection: 'row',
    marginBottom: 12,
    borderRadius: 8,
    padding: 12,
    overflow: 'hidden',
  },
  boosterItemLocked: {
    opacity: 0.5,
  },
  boosterItemUnaffordable: {
    opacity: 0.7,
  },
  boosterIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  boosterInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  boosterName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  boosterDescription: {
    fontSize: 12,
    color: '#BBBBBB',
    marginBottom: 8,
  },
  boosterDetailsRow: {
    flexDirection: 'row',
  },
  boosterDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  boosterDetailText: {
    fontSize: 12,
    color: '#BBBBBB',
    marginLeft: 4,
  },
  boosterPriceContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  buyButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
    minWidth: 70,
  },
  buyButtonDisabled: {
    backgroundColor: '#757575',
  },
  buyButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  buyButtonPrice: {
    color: 'white',
    fontSize: 10,
  },
  activeBoosters: {
    margin: 16,
    marginBottom: 0,
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    padding: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
  },
  activeBoosterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#252525',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  activeBoosterInfo: {
    flex: 1,
    marginLeft: 10,
  },
  activeBoosterName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  activeBoosterEffect: {
    fontSize: 12,
    color: '#BBBBBB',
  },
  activeBoosterTime: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});