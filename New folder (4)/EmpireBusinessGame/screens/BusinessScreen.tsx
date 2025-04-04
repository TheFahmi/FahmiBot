import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  StatusBar,
  FlatList,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useGameContext } from '../context/GameContext';
import formatMoney from '../utils/formatMoney';

interface Business {
  id: string;
  name: string;
  description: string;
  baseIncome: number;
  basePrice: number;
  icon: string;
  imagePath?: string;
  unlocked: boolean;
  level: number;
  managerUnlocked: boolean;
  cooldown: number;
  lastCollected?: number;
}

interface BusinessItemProps {
  business: Business;
  onCollect: (id: string) => void;
  onUpgrade: (id: string) => void;
}

const BusinessItem: React.FC<BusinessItemProps> = ({ business, onCollect, onUpgrade }) => {
  const { gameState } = useGameContext();
  const canAffordUpgrade = gameState.money >= calculateUpgradePrice(business);
  const [progress, setProgress] = useState(0);
  const [isCollectable, setIsCollectable] = useState(false);
  
  // Hitung harga upgrade berikutnya
  function calculateUpgradePrice(business: Business): number {
    return business.basePrice * Math.pow(1.15, business.level);
  }
  
  // Hitung pendapatan berdasarkan level
  function calculateIncome(business: Business): number {
    return business.baseIncome * business.level;
  }
  
  // Update progress bar dan status collectable
  useEffect(() => {
    if (!business.managerUnlocked) {
      return;
    }
    
    const interval = setInterval(() => {
      const now = Date.now();
      const lastCollected = business.lastCollected || now;
      const elapsed = now - lastCollected;
      const progressValue = Math.min(1, elapsed / (business.cooldown * 1000));
      
      setProgress(progressValue);
      setIsCollectable(progressValue >= 1);
    }, 100);
    
    return () => clearInterval(interval);
  }, [business]);
  
  return (
    <View style={styles.businessItem}>
      <View style={styles.businessHeader}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons 
            name={business.icon as any} 
            size={32} 
            color="#4CAF50" 
          />
        </View>
        
        <View style={styles.businessInfo}>
          <Text style={styles.businessName}>
            {business.name} Lvl {business.level}
          </Text>
          <Text style={styles.businessDescription}>{business.description}</Text>
          
          <View style={styles.incomeContainer}>
            <MaterialCommunityIcons name="cash-multiple" size={16} color="#4CAF50" />
            <Text style={styles.incomeText}>
              {formatMoney(calculateIncome(business))}
            </Text>
            
            {business.managerUnlocked && (
              <View style={styles.managerBadge}>
                <MaterialCommunityIcons name="account-tie" size={12} color="white" />
                <Text style={styles.managerText}>Auto</Text>
              </View>
            )}
          </View>
        </View>
      </View>
      
      {business.managerUnlocked ? (
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
        </View>
      ) : (
        <TouchableOpacity 
          style={styles.collectButton}
          onPress={() => onCollect(business.id)}
        >
          <Text style={styles.collectButtonText}>Kumpulkan</Text>
          <MaterialCommunityIcons name="cash" size={16} color="white" />
        </TouchableOpacity>
      )}
      
      <TouchableOpacity 
        style={[
          styles.upgradeButton,
          !canAffordUpgrade && styles.disabledButton
        ]}
        onPress={() => onUpgrade(business.id)}
        disabled={!canAffordUpgrade}
      >
        <Text style={styles.upgradeButtonText}>
          Upgrade {formatMoney(calculateUpgradePrice(business))}
        </Text>
        <MaterialCommunityIcons name="arrow-up-bold-circle" size={16} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const BusinessScreen: React.FC = () => {
  const { gameState, collectBusinessIncome, upgradeBusiness, loadBusinesses } = useGameContext();
  const [refreshing, setRefreshing] = useState(false);
  const [offlineEarningsVisible, setOfflineEarningsVisible] = useState(false);
  
  // Muat data bisnis jika belum ada
  useEffect(() => {
    if (gameState.businesses.length === 0) {
      loadBusinesses();
    }
  }, []);
  
  // Periksa apakah ada pendapatan offline
  useEffect(() => {
    if (gameState.offlineEarnings > 0) {
      setOfflineEarningsVisible(true);
    }
  }, [gameState.offlineEarnings]);
  
  // Fungsi untuk mengumpulkan pendapatan offline
  const collectOfflineEarnings = () => {
    // Panggil fungsi yang sesuai dari context
    if (gameState.offlineEarnings > 0) {
      // Asumsikan fungsi ini ada di context
      gameState.collectOfflineEarnings(false);
      setOfflineEarningsVisible(false);
    }
  };
  
  // Fungsi untuk menyegarkan halaman
  const onRefresh = () => {
    setRefreshing(true);
    
    // Simulasikan waktu pemuatan
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header dengan uang pemain */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bisnis Imperium</Text>
        <View style={styles.moneyContainer}>
          <MaterialCommunityIcons name="cash" size={24} color="#4CAF50" />
          <Text style={styles.moneyText}>{formatMoney(gameState.money)}</Text>
        </View>
      </View>
      
      {/* Notifikasi pendapatan offline */}
      {offlineEarningsVisible && (
        <TouchableOpacity 
          style={styles.offlineEarningsContainer}
          onPress={collectOfflineEarnings}
        >
          <MaterialCommunityIcons name="clock-time-eight" size={24} color="#FFC107" />
          <Text style={styles.offlineEarningsText}>
            Anda mendapatkan {formatMoney(gameState.offlineEarnings)} saat offline!
          </Text>
          <Text style={styles.collectText}>Ketuk untuk mengumpulkan</Text>
        </TouchableOpacity>
      )}
      
      {/* Daftar bisnis */}
      <FlatList
        data={gameState.businesses.filter(b => b.unlocked).sort((a, b) => a.basePrice - b.basePrice)}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.businessList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <BusinessItem
            business={item}
            onCollect={collectBusinessIncome}
            onUpgrade={upgradeBusiness}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="store-off" size={48} color="#999" />
            <Text style={styles.emptyText}>Belum ada bisnis yang terbuka</Text>
            <Text style={styles.emptySubtext}>Mulai dengan membeli bisnis pertama Anda</Text>
          </View>
        }
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
    paddingTop: 16,
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
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  moneyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 4,
  },
  offlineEarningsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#302C1B',
    padding: 12,
    margin: 16,
    marginBottom: 8,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
  },
  offlineEarningsText: {
    flex: 1,
    fontSize: 14,
    color: 'white',
    marginLeft: 8,
  },
  collectText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  businessList: {
    padding: 16,
    paddingBottom: 100,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    color: '#BBB',
    marginTop: 12,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  businessItem: {
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  businessHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  businessInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  businessName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  businessDescription: {
    fontSize: 12,
    color: '#BBB',
    marginBottom: 6,
  },
  incomeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  incomeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginLeft: 4,
  },
  managerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  managerText: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 2,
  },
  progressContainer: {
    height: 6,
    backgroundColor: '#333',
    borderRadius: 3,
    marginVertical: 12,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  collectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginBottom: 8,
  },
  collectButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginRight: 6,
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF9800',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  upgradeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginRight: 6,
  },
  disabledButton: {
    backgroundColor: '#444',
  },
});

export default BusinessScreen; 