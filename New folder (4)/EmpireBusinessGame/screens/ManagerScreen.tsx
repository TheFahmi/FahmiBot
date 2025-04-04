import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useGameContext } from '../contexts/GameContext';
import ManagerItem from '../components/ManagerItem';
import formatMoney from '../utils/formatMoney';
import initialManagers from '../data/initialManagers';
import initialBusinesses from '../data/initialBusinesses';
import { Manager } from '../data/initialManagers';

const ManagerScreen: React.FC = () => {
  const { state, dispatch } = useGameContext();
  const { money, businesses = {} } = state;
  
  // Persiapkan data manager
  const managers = Object.values(initialManagers).map(manager => {
    const business = businesses?.[manager.businessId];
    
    // Manager hanya tersedia jika bisnis terkait sudah terbuka
    const available = business?.unlocked === true;
    
    // Manager sudah dibeli jika bisnis terkait memiliki manager
    const unlocked = business?.managerUnlocked === true;
    
    return {
      ...manager,
      unlocked: unlocked || false,
      available: available || false,
    };
  });

  // Fungsi untuk memfilter manager yang tersedia
  const getAvailableManagers = () => {
    if (!managers || !Array.isArray(managers)) return [];
    return managers.filter(manager => manager.available && !manager.unlocked);
  };

  // Fungsi untuk memfilter manager yang sudah dibeli
  const getUnlockedManagers = () => {
    if (!managers || !Array.isArray(managers)) return [];
    return managers.filter(manager => manager.unlocked);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      
      {/* Header dengan uang pemain */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Manager</Text>
        <View style={styles.moneyContainer}>
          <MaterialCommunityIcons name="currency-usd" size={24} color="#4CAF50" />
          <Text style={styles.moneyText}>{formatMoney(money)}</Text>
        </View>
      </View>
      
      {/* Informasi tentang manager */}
      <View style={styles.infoContainer}>
        <MaterialCommunityIcons name="information" size={20} color="#3F51B5" />
        <Text style={styles.infoText}>
          Manager akan menjalankan bisnis secara otomatis, bahkan saat Anda tidak aktif!
        </Text>
      </View>
      
      {/* Bagian Manager Tersedia */}
      <View style={styles.sectionHeader}>
        <MaterialCommunityIcons name="account-tie" size={20} color="#333" />
        <Text style={styles.sectionTitle}>Tersedia untuk Direkrut</Text>
      </View>
      
      <FlatList
        data={getAvailableManagers()}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.managerList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Belum ada manager yang tersedia. Buka lebih banyak bisnis!
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <ManagerItem
            id={item.id}
            businessId={item.businessId}
            name={item.name}
            description={item.description}
            price={item.price}
            icon={item.icon}
            imagePath={item.imagePath}
            unlocked={item.unlocked}
            businessName={item.businessName}
          />
        )}
      />
      
      {/* Bagian Manager Sudah Dibeli */}
      {getUnlockedManagers().length > 0 && (
        <>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="check-circle" size={20} color="#4CAF50" />
            <Text style={styles.sectionTitle}>Manager Terekrut</Text>
          </View>
          
          <FlatList
            data={getUnlockedManagers()}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.managerList}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <ManagerItem
                id={item.id}
                businessId={item.businessId}
                name={item.name}
                description={item.description}
                price={item.price}
                icon={item.icon}
                imagePath={item.imagePath}
                unlocked={item.unlocked}
                businessName={item.businessName}
              />
            )}
          />
        </>
      )}
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  managerList: {
    padding: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

export default ManagerScreen; 